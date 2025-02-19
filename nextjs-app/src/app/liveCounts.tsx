import React from "react";

interface LiveCountsData {
  downloads: number;
  clients: number;
  visitors: number;
}

export default function LiveCounts({ data }: { data: LiveCountsData }) {
  return (
    <div>
      <h2>Live Counts</h2>
      <ul className="list-disc list-inside">
        <li>Downloads: {data.downloads}</li>
        <li>Clients: {data.clients}</li>
        <li>Visitors: {data.visitors}</li>
      </ul>
    </div>
  );
}

export type { LiveCountsData };
