import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; 
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'; 
import React from 'react'; 
import type { ReactMarkdownProps } from 'react-markdown/lib/complex-types'; 

interface MarkdownOutputProps {
  markdown: string;
}

export const MarkdownOutput = ({ markdown }: MarkdownOutputProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    alert('Markdown copied to clipboard!'); 
  };

  return (
    <div className="p-6 h-full overflow-y-auto bg-white dark:bg-gray-900 border-l dark:border-gray-700">
      <div className="flex justify-between items-center mb-4 border-b pb-2 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Extracted Markdown</h2>
        <button 
            onClick={handleCopy} 
            className="p-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
            Copy to Clipboard
        </button>
      </div>
      
      {/* Render Markdown Content */}
      <article className="prose dark:prose-invert max-w-none">
        <ReactMarkdown
          components={{
            code({ inline, className, children, ...rest }: ReactMarkdownProps) {
              const match = /language-(\w+)/.exec(className || '');
              
              return !inline && match ? (
                <SyntaxHighlighter
                  // @ts-expect-error: react-syntax-highlighter types don’t fully align
                  style={dark} 
                  language={match[1]}
                  PreTag="div"
                  {...rest}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...rest}>
                  {children}
                </code>
              );
            },
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className="table-auto w-full border border-collapse border-gray-300 dark:border-gray-700">
                  {children}
                </table>
              </div>
            )
          }}
        >
          {markdown}
        </ReactMarkdown>
      </article>
    </div>
  );
};
