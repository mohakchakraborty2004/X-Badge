"use client"

import React, { useState } from "react";
import BadgeCard from "@/components/badge"; // make sure this path is correct
import OldBadgeCard from "@/components/oldBadge";

const BadgeCardPreview = () => {
  const [backgroundColor, setBackgroundColor] = useState("#0f172a");
  const [textColor, setTextColor] = useState("#ffffff");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [overlayOpacity, setOverlayOpacity] = useState(0.7); // Overlay opacity for background image

  return (
    <div className="p-4 space-y-6 text-white bg-gray-900 min-h-screen">
      <h1 className="text-xl font-bold">Customize Your Badge</h1>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block mb-1">Background Color</label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="w-full h-10 p-1 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Text Color</label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="w-full h-10 p-1 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Background Image URL</label>
          <input
            type="text"
            placeholder="https://example.com/bg.jpg"
            value={backgroundImage}
            onChange={(e) => setBackgroundImage(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>

        <div>
          <label className="block mb-1">
            Image Overlay ({Math.round((1 - overlayOpacity) * 100)}% visible)
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={overlayOpacity}
            onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
            className="w-full h-10 p-1 rounded"
          />
          <div className="text-xs text-gray-400 mt-1">
            {overlayOpacity === 0 ? "Full Image" : overlayOpacity === 1 ? "Completely Dark" : "Partially Dark"}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="mt-6">
        <OldBadgeCard
          username="jerkeyray"
          name="Aditya Srivastava"
          followers={266}
          joined="January 2025"
          about="Consummate Tinkerer\nCSE-28"
          location="Doofenshmirtz Evil Inc."
          badgeLevel="Lowbie"
          badgeLabel="X"
          style={{
            backgroundColor,
            textColor,
            backgroundImage: backgroundImage || undefined,
            overlayOpacity, // Control the dark overlay on the background image
          }}
        />
      </div>
    </div>
  );
};

export default BadgeCardPreview;