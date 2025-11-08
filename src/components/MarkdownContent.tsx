"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className={className}
      components={{
        p: ({ children }) => <p style={{ margin: "0.5em 0" }}>{children}</p>,
        ul: ({ children }) => <ul style={{ marginLeft: "1.5em", marginTop: "0.5em", marginBottom: "0.5em" }}>{children}</ul>,
        ol: ({ children }) => <ol style={{ marginLeft: "1.5em", marginTop: "0.5em", marginBottom: "0.5em" }}>{children}</ol>,
        li: ({ children }) => <li style={{ marginTop: "0.25em" }}>{children}</li>,
        code: ({ children, className }) => {
          const isInline = !className
          return isInline ? (
            <code style={{
              backgroundColor: "var(--mantine-color-dark-6)",
              padding: "0.2em 0.4em",
              borderRadius: "3px",
              fontSize: "0.9em",
            }}>{children}</code>
          ) : (
            <code className={className} style={{
              display: "block",
              backgroundColor: "var(--mantine-color-dark-6)",
              padding: "1em",
              borderRadius: "5px",
              overflow: "auto",
            }}>{children}</code>
          )
        },
        pre: ({ children }) => <pre style={{ margin: "0.5em 0" }}>{children}</pre>,
        blockquote: ({ children }) => (
          <blockquote style={{
            borderLeft: "4px solid var(--mantine-color-gray-6)",
            paddingLeft: "1em",
            marginLeft: "0",
            color: "var(--mantine-color-dimmed)",
          }}>{children}</blockquote>
        ),
        a: ({ children, href }) => (
          <a href={href} style={{ color: "var(--mantine-color-blue-5)" }} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

