// app/components/MarkdownOutput.tsx
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// You'll need to install react-syntax-highlighter and choose a style
// npm install react-markdown react-syntax-highlighter
// import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Example style

interface MarkdownOutputProps {
  markdown: string;
}

export const MarkdownOutput = ({ markdown }: MarkdownOutputProps) => {
  // Function to handle copying to clipboard (simplified)
  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    alert('Copied to clipboard!');
  };

  return (
    <div className="p-6 h-full overflow-y-auto bg-white dark:bg-gray-900 border-l">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Extracted Markdown</h2>
        <button 
            onClick={handleCopy} 
            className="p-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
            Copy to Clipboard
        </button>
      </div>
      
      {/* Render Markdown Content */}
      <article className="prose dark:prose-invert max-w-none">
        <ReactMarkdown
          components={{
            // Custom renderer for code blocks (for syntax highlighting)
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighHighlighter
                  style={/* dark */}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            // Custom renderer for tables (for proper styling)
            table: ({ children }) => (
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border border-collapse border-gray-300 dark:border-gray-700">{children}</table>
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