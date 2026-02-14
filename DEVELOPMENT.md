# Development Guide

## Quick Start

### Option 1: Automatic Setup
```bash
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

#### Frontend
```bash
npm install
npm run dev
```

#### Backend (Node.js + Python)
```bash
# Terminal 1 - Node.js API
cd backend
npm install
npm start

# Terminal 2 - Frontend
npm run dev
```

## Development Workflow

### Running the Application

1. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev  # Uses nodemon for auto-reload
   ```

2. **Start Frontend** (Terminal 2):
   ```bash
   npm run dev  # Vite dev server with HMR
   ```

3. Open browser: `http://localhost:5173`

### Code Quality

```bash
# Check TypeScript types
npm run build

# Lint code
npm run lint

# Format code
npm run format

# Fix linting issues
npm run lint -- --fix
```

## Project Architecture

### Frontend Structure

```
src/
├── components/ui/       # Reusable UI components (Button, Card, Table, etc.)
├── features/           # Feature modules
│   ├── upload/        # File upload functionality
│   └── results/       # Results display
├── lib/               # Utilities and services
│   ├── utils.ts       # Helper functions
│   └── dxf-processor.ts  # DXF processing service
├── types/             # TypeScript type definitions
└── App.tsx            # Main application
```

### Design Principles

1. **Feature-Based Organization**
   - Each feature has its own directory
   - Components are grouped by feature
   - Easy to add/remove features

2. **Single Responsibility**
   - Each component does one thing well
   - UI components are presentation-only
   - Business logic in services

3. **Reusability**
   - UI components are generic
   - Utilities are pure functions
   - Types are shared

### Component Guidelines

#### Creating New UI Components

```typescript
// src/components/ui/my-component.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface MyComponentProps {
  variant?: "default" | "secondary";
  className?: string;
  children: React.ReactNode;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  variant = "default",
  className,
  children
}) => {
  return (
    <div className={cn("base-styles", className)}>
      {children}
    </div>
  );
};
```

#### Creating New Features

```typescript
// src/features/my-feature/MyFeature.tsx
import React from "react";
import { Card } from "@/components/ui/card";

interface MyFeatureProps {
  data: SomeType;
  onAction: (value: string) => void;
}

export const MyFeature: React.FC<MyFeatureProps> = ({ data, onAction }) => {
  // Feature logic here
  return <Card>{/* Feature UI */}</Card>;
};
```

## Backend Integration

### Current Setup (Mock)
The frontend currently uses mock data in `src/lib/dxf-processor.ts`

### Integrating Real Backend

1. **Update Service**:
```typescript
// src/lib/dxf-processor.ts
private static async executePythonScript(file: File): Promise<LoadEstimationResult> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('http://localhost:5000/api/process-dxf', {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    throw new Error('Failed to process file');
  }
  
  return await response.json();
}
```

2. **Start Backend Server**:
```bash
cd backend
npm start
```

3. **Test Integration**:
   - Upload a DXF file
   - Check network tab for API calls
   - Verify response format

### API Endpoints

#### POST /api/process-dxf
Upload and process DXF file

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: file (DXF file)

**Response:**
```json
{
  "success": true,
  "rooms": [...],
  "totalLoad": 3298.7,
  "timestamp": "2025-02-14T12:00:00.000Z"
}
```

#### GET /api/health
Check API health

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-02-14T12:00:00.000Z"
}
```

## Styling Guide

### Design System

**Colors:**
- Primary: Blue (#3B82F6)
- Background: Gradient (slate-50 → blue-50)
- Text: Gray scale

**Typography:**
- Headings: DM Sans (bold)
- Body: DM Sans (regular)
- Code: JetBrains Mono

**Spacing:**
- Use Tailwind spacing scale
- Consistent padding/margins
- Generous whitespace

### Adding Custom Styles

1. **Tailwind Utilities** (preferred):
```tsx
<div className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100">
```

2. **CSS Modules** (for complex components):
```css
/* component.module.css */
.myComponent {
  @apply p-4 bg-white;
  custom-property: value;
}
```

3. **Global Styles** (sparingly):
```css
/* src/index.css */
.global-class {
  /* styles */
}
```

## Testing

### Manual Testing Checklist

- [ ] File upload works (drag & drop)
- [ ] File upload works (click to browse)
- [ ] Only DXF files are accepted
- [ ] Processing shows loading state
- [ ] Results display correctly
- [ ] Table is responsive
- [ ] "New Analysis" button resets state
- [ ] Error handling works

### Browser Testing

Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

### Optimization Tips

1. **Code Splitting**: Features auto-split by Vite
2. **Lazy Loading**: Import heavy components lazily
3. **Memoization**: Use React.memo for expensive components
4. **Bundle Size**: Monitor with `npm run build`

### Build Optimization

```bash
# Analyze bundle size
npm run build
# Check dist/ folder size
```

## Troubleshooting

### Common Issues

**1. Port Already in Use**
```bash
# Frontend (5173)
lsof -ti:5173 | xargs kill -9

# Backend (5000)
lsof -ti:5000 | xargs kill -9
```

**2. Python Dependencies**
```bash
pip3 install --upgrade ezdxf shapely
```

**3. Node Modules Issues**
```bash
rm -rf node_modules package-lock.json
npm install
```

**4. TypeScript Errors**
```bash
npm run build  # Check for type errors
```

## Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Render)
```bash
cd backend
# Deploy with Node.js 18+
# Add environment variables
```

## Contributing

### Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Format with Prettier
- Write descriptive comments
- Use meaningful variable names

### Commit Messages

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
```

## Resources

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [ezdxf Documentation](https://ezdxf.readthedocs.io/)
