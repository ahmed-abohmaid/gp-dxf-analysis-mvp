import express from 'express';
import multer from 'multer';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

app.post('/api/process-dxf', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  if (!req.file.originalname.endsWith('.dxf')) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: 'Invalid file type. Please upload a DXF file.' });
  }

  const pythonProcess = spawn('python', [
    path.join(__dirname, 'process_dxf.py'),
    req.file.path
  ]);

  let dataString = '';
  let errorString = '';

  pythonProcess.stdout.on('data', (data) => {
    dataString += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorString += data.toString();
  });

  pythonProcess.on('close', (code) => {
    // Cleanup uploaded file
    fs.unlinkSync(req.file.path);

    if (code !== 0) {
      console.error('Python process error:', errorString);
      return res.status(500).json({ 
        error: 'Failed to process DXF file',
        details: errorString 
      });
    }

    try {
      const result = JSON.parse(dataString);
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to parse processing results',
        details: error.message 
      });
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
