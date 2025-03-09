import React from "react";

interface MDXContentProps {
  content: string;
}

const MDXContent: React.FC<MDXContentProps> = ({ content }) => {
  // Extract the title from the first H1 heading and remove it from content
  const titleMatch = content.match(/^# (.*$)/m);

  // Remove the first H1 heading from the content
  let processedContent = content;
  if (titleMatch) {
    processedContent = content.replace(titleMatch[0], "");
  }

  // Function to process tables with enhanced styling
  const processTable = (tableContent: string) => {
    const rows = tableContent.trim().split("\n");

    if (rows.length < 3) return tableContent; // Not a valid table

    // Extract header row and separator row
    const headerRow = rows[0];
    // Separator row is at index 1, but we don't need to use it
    const bodyRows = rows.slice(2);

    // Process header cells
    const headerCells = headerRow
      .split("|")
      .filter((cell) => cell.trim() !== "") // Remove empty cells from start/end
      .map(
        (cell) =>
          `<th class="px-4 py-4 bg-gray-50 text-left text-base font-semibold text-gray-900 border-b border-gray-200">${cell.trim()}</th>`
      )
      .join("");

    // Process body rows
    const bodyRowsHtml = bodyRows
      .map((row, rowIndex) => {
        const cells = row
          .split("|")
          .filter((cell) => cell.trim() !== "") // Remove empty cells from start/end
          .map(
            (cell) =>
              `<td class="px-4 py-4 whitespace-normal text-base text-gray-700 border-b border-gray-100">${cell.trim()}</td>`
          )
          .join("");

        // Add zebra striping for better readability
        const rowClass = rowIndex % 2 === 0 ? "" : "bg-gray-50";

        return `<tr class="${rowClass}">${cells}</tr>`;
      })
      .join("");

    // Construct the complete table with enhanced styling
    return `<div class="my-8 overflow-hidden rounded-lg shadow-sm border border-gray-200">
      <div class="overflow-x-auto">
        <table class="w-auto min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>${headerCells}</tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            ${bodyRowsHtml}
          </tbody>
        </table>
      </div>
    </div>`;
  };

  // Find and process all tables in the content
  const tableRegex = /\n\|(.*\|)\n\|([-:\| ]+\|)\n(\|(.*\|)\n)+/g;
  let match;
  let lastIndex = 0;
  let result = "";

  // Process content in chunks, handling tables separately
  while ((match = tableRegex.exec(processedContent)) !== null) {
    // Add everything up to the table
    result += processedContent.slice(lastIndex, match.index);

    // Process and add the table
    result += processTable(match[0]);

    // Update the last index
    lastIndex = match.index + match[0].length;
  }

  // Add any remaining content after the last table
  result += processedContent.slice(lastIndex);

  // Now process the rest of the markdown in the result
  result = result
    // Process headings (# Heading 1, ## Heading 2, etc.)
    .replace(/^# (.*$)/gm, '<h1 class="text-4xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-3xl font-bold mt-8 mb-4">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-2xl font-bold mt-6 mb-3">$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4 class="text-xl font-bold mt-6 mb-2">$1</h4>')
    .replace(
      /^##### (.*$)/gm,
      '<h5 class="text-lg font-bold mt-4 mb-2">$1</h5>'
    )

    // Process paragraphs - ensure text blocks are wrapped in paragraph tags
    // This regex looks for text blocks that aren't already HTML elements
    .replace(
      /^(?!(#|<h|<p|<ul|<ol|<li|<blockquote|<pre|<table|<div|<img))(.+)$/gm,
      '<p class="my-4">$2</p>'
    )

    // Process lists
    .replace(/^\* (.*)$/gm, '<li class="ml-6 list-disc">$1</li>') // Unordered lists
    .replace(/^- (.*)$/gm, '<li class="ml-6 list-disc">$1</li>') // Unordered lists with dash
    .replace(/^(\d+)\. (.*)$/gm, '<li class="ml-6 list-decimal">$2</li>') // Ordered lists

    // Wrap adjacent list items in ul/ol tags
    .replace(
      /(<li class="ml-6 list-disc">.*<\/li>\n)+/g,
      (match) => `<ul class="my-4">${match}</ul>`
    )
    .replace(
      /(<li class="ml-6 list-decimal">.*<\/li>\n)+/g,
      (match) => `<ol class="my-4">${match}</ol>`
    )

    // Process emphasis and strong
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
    .replace(/__(.*?)__/g, "<strong>$1</strong>") // Bold with underscore
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic
    .replace(/_(.*?)_/g, "<em>$1</em>") // Italic with underscore

    // Process links
    .replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" class="text-blue-600 hover:underline">$1</a>'
    )

    // Process images - convert to proper HTML
    .replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, src) => {
      // Special handling for team images
      if (
        src.includes("synthalyst-team.jpg") ||
        src.includes("team/synthalyst-team")
      ) {
        return `<div class="my-8">
          <img src="/images/synthalyst-team.png" alt="${
            alt || "Synthalyst Team"
          }" class="rounded-lg shadow-md mx-auto max-w-full" />
          ${
            alt
              ? `<p class="text-center text-sm text-gray-500 mt-2">${alt}</p>`
              : ""
          }
        </div>`;
      }

      return `<div class="my-8">
        <img src="${src}" alt="${alt}" class="rounded-lg shadow-md mx-auto max-w-full" />
        ${
          alt
            ? `<p class="text-center text-sm text-gray-500 mt-2">${alt}</p>`
            : ""
        }
      </div>`;
    })

    // Process blockquotes
    .replace(
      /^> (.*$)/gm,
      '<blockquote class="pl-4 border-l-4 border-gray-300 italic my-4">$1</blockquote>'
    )

    // Process code blocks
    .replace(/```(.*?)\n([\s\S]*?)```/g, (match, language, code) => {
      return `<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-md my-6 overflow-x-auto"><code class="language-${
        language || "text"
      }">${code.trim()}</code></pre>`;
    })

    // Process inline code
    .replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">$1</code>'
    )

    // Process horizontal rules
    .replace(/^---$/gm, '<hr class="my-8 border-t border-gray-300" />');

  // Direct approach for the specific table format in the blog post
  // This is a fallback in case the table wasn't caught by the regex above
  if (
    result.includes("| Weak Objective") &&
    result.includes("| Strong Objective")
  ) {
    const tableStart = result.indexOf("| Weak Objective");
    const tableEnd = result.indexOf("## Using Templates", tableStart);

    if (tableStart !== -1 && tableEnd !== -1) {
      const tableContent = result.substring(tableStart, tableEnd).trim();
      const tableRows = tableContent.split("\n");

      if (tableRows.length >= 3) {
        // Create HTML table with enhanced styling
        const headerCells = tableRows[0]
          .split("|")
          .filter((cell) => cell.trim() !== "")
          .map(
            (cell) =>
              `<th class="px-4 py-4 bg-gray-50 text-left text-base font-semibold text-gray-900 border-b border-gray-200">${cell.trim()}</th>`
          )
          .join("");

        const bodyRowsHtml = tableRows
          .slice(2)
          .map((row, rowIndex) => {
            const cells = row
              .split("|")
              .filter((cell) => cell.trim() !== "")
              .map(
                (cell) =>
                  `<td class="px-4 py-4 whitespace-normal text-base text-gray-700 border-b border-gray-100">${cell.trim()}</td>`
              )
              .join("");

            // Add zebra striping for better readability
            const rowClass = rowIndex % 2 === 0 ? "" : "bg-gray-50";

            return `<tr class="${rowClass}">${cells}</tr>`;
          })
          .join("");

        const htmlTable = `<div class="my-8 overflow-hidden rounded-lg shadow-sm border border-gray-200">
          <div class="overflow-x-auto">
            <table class="w-auto min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>${headerCells}</tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                ${bodyRowsHtml}
              </tbody>
            </table>
          </div>
        </div>`;

        // Replace the markdown table with the HTML table
        result =
          result.substring(0, tableStart) +
          htmlTable +
          result.substring(tableEnd);
      }
    }
  }

  return (
    <>
      <div className="my-8">
        <img
          src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
          alt="Training Plan Creator Overview"
          className="rounded-lg shadow-md mx-auto max-w-full"
        />
      </div>
      <div
        className="prose prose-lg mb-8 
                  prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100 
                  prose-p:text-black dark:prose-p:text-gray-100 prose-p:my-4 prose-p:leading-relaxed
                  prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-medium
                  prose-img:rounded-lg prose-img:shadow-md prose-img:mx-auto
                  prose-table:border prose-table:border-collapse prose-td:border prose-td:p-2
                  prose-ul:list-disc prose-ol:list-decimal prose-li:my-2
                  prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic"
        dangerouslySetInnerHTML={{ __html: result }}
      />
    </>
  );
};

export default MDXContent;
