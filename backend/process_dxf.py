import ezdxf
from shapely.geometry import Polygon, Point
import json
import sys
from datetime import datetime

# Load factors (Watts/m2)
LOAD_FACTORS = {
    "OFFICE": {"lighting": 10, "sockets": 25},
    "BEDROOM": {"lighting": 8, "sockets": 20},
    "LIVING": {"lighting": 9, "sockets": 22},
    "KITCHEN": {"lighting": 15, "sockets": 35},
    "TOILET": {"lighting": 8, "sockets": 10},
    "DEFAULT": {"lighting": 8, "sockets": 15}
}

def process_dxf(file_path):
    """Process DXF file and return structured data"""
    try:
        doc = ezdxf.readfile(file_path)
        msp = doc.modelspace()

        polylines = []
        texts = []

        # Collect text entities
        for e in msp:
            if e.dxftype() in ["TEXT", "MTEXT"]:
                try:
                    txt = e.dxf.text if e.dxftype() == "TEXT" else e.plain_text()
                    txt = txt.strip().upper()
                    ins = e.dxf.insert
                    texts.append((txt, Point(ins.x, ins.y)))
                except:
                    pass

        # Collect room polylines
        for e in msp:
            if e.dxftype() == "LWPOLYLINE":
                points = [(p[0], p[1]) for p in e.get_points()]
                
                if len(points) < 3:
                    continue
                if points[0] != points[-1]:
                    points.append(points[0])

                try:
                    poly = Polygon(points)
                    area = poly.area  # Assuming drawing is in meters
                    
                    if area > 1.0:  # Filter small areas
                        polylines.append((poly, area))
                except:
                    continue

        polylines.sort(key=lambda x: x[1])

        rooms_data = []
        total_load = 0

        # Match text to rooms
        for i, (poly, area) in enumerate(polylines):
            room_name = "UNKNOWN"
            room_type = "DEFAULT"
            
            for txt, pt in texts:
                if poly.contains(pt):
                    room_name = txt
                    room_type = txt.split("_")[0].split(" ")[0]
                    break
            
            # Skip outer boundaries
            if room_name == "UNKNOWN" and area > 5000:
                continue

            factors = LOAD_FACTORS.get(room_type, LOAD_FACTORS["DEFAULT"])
            
            light_w = area * factors["lighting"]
            sock_w = area * factors["sockets"]
            room_total = light_w + sock_w
            total_load += room_total

            rooms_data.append({
                "id": len(rooms_data) + 1,
                "name": room_name,
                "type": room_type,
                "area": round(area, 2),
                "lightingLoad": round(light_w, 2),
                "socketsLoad": round(sock_w, 2),
                "totalLoad": round(room_total, 2)
            })

        return {
            "success": True,
            "rooms": rooms_data,
            "totalLoad": round(total_load, 2),
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({
            "success": False,
            "error": "No file path provided"
        }))
        sys.exit(1)
    
    file_path = sys.argv[1]
    result = process_dxf(file_path)
    print(json.dumps(result, indent=2))
