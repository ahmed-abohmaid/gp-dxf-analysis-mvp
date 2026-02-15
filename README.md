# Ain Shams University Electrical Load Estimation Dashboard — Senior Design (EE)

Ain Shams University Electrical Engineering capstone project: a React + TypeScript web dashboard for analyzing AutoCAD DXF files and calculating room-by-room electrical load estimations (lighting and sockets).

## Keywords

Ain Shams University, electrical engineering, capstone, senior design, AutoCAD DXF, electrical load estimation, building services, load calculator

## Features

- 🎨 **Modern UI**: Built with React, TypeScript, and shadcn/ui components
- 📁 **Drag & Drop**: Easy file upload with drag-and-drop support
- 📊 **Detailed Analysis**: Room-by-room breakdown with lighting and socket loads
- 🎯 **Clean Architecture**: Feature-based structure following SOLID principles
- ⚡ **Fast Processing**: Quick DXF file analysis
- 🎭 **Beautiful Design**: Distinctive UI with smooth animations

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui (custom implementation)
- **Styling**: TailwindCSS with custom design system
- **Icons**: Lucide React
- **Backend**: Node.js with TypeScript, Express, dxf-parser, @flatten-js/core
- **Code Quality**: ESLint, Prettier

## Project Structure

```
load-dashboard/
├── src/
│   ├── components/
│   │   └── ui/              # Reusable UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── table.tsx
│   │       └── alert.tsx
│   ├── features/
│   │   ├── upload/          # File upload feature
│   │   │   └── FileUpload.tsx
│   │   └── results/         # Results display feature
│   │       └── ResultsDisplay.tsx
│   ├── lib/
│   │   ├── utils.ts         # Utility functions
│   │   └── dxf-processor.ts # DXF processing service
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── backend/
│   ├── server.js            # Express API server
│   ├── dxf-processor.ts     # DXF processing logic
│   ├── config.ts            # Configuration management
│   └── errors.ts            # Custom error classes
└── package.json
```

## Installation

### Prerequisites

- Node.js 18+ and npm

### Frontend Setup

```bash
# Navigate to project directory
cd load-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start backend server
npm run dev
```

The backend API will be available at `http://localhost:5000`

## Usage

### Development

```bash
# Start dev server with hot reload
npm run dev

# Run linter
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Preview production build
npm run preview
```

### Processing DXF Files

The TypeScript backend processes DXF files via HTTP API:

```bash
# Upload a DXF file to the backend
curl -X POST http://localhost:5000/api/process-dxf \
  -F "file=@path/to/file.dxf"
```

Output format:

```json
{
  "success": true,
  "rooms": [
    {
      "id": 1,
      "name": "OFFICE_1",
      "type": "OFFICE",
      "area": 25.5,
      "lightingLoad": 255,
      "socketsLoad": 637.5,
      "totalLoad": 892.5
    }
  ],
  "totalLoad": 3298.7,
  "timestamp": "2025-02-14T12:00:00.000Z"
}
```

## Load Factors

The system uses the following load factors (Watts/m²) configured in `backend/config.ts`:

| Room Type | Lighting | Sockets | Total   |
| --------- | -------- | ------- | ------- |
| OFFICE    | 10 W/m²  | 25 W/m² | 35 W/m² |
| BEDROOM   | 8 W/m²   | 20 W/m² | 28 W/m² |
| LIVING    | 9 W/m²   | 22 W/m² | 31 W/m² |
| KITCHEN   | 15 W/m²  | 35 W/m² | 50 W/m² |
| TOILET    | 8 W/m²   | 10 W/m² | 18 W/m² |
| DEFAULT   | 8 W/m²   | 15 W/m² | 23 W/m² |

## Configuration

The backend can be configured via environment variables. Create a `.env` file in the `backend/` directory:

```env
PORT=5000
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

For frontend configuration, create `.env` in the project root:

```env
VITE_API_URL=http://localhost:5000
```

    # Save temporarily
    temp_path = f'/tmp/{file.filename}'
    file.save(temp_path)

    # Process
    result = process_dxf(temp_path)

    # Cleanup
    os.remove(temp_path)

    return jsonify(result)

if **name** == '**main**':
app.run(debug=True)

````

## Design Principles

### Single Responsibility Principle

- Each component has one clear purpose
- Features are isolated in their own directories
- Utility functions are separated from business logic

### Reusability

- UI components are generic and reusable
- Type definitions are centralized
- Shared utilities in `lib/` directory

### Clean Architecture

- Feature-based folder structure
- Clear separation of concerns
- Type-safe with TypeScript

## Customization

### Modifying Load Factors

Edit the `LOAD_FACTORS` dictionary in `backend/process_dxf.py`:

```python
LOAD_FACTORS = {
    "OFFICE": {"lighting": 12, "sockets": 30},  # Modified values
    "CUSTOM_TYPE": {"lighting": 10, "sockets": 20},  # New type
}
````

### Styling

The design system uses:

- **Font**: DM Sans (distinctive, modern)
- **Colors**: Blue-focused palette with gradients
- **Animations**: Smooth transitions and staggered reveals
- **Layout**: Clean, spacious with clear hierarchy

Modify `src/index.css` for global styles or `tailwind.config.js` for theme changes.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT License - Feel free to use for your graduation project!

## Credits

Built for Graduation Project • Fall 2025
