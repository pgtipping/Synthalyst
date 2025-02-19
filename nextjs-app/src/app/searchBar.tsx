"use client";

import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Search</h2>
      <input
        type="text"
        placeholder="Search..."
        className="border border-gray-300 px-4 py-2 rounded"
        value={query}
        onChange={handleInputChange}
      />
      <p>Search Query: {query}</p>
    </div>
  );
}
