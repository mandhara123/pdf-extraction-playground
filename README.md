# PDF Extraction Playground

A comprehensive PDF extraction and analysis playground with multiple AI models and a modern web interface. This project integrates advanced PDF processing capabilities with a clean, responsive Next.js frontend.

## Features

### Backend (FastAPI)
- **Multiple Extraction Models**:
  - **Surya**: Advanced layout analysis and OCR
  - **Docling**: Structural extraction using PDFMiner.six
  - **Custom OCR**: LayoutParser + Tesseract pipeline
  
- **Advanced Processing**:
  - Born-digital text extraction with OCR fallback
  - Bounding box annotations for layout elements
  - Image extraction and processing
  - YAML front-matter metadata
  - ZIP download with extracted assets

### Frontend (Next.js)
- **Dual-Pane Interface**: Side-by-side PDF viewer and markdown output
- **Interactive PDF Viewer**: 
  - Element highlighting with color-coded bounding boxes
  - Page navigation controls
  - Responsive design with dark mode support
- **Rich Markdown Output**:
  - Syntax highlighting for code blocks
  - Table rendering with proper styling
  - Copy-to-clipboard functionality
  - Download extracted content as files

### Deployment Options
- **Local Development**: FastAPI server with hot reload
- **Cloud Deployment**: Modal platform integration
- **Frontend**: Vercel/Netlify compatible

## Quick Start

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python simple_app.py  # Local development
# OR
modal serve modal_app.py  # Cloud deployment
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev  # Development server
# OR
npm run build && npm start  # Production build
```

### Environment Configuration
Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
# OR for Modal deployment:
# NEXT_PUBLIC_API_BASE_URL=https://your-app--pdf-extraction-playground-fastapi-app.modal.run
```

## Technology Stack

### Backend
- **FastAPI**: High-performance API framework
- **Surya-OCR**: State-of-the-art layout analysis
- **PDFMiner.six**: Born-digital text extraction
- **LayoutParser**: Document layout understanding
- **Tesseract**: OCR engine for scanned documents
- **Pillow**: Image processing and annotation
- **Modal**: Serverless cloud deployment

### Frontend
- **Next.js 15**: React framework with app directory
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **React-PDF**: PDF rendering and navigation
- **React-Markdown**: Rich markdown display
- **React-Syntax-Highlighter**: Code syntax highlighting
- **React-Dropzone**: File upload interface

## API Endpoints

- `POST /extract/{model_id}` - Extract content from PDF
  - Models: `surya`, `docling`, `custom-ocr`
  - Query parameter: `download=true` for ZIP download
- `GET /health` - Health check endpoint

## Recent Updates

This codebase has been enhanced with advanced features from the [pdf-ML repository](https://github.com/v-s-v-i-s-h-w-a-s/pdf-ML.git), including:

- Enhanced OCR pipeline with fallback strategies
- Improved element detection and bounding box accuracy
- Rich metadata extraction with YAML front-matter
- Download functionality for extracted assets
- Modern responsive UI with dark mode support
- Performance optimizations and error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both backend and frontend
5. Submit a pull request

## License

MIT License - See LICENSE file for details