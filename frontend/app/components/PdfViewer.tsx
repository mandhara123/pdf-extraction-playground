// frontend/app/components/PdfViewer.tsx
'use client';
import { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';


// Set up PDF.js worker with explicit version
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const COLOR_MAP: Record<string, string> = {
  title: 'border-red-500',
  header: 'border-blue-500',
  paragraph: 'border-green-500',
  table: 'border-purple-500',
  figure: 'border-yellow-500',
};

interface Element {
  type: string;
  bbox: number[]; // [x_min, y_min, x_max, y_max] (0-1000 normalized)
  page: number;
}

interface PdfViewerProps {
  file: File;
  elements: Element[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const PdfViewer = ({ file, elements, currentPage, onPageChange }: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setError(null);
    onPageChange(1);
  }

  function onDocumentLoadError(error: Error) {
    console.error('PDF load error:', error);
    setError('Failed to load PDF file. Please ensure the file is a valid PDF.');
  }

  const handleResize = useCallback((width: number) => {
    setPageWidth(width);
  }, []);

  const annotations = elements.filter(e => e.page === currentPage);

  return (
    <div className="relative w-full h-full overflow-auto bg-gray-100 dark:bg-gray-800">
      {error ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-red-600 dark:text-red-400">
            <p className="text-lg font-semibold mb-2">PDF Loading Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      ) : (
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-600 dark:text-gray-300">Loading PDF...</p>
            </div>
          }
          className="mx-auto shadow-xl"
        >
        <div className="relative" ref={(el) => { if (el) handleResize(el.offsetWidth); }}>
          <Page 
            pageNumber={currentPage} 
            renderAnnotationLayer={true} 
            renderTextLayer={true} 
            width={pageWidth}
          />
          
          {/* Custom Bounding Box Overlays */}
          {pageWidth > 0 && annotations.map((el, index) => {
            // Denormalize bbox from 0-1000 to actual pixel coordinates
            const [x_min, y_min, x_max, y_max] = el.bbox.map(c => (c * pageWidth) / 1000);
            
            const height = y_max - y_min;
            const width = x_max - x_min;

            return (
              <div
                key={index}
                className={`absolute border-2 opacity-50 hover:opacity-100 transition-opacity ${COLOR_MAP[el.type] || 'border-gray-500'}`}
                style={{
                  left: x_min,
                  top: y_min,
                  width: width,
                  height: height,
                  zIndex: 10,
                  pointerEvents: 'none', 
                }}
                title={`Type: ${el.type}`}
              />
            );
          })}
        </div>
      </Document>
      )}
      
      {/* Page Navigation Controls */}
      {numPages && (
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 p-2 flex justify-center space-x-4 border-t dark:border-gray-700">
            <button 
                onClick={() => onPageChange(Math.max(1, currentPage - 1))} 
                disabled={currentPage <= 1}
                className="p-1 border rounded disabled:opacity-50"
            >
                Prev
            </button>
            <span>Page {currentPage} of {numPages}</span>
            <button 
                onClick={() => onPageChange(Math.min(numPages, currentPage + 1))} 
                disabled={currentPage >= numPages}
                className="p-1 border rounded disabled:opacity-50"
            >
                Next
            </button>
        </div>
      )}
    </div>
  );
};