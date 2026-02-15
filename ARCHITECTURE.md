# System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           React Application (Port 5173)                 │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │   App.tsx    │→ │ FileUpload   │→ │ DXFProcessor │ │ │
│  │  │  (Main UI)   │  │  (Feature)   │  │  (Service)   │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │ │
│  │         ↓                  ↓                  ↓         │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │ResultsDisplay│  │ UI Components│  │   Types      │ │ │
│  │  │  (Feature)   │  │(Button,Card) │  │   (TS)       │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Request (FormData)
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Backend Server (Port 5000)                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │               Express.js API Server                     │ │
│  │                                                          │ │
│  │  POST /api/process-dxf  ←→  Multer Upload Handler      │ │
│  │                                      ↓                   │ │
│  │                              ┌──────────────┐           │ │
│  │                              │ TypeScript Processor │           │ │
│  │                              │   Process    │           │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ spawn process
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Python Processor                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              process_dxf.py                             │ │
│  │                                                          │ │
│  │  1. Read DXF file (ezdxf)                              │ │
│  │  2. Extract polylines & text (shapely)                 │ │
│  │  3. Match rooms to text labels                         │ │
│  │  4. Calculate loads (area × factors)                   │ │
│  │  5. Return JSON result                                 │ │
│  └────────────────────────────────────────────────────────┘ │
│  │  1. Read DXF file (dxf-parser)                        │ │
│  │  2. Extract polylines & text (geometry processing)    │ │
│  │  3. Match rooms to text labels                         │ │
│  │  4. Calculate loads (area × factors)                   │ │
│  │  5. Return JSON result                                 │ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ JSON Response
                              ↓
                    Back to Express Server
                              │
                              │ JSON Response
                              ↓
                    Back to React Application
                              │
                              ↓
                    Display Results in Table
```

## Component Flow

### Frontend Components

```
App.tsx (Main Container)
  │
  ├─→ FileUpload Component
  │     │
  │     ├─→ Drag & Drop Zone
  │     ├─→ File Input
  │     └─→ Process Button
  │
  ├─→ ResultsDisplay Component
  │     │
  │     ├─→ Summary Card (Total Load)
  │     └─→ Detailed Table (Room Breakdown)
  │
  └─→ UI Components (Reusable)
        ├─→ Button
        ├─→ Card
        ├─→ Table
        └─→ Alert
```

### Data Flow

```
1. User Action
   DXF File Upload
        ↓
2. FileUpload Component
   Validates file (.dxf)
        ↓
3. DXFProcessorService
   Prepares request
        ↓
4. HTTP POST Request
   FormData with file
        ↓
5. Express Server
   Receives & saves file
        ↓
6. DXF Processing Script (TypeScript)
   Processes DXF file
        ↓
7. JSON Response
   { rooms, totalLoad }
        ↓
8. ResultsDisplay Component
   Renders table & summary
```

## Technology Stack Layers

```
┌─────────────────────────────────────────────┐
│         Presentation Layer                   │
│  • React 18 (UI Framework)                  │
│  • TypeScript (Type Safety)                 │
│  • Tailwind CSS (Styling)                   │
│  • Lucide Icons (Icons)                     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         Application Layer                    │
│  • Vite (Build Tool)                        │
│  • React Hooks (State Management)           │
│  • Custom Services (Business Logic)         │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         API Layer                            │
│  • Express.js (HTTP Server)                 │
│  • Multer (File Upload)                     │
│  • CORS (Cross-Origin)                      │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         Processing Layer                     │
│  • Node.js / TypeScript                      │
│  • dxf-parser (DXF Parsing)                  │
│  • @flatten-js/core (Geometry Processing)    │
└─────────────────────────────────────────────┘
```

## File Organization

```
load-dashboard/
│
├── Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/ui/     ← Reusable UI components
│   │   ├── features/          ← Feature modules
│   │   ├── lib/               ← Services & utilities
│   │   ├── types/             ← TypeScript types
│   │   └── App.tsx            ← Main application
│   └── package.json
│
├── Backend (Node.js TypeScript)
│   ├── server.js              ← Express API
│   ├── dxf-processor.ts       ← TypeScript DXF processor
│   └── package.json
│
└── Configuration
    ├── vite.config.ts         ← Build config
    ├── tsconfig.json          ← TypeScript config
    ├── tailwind.config.js     ← Styling config
    ├── .eslintrc.cjs          ← Linting rules
    └── .prettierrc            ← Formatting rules
```

## Design Patterns Used

### 1. Feature-Based Architecture

- Each feature in its own directory
- Self-contained with types and components
- Easy to add/remove features

### 2. Single Responsibility Principle

- Components do one thing well
- Services handle business logic
- UI components are presentational

### 3. Dependency Injection

- Props passed down from parent
- Services injected via imports
- Loose coupling between layers

### 4. Service Layer Pattern

- DXFProcessorService handles API calls
- Utilities provide helper functions
- Clean separation of concerns

## State Management

```
App.tsx (Top Level)
  │
  ├─→ results: LoadEstimationResult | null
  ├─→ isProcessing: boolean
  └─→ error: string | null
      │
      ├─→ Passed to FileUpload as props
      └─→ Passed to ResultsDisplay as props
```

## API Contract

### Request

```typescript
POST /api/process-dxf
Content-Type: multipart/form-data

file: <DXF File>
```

### Response

```typescript
{
  success: boolean,
  rooms: RoomData[],
  totalLoad: number,
  timestamp: string,
  error?: string
}
```

### Error Handling

```typescript
try {
  // Process file
} catch (error) {
  return {
    success: false,
    error: error.message,
  };
}
```

## Deployment Architecture

### Development

```
Local Machine
  ├── Frontend: http://localhost:5173
  └── Backend:  http://localhost:5000
```

### Production

```
Cloud Infrastructure
  ├── Frontend: Vercel/Netlify
  │   └── Static files (dist/)
  └── Backend: Railway/Render
      ├── Node.js server
      └── Python runtime
```

## Performance Considerations

1. **Bundle Splitting**: Vite automatically code-splits
2. **Lazy Loading**: Components loaded on demand
3. **Memoization**: React.memo for expensive renders
4. **Debouncing**: File upload validation
5. **Caching**: Browser caches static assets

## Security Measures

1. **File Validation**: Client & server-side
2. **CORS**: Configured for specific origins
3. **File Size Limits**: Multer configuration
4. **Input Sanitization**: File name & type checks
5. **Error Messages**: No sensitive info exposed

---

This architecture follows **best practices** for:

- ✅ Separation of concerns
- ✅ Maintainability
- ✅ Scalability
- ✅ Type safety
- ✅ Code reusability
