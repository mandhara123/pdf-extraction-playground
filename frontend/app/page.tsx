// app/page.tsx
'use client';
import { useState } from 'react';
import { UploadDropzone } from './components/UploadDropzone'; // Custom component for upload area
import { PdfViewer } from './components/PdfViewer';
import { MarkdownOutput } from './components/MarkdownOutput';

// Dummy types based on backend schema
interface Element { type: string; bbox: number[]; page: number; }
interface ExtractionResult {
    markdown_output: string;
    elements: Element[];
    metrics: { time_s: number; elements_count: number; word_count: number; };
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [modelId, setModelId] = useState<string>('surya');
  const [results, setResults] = useState<ExtractionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // NOTE: Replace with your actual Modal deployment URL
  const API_BASE_URL = "YOUR_MODAL_API_URL/api"; 

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setResults(null);
    setError(null);
    setCurrentPage(1); // Reset page

    const formData = new FormData();
    formData.append('file', uploadedFile);

    setIsLoading(true);
    try {
        const response = await fetch(`${API_BASE_URL}/extract/${modelId}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || 'Extraction failed on the server.');
        }

        const data: ExtractionResult = await response.json();
        setResults(data);

    } catch (e: any) {
        setError(e.message || 'An unknown error occurred during extraction.');
        setFile(null); // Clear file on failure
    } finally {
        setIsLoading(false);
    }
  };

  if (!file || !results) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <h1 className="text-3xl font-bold mb-6">PDF Extraction Playground</h1>
        
        {/* Model Selection */}
        <div className="mb-4">
          <label className="mr-4">Select Model:</label>
          <select value={modelId} onChange={(e) => setModelId(e.target.value)} className="p-2 border rounded">
            <option value="surya">Surya</option>
            <option value="docling">Docling</option>
            <option value="custom-ocr">Custom OCR</option>
          </select>
        </div>

        {/* Upload Component */}
        <UploadDropzone onFileUpload={handleFileUpload} isLoading={isLoading} error={error} />
      </div>
    );
  }

  // Main Dual-Pane Display
  return (
    <div className="h-screen flex flex-col">
      {/* Header/Metrics Bar */}
      <header className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800">
        <h1 className="text-xl font-bold">PDF: {file.name}</h1>
        <div className="flex space-x-4 text-sm">
            <span>Model: **{modelId.toUpperCase()}**</span>
            <span>Time: {results.metrics.time_s.toFixed(2)}s</span>
            <span>Elements: {results.metrics.elements_count}</span>
        </div>
        <button onClick={() => setFile(null)} className="text-red-500 hover:text-red-700">Clear File</button>
      </header>

      {/* Dual Pane Layout */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left Pane: PDF Viewer with Annotations */}
        <div className="w-1/2 h-full">
          <PdfViewer 
            file={file} 
            elements={results.elements} 
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Right Pane: Extracted Markdown */}
        <div className="w-1/2 h-full">
          <MarkdownOutput markdown={results.markdown_output} />
        </div>
      </main>
    </div>
  );
}