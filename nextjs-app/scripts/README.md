# MDX Blog Post Processor

This utility script processes MDX files in the `src/app/blog/posts` directory and adds them to the database.

## Features

- Extracts frontmatter metadata from MDX files
- Creates or updates blog posts in the database
- Handles tags and author information
- Generates slugs from filenames

## Usage

```bash
# Run the script
npm run process-mdx
```

## Frontmatter Format

MDX files should include frontmatter at the beginning of the file in the following format:

```md
---
title: "Your Post Title"
description: "A brief description of your post"
date: "YYYY-MM-DD"
author: "Author Name"
authorImage: "/path/to/author/image.jpg"
image: "/path/to/cover/image.jpg"
tags: ["Tag1", "Tag2", "Tag3"]
featured: true
---
```

### Required Fields

- `title`: The title of the blog post

### Optional Fields

- `description`: A brief description or excerpt
- `date`: Publication date in YYYY-MM-DD format
- `author`: The name of the author
- `authorImage`: Path to the author's profile image
- `image`: Path to the cover image
- `tags`: Array of tags for categorization
- `featured`: Boolean indicating if the post should be featured (default: false)

## How It Works

1. The script reads all `.mdx` files in the `src/app/blog/posts` directory
2. For each file, it extracts the frontmatter metadata
3. It creates or updates the author in the database if needed
4. It processes tags and creates them if they don't exist
5. It creates or updates the blog post in the database

## Error Handling

The script includes error handling for:

- Missing frontmatter
- Invalid JSON in tag arrays
- Missing required fields
- Database connection issues

Errors are logged to the console but don't stop the script from processing other files.
