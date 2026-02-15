# 🚀 Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- Code editor (VS Code recommended)

## Installation

### Automatic Setup (Recommended)

```bash
cd load-dashboard
chmod +x setup.sh
./setup.sh
```

### Manual Setup

```bash
# 1. Install frontend dependencies
npm install

# 2. Install backend dependencies
cd backend
npm install
cd ..
```

## Running the App

### Full Stack Setup (Recommended)

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
npm run dev
```

Open http://localhost:5173 and upload a DXF file!

## Testing

1. Start the app (`npm run dev`)
2. Upload `Test_1.dxf` (provided in project)
3. Click "Process File"
4. View results in table

## Project Structure

```
load-dashboard/
├── src/               # Frontend source code
├── backend/           # Backend API & Python script
├── package.json       # Frontend dependencies
└── README.md          # Full documentation
```

## Common Commands

```bash
# Development
npm run dev           # Start dev server
npm run build         # Build for production

# Code Quality
npm run lint          # Check code
npm run format        # Format code

# Backend
cd backend && npm start    # Start API
```

## Next Steps

1. Read `README.md` for full documentation
2. Check `DEVELOPMENT.md` for development guide
3. Review `PROJECT_SUMMARY.md` for architecture overview
4. Customize load factors in `backend/process_dxf.py`
5. Modify UI in `src/` files

## Troubleshooting

**Port 5173 in use?**

```bash
lsof -ti:5173 | xargs kill -9
npm run dev
```

**Python errors?**

```bash
pip3 install --upgrade ezdxf shapely
```

**Build errors?**

```bash
rm -rf node_modules package-lock.json
npm install
```

## Getting Help

- Check inline code comments
- Review DEVELOPMENT.md
- Test with provided Test_1.dxf file

## What's Included

✅ Modern React + TypeScript dashboard
✅ shadcn/ui components with Tailwind CSS
✅ Drag-and-drop file upload
✅ DXF processing with Python
✅ Detailed load calculation table
✅ Clean, maintainable code
✅ Full documentation

**Ready to go!** 🎉

Start with `npm run dev` and upload a DXF file to see it in action!
