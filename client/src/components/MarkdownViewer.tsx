interface MarkdownViewerProps {
  content: string | null | undefined;
  className?: string;
}

/**
 * Lightweight markdown-to-HTML renderer for the app.
 * Renders: headers, bold, italic, inline code, code blocks, blockquotes, lists, links, horizontal rules.
 * No external dependencies needed.
 */
export function MarkdownViewer({ content, className }: MarkdownViewerProps) {
  if (!content) {
    return <p className="text-muted-foreground text-sm italic">No content.</p>;
  }

  const html = renderMarkdown(content);

  return (
    <div
      className={`prose prose-invert prose-sm max-w-none text-sm leading-relaxed ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
      data-testid="markdown-viewer"
    />
  );
}

function renderMarkdown(md: string): string {
  let html = md
    // Code blocks (must come before inline code)
    .replace(/```(\w*)\n?([\s\S]*?)```/g, (_m, _lang, code) => {
      return `<pre class="bg-slate-900 border border-slate-700 rounded p-3 overflow-x-auto my-3"><code class="text-emerald-300 text-xs">${escapeHtml(code.trim())}</code></pre>`;
    })
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-blue-500 pl-4 text-slate-400 italic my-2">$1</blockquote>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-sm font-semibold text-foreground mt-4 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-base font-semibold text-foreground mt-5 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-lg font-bold text-foreground mt-5 mb-2">$1</h1>')
    // Bold + Italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic text-slate-300">$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-slate-800 text-emerald-300 rounded px-1 py-0.5 text-xs font-mono">$1</code>')
    // HR
    .replace(/^---$/gm, '<hr class="border-slate-700 my-4">')
    // Unordered lists
    .replace(/^\s*[-*+] (.+)$/gm, '<li class="ml-4 list-disc text-slate-300">$1</li>')
    // Ordered lists
    .replace(/^\s*\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-slate-300">$1</li>')
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
    // Line breaks
    .replace(/\n\n/g, '</p><p class="my-2 text-slate-300">')
    .replace(/\n/g, '<br>');

  // Wrap consecutive <li> in <ul>/<ol> via a simple pass
  html = html
    .replace(/(<li[^>]*>.*?<\/li>(\s*<br>)*)+/g, (m) => `<ul class="my-2 space-y-0.5">${m}</ul>`);

  return `<p class="my-2 text-slate-300">${html}</p>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
