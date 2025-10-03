// frontend/app/components/PdfWrapper.tsx
'use client';
import dynamic from 'next/dynamic';
import React from 'react';

// Import CSS paths *here*, where they will be dynamically handled
import 'react-pdf/dist/umd/Page/AnnotationLayer.css';
import 'react-pdf/dist/umd/Page/TextLayer.css';

// Dynamically import the PdfViewer component, forcing it to render only on the client (ssr: false)
// This bypasses the Vercel server-side build error for external CSS paths.
const DynamicPdfViewer = dynamic(
  () => 
    import('./PdfViewer').then((mod) => mod.PdfViewer),
  { 
    ssr: false, 
    loading: () => <p className="text-center p-4">Loading PDF Viewer...</p> 
  }
);

interface PdfWrapperProps {
  file: File;
  elements: any[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const PdfWrapper: React.FC<PdfWrapperProps> = (props) => {
  if (!props.file) return null;

  return <DynamicPdfViewer {...props} />;
};