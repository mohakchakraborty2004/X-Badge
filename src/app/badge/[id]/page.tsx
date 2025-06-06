"use client"

import React, { useEffect, useState, useRef } from "react";
import OldBadgeCard from "@/components/oldBadge";
import axios from "axios";
import { toast } from "sonner";
import html2canvas from "html2canvas";

interface User {
  id?: string;
  profileUrl?: string | null;
  ghStars?: number;
  remarks?: string;
  Xid?: string;
  Xusername: string;
  followers: number;
  Xname: string;
  about: string;
  location: string;
  FullName: string;
  QrUrl?: string;
  NgmiBadge: string;
  Worth: string;
  created_At: string;
  jobLevel: string;
  Trepos: number;
  Tcommits: number;
}

interface ApiResponse {
  msg: string;
  status: number;
  findUser: User;
}

interface PageProps {
  params: {
    id: string;
  };
}

const BadgeCardPreview = ({ params }: PageProps) => {
  // Style states
  const [backgroundColor, setBackgroundColor] = useState("#0f172a");
  const [textColor, setTextColor] = useState("#ffffff");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [overlayOpacity, setOverlayOpacity] = useState(0.7);
  
  // Data and UI states
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  
  // Ref for badge component
  const badgeRef = useRef<HTMLDivElement>(null);
  
  const { id } = params;

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) {
        setError("No user ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get<ApiResponse>(`/api/analyze?id=${id}`);
        
        if (response.data.status === 200 && response.data.findUser) {
          setUserData(response.data.findUser);
          toast.success("Badge data loaded successfully!");
        } else {
          const errorMsg = response.data.msg || "Failed to load badge data";
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to fetch user data";
        setError(errorMsg);
        toast.error(errorMsg);
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  // Download badge as image
  const downloadBadge = async () => {
    if (!badgeRef.current || !userData) {
      toast.error("Badge not ready for download");
      return;
    }

    try {
      setDownloading(true);
      toast.loading("Generating badge image...", { id: "download" });

      const canvas = await html2canvas(badgeRef.current, {
        useCORS: true,
        allowTaint: true,
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${userData.Xusername || 'badge'}-badge.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          toast.success("Badge downloaded successfully!", { id: "download" });
        } else {
          toast.error("Failed to generate image", { id: "download" });
        }
      }, 'image/png', 1.0);
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Failed to download badge", { id: "download" });
    } finally {
      setDownloading(false);
    }
  };

  // Reset customization
  const resetCustomization = () => {
    setBackgroundColor("#0f172a");
    setTextColor("#ffffff");
    setBackgroundImage("");
    setOverlayOpacity(0.7);
    toast.success("Customization reset to defaults");
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-4 bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading badge data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center text-white max-w-md">
          <div className="bg-red-900 border border-red-700 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2 text-red-400">Error Loading Badge</h2>
            <p className="text-red-200 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!userData) {
    return (
      <div className="p-4 bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-lg">No badge data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 text-white bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customize Your Badge</h1>
        <button
          onClick={resetCustomization}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors text-sm"
        >
          Reset
        </button>
      </div>

      {/* Customization Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Background Color</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-12 h-10 rounded border border-gray-600"
            />
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-600"
              placeholder="#0f172a"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Text Color</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-12 h-10 rounded border border-gray-600"
            />
            <input
              type="text"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-600"
              placeholder="#ffffff"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Background Image URL</label>
          <input
            type="text"
            placeholder="https://example.com/bg.jpg"
            value={backgroundImage}
            onChange={(e) => setBackgroundImage(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
          {backgroundImage && (
            <button
              onClick={() => setBackgroundImage("")}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Clear image
            </button>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Image Overlay ({Math.round((1 - overlayOpacity) * 100)}% visible)
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={overlayOpacity}
            onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded appearance-none cursor-pointer"
          />
          <div className="text-xs text-gray-400">
            {overlayOpacity === 0 ? "Full Image" : 
             overlayOpacity === 1 ? "Completely Dark" : 
             "Partially Dark"}
          </div>
        </div>
      </div>

      {/* Badge Preview */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Preview</h2>
        <div className="flex justify-center">
          <div ref={badgeRef} className="inline-block">
            <OldBadgeCard
              Xusername={userData.Xusername}
              Xname={userData.Xname}
              followers={userData.followers}
              created_At={userData.created_At}
              about={userData.about}
              location={userData.location}
              badgeLevel=""
              badgeLabel=""
              NgmiBadge={userData.NgmiBadge}
              Worth={userData.Worth}
              FullName={userData.FullName}
              remarks={userData.remarks}
              Tcommits={userData.Tcommits}
              Trepos={userData.Trepos}
              ghStars={userData.ghStars}
              jobLevel={userData.jobLevel}
              profileUrl={userData.profileUrl}
              style={{
                backgroundColor,
                textColor,
                backgroundImage: backgroundImage || undefined,
                overlayOpacity,
              }}
            />
          </div>
        </div>

        {/* Download Button */}
        <div className="flex justify-center">
          <button
            onClick={downloadBadge}
            disabled={downloading}
            className="bg-black hover:bg-gray-800 disabled:bg-gray-600 text-white px-8 py-3 rounded-lg transition-colors flex items-center space-x-2 font-medium"
          >
            {downloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download Badge</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BadgeCardPreview;