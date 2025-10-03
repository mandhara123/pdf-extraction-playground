'use client';
import dynamic from 'next/dynamic';
import React from 'react';

// FIX: Conditionally load CSS only if we are in the browser (client-side)
if (typeof window !== 'undefined') {
  // We use require() here because standard ES6 import syntax cannot be used conditionally.
  require('react-pdf/dist/umd/Page/AnnotationLayer.css');
  require('react-pdf/dist/umd/Page/TextLayer.css');
}

// Dynamically import the PdfViewer component, forcing it to render only on the client (ssr: false)
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