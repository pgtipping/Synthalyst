import React from "react";

interface MDXContentProps {
  content: string;
}

const MDXContent: React.FC<MDXContentProps> = ({ content }) => {
  // Add images to specific sections
  const enhancedContent = addImagesToContent(content);

  // Process content to properly render markdown
  const processedContent = enhancedContent
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

    // Process images
    .replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, src) => {
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
    .replace(/^---$/gm, '<hr class="my-8 border-t border-gray-300" />')

    // Process tables
    .replace(/\n\|(.*)\|\n\|([-:| ]+)\|\n/g, (match, headers) => {
      const headerCells = headers
        .split("|")
        .map(
          (cell: string) =>
            `<th class="border p-2 bg-gray-100">${cell.trim()}</th>`
        )
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

// Function to add images to specific sections of the content
function addImagesToContent(content: string): string {
  // Split content by sections to insert images at appropriate locations
  const sections = content.split(/^## /gm);

  if (sections.length <= 1) return content;

  // Add hero image after the main title
  let result =
    sections[0] +
    `

![Training Plan Creator Overview](https://images.unsplash.com/photo-1606761568499-6d2451b23c66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80)

`;

  // Add image for "What is the Training Plan Creator?" section
  if (sections.length > 1) {
    result += `## ${sections[1]}

![AI-powered training plan creation](https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80)

`;
  }

  // Add image for "Creating Your First Training Plan" section
  if (sections.length > 2) {
    result += `## ${sections[2]}

![Step-by-step guide to creating a training plan](https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80)

`;
  }

  // Add image for "Writing Effective Learning Objectives" section
  if (sections.length > 3) {
    result += `## ${sections[3]}

![SMART learning objectives framework](https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80)

`;
  }

  // Add image for "Using Templates" section
  if (sections.length > 4) {
    result += `## ${sections[4]}

![Training plan templates](https://images.unsplash.com/photo-1572021335469-31706a17aaef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80)

`;
  }

  // Add image for "Getting the Best Results" section
  if (sections.length > 5) {
    result += `## ${sections[5]}

![Optimizing your training plan](https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80)

`;
  }

  // Add image for "Combining Multiple Plans" section
  if (sections.length > 6) {
    result += `## ${sections[6]}

![Creating learning paths with multiple plans](https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80)

`;
  }

  // Add image for "Best Practices for Training Plan Implementation" section
  if (sections.length > 7) {
    result += `## ${sections[7]}

![Implementing your training plan effectively](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80)

`;
  }

  // Add remaining sections if any
  for (let i = 8; i < sections.length; i++) {
    result += `## ${sections[i]}`;
  }

  return result;
}

export default MDXContent;
