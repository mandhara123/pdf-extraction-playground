import React, { ReactNode, HTMLAttributes, CSSProperties } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownOutputProps {
  markdown: string;
}

// 💡 FIX: Make 'children' optional in the custom interface.
// The prop object passed by ReactMarkdown to the custom component often
// has `children` as optional, which causes the incompatibility.
interface CustomCodeProps {
  inline?: boolean;
  className?: string;
  children?: ReactNode; // Changed from required to optional
  node?: any; // Required by ReactMarkdown's internal types
}

const MarkdownOutput: React.FC<MarkdownOutputProps> = ({ markdown }) => {
  
  const components: Components = {
    // We now use CustomCodeProps with optional children, resolving the error.
    code: ({ inline, className, children, ...props }: CustomCodeProps) => {
      const match = /language-(\w+)/.exec(className || "");

      // Ensure children exists before attempting String() conversion
      const codeString = children ? String(children).replace(/\n$/, "") : "";

      return !inline && match ? (
        <SyntaxHighlighter
          // Cast the theme object to satisfy the react-syntax-highlighter type
          // CSSProperties is imported above for clarity in this specific type
          style={oneDark as { [key: string]: CSSProperties }}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {codeString}
        </SyntaxHighlighter>
      ) : (
        // For inline code blocks
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="prose dark:prose-invert max-w-none overflow-auto p-4 h-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownOutput;