"use client";

import { useEffect, useState } from "react";
import styles from "./css-test.module.css";

export default function CssTestPage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">CSS Test Page</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tailwind Utilities Test */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Tailwind Utilities</h2>
          <div className="space-y-4">
            <p className="text-blue-500">This text should be blue</p>
            <p className="font-bold">This text should be bold</p>
            <div className="p-4 bg-gray-100 rounded-lg">
              This has padding and rounded corners
            </div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Hover Me
            </button>
          </div>
        </div>

        {/* Custom Tailwind Class Test */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Custom CSS Module Class
          </h2>
          <div className={styles.test_tailwind}>
            This should be blue, bold, have padding, and rounded corners
          </div>
        </div>

        {/* Theme Function Test */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Theme Function Variables
          </h2>
          <div className="space-y-4">
            <div style={{ color: "var(--test-color)" }}>
              This text should use Tailwind&apos;s blue-500 color
            </div>
            <div style={{ padding: "var(--test-spacing)" }}>
              This div should have padding from Tailwind&apos;s spacing.4
            </div>
            <div style={{ boxShadow: "var(--test-shadow)" }}>
              This div should have Tailwind&apos;s lg shadow
            </div>
          </div>
        </div>

        {/* CSS Load Diagnostic */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">CSS Loading Diagnostic</h2>
          <div className="space-y-4">
            <p>CSS loaded: {loaded ? "Yes" : "No"}</p>
            <p>
              Document Ready: {typeof document !== "undefined" ? "Yes" : "No"}
            </p>
            <p>
              Has Stylesheet:{" "}
              {typeof document !== "undefined"
                ? document.styleSheets.length.toString()
                : "Unknown"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
