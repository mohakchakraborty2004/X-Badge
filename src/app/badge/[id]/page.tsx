"use client"

import React, { useEffect, useState } from "react";
import OldBadgeCard from "@/components/oldBadge";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

const BadgeCardPreview = () => {
  const [backgroundColor, setBackgroundColor] = useState("#0f172a");
  const [textColor, setTextColor] = useState("#ffffff");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [overlayOpacity, setOverlayOpacity] = useState(0.7); // Overlay opacity for background image
  const [response , setResponse] = useState<user>()
  const params = useSearchParams();
  const id = params.get("id")

  interface user {
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
  jobLevel : string;
  Trepos : number;
  Tcommits : number;
  }

  interface responseType {
    msg : string
    status : number
    findUser : {
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
  jobLevel : string;
  Trepos : number;
  Tcommits : number;
    }
  }


  useEffect(()=> {
    async function call() {
        const response = await axios.get<responseType>(`/api/analyze?id=${id}`)
        if(response && response.data.status == 200){
            setResponse(response.data.findUser)
        } else {
            toast(response.data.msg)
        }
    }

    call()
  }, [])
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
        {
            response &&

                <OldBadgeCard
          Xusername={response?.Xusername}
          Xname={response.Xname}
          followers={response.followers}
          created_At={response.created_At}
          about={response.about}
          location={response.location}
          badgeLevel=""
          badgeLabel=""
          NgmiBadge={response.NgmiBadge}
          Worth={response.Worth}
          FullName={response.FullName}
          remarks={response.remarks}
          Tcommits={response.Tcommits}
          Trepos={response.Trepos}
          ghStars={response.ghStars}
          jobLevel={response.jobLevel}
          style={{
            backgroundColor,
            textColor,
            backgroundImage: backgroundImage || undefined,
            overlayOpacity, // Control the dark overlay on the background image
          }}
        />
        }
    
      </div>
    </div>
  );
};

export default BadgeCardPreview;