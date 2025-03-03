import React from "react";

interface MDXContentProps {
  content: string;
}

const MDXContent: React.FC<MDXContentProps> = ({ content }) => {
  // Process content to enhance HTML structure if needed
  // This is a simple implementation - for a more robust solution,
  // consider using a proper MDX library like next-mdx-remote

  // Convert markdown tables to proper HTML tables with styling
  const processedContent = content
    // Add proper paragraph tags if missing
    .replace(
      /(?<!\n\n)^(?!<h|<p|<ul|<ol|<li|<blockquote|<pre|<table|<div|<img|#)(.+)$/gm,
      "<p>$2</p>"
    )
    // Ensure headers have proper spacing
    .replace(/<h([1-6])>/g, '<h$1 class="mt-8 mb-4">')
    // Process markdown tables (basic implementation)
    .replace(/\n\|(.*)\|\n\|([-:| ]+)\|\n/g, (match, headers) => {
      const headerCells = headers
        .split("|")
        .map((cell: string) => `<th>${cell.trim()}</th>`)
        .join("");
      return `<table class="w-full my-6 border-collapse"><thead><tr>${headerCells}</tr></thead><tbody>`;
    })
    .replace(/\|(.*)\|\n(?!\|[-:| ]+\|)/g, (match, cells) => {
      const tableCells = cells
        .split("|")
        .map((cell: string) => `<td class="border p-2">${cell.trim()}</td>`)
        .join("");
      return `<tr>${tableCells}</tr>`;
    })
    .replace(/\|(.*)\|\n\n/g, (match, cells) => {
      const tableCells = cells
        .split("|")
        .map((cell: string) => `<td class="border p-2">${cell.trim()}</td>`)
        .join("");
      return `<tr>${tableCells}</tr></tbody></table>\n\n`;
    })
    // Enhance image rendering
    .replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, src) => {
      return `<div class="my-8">
        <img src="${src}" alt="${alt}" class="rounded-lg shadow-md mx-auto max-w-full" />
        ${
          alt
            ? `<p class="text-center text-sm text-gray-500 mt-2">${alt}</p>`
            : ""
        }
      </div>`;
    });

  return (
    <div
      className="prose prose-lg max-w-none mb-8 
                prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100 
                prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:my-4 prose-p:leading-relaxed
                prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-medium
                prose-img:rounded-lg prose-img:shadow-md prose-img:mx-auto
                prose-table:border prose-table:border-collapse prose-td:border prose-td:p-2
                prose-ul:list-disc prose-ol:list-decimal prose-li:my-2
                prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};

export default MDXContent;
