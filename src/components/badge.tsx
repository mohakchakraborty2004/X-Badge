import { QrCodeIcon } from "lucide-react";
import React from "react";

type BadgeProps = {
  username: string;
  name: string;
  followers: number;
  joined: string;
  about: string;
  location: string;
  badgeLevel: string;
  badgeLabel: string;
  showQR?: boolean;
  style?: {
    backgroundColor?: string;
    textColor?: string;
    backgroundImage?: string;
  };
};

const BadgeCard: React.FC<BadgeProps> = ({
  username,
  name,
  followers,
  joined,
  about,
  location,
  badgeLevel,
  badgeLabel,
  showQR = true,
  style = {},
}) => {
  const {
    backgroundColor = "transparent",
    textColor = "white",
    backgroundImage,
  } = style;

  return (
    <div
      className="rounded-2xl p-6 border border-gray-600 w-80 font-sans"
      style={{
        backgroundColor,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: textColor,
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3 text-sm font-semibold">
        <span>{badgeLabel.toUpperCase()}</span>
        <span>{badgeLevel.toUpperCase()}</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 text-xs gap-y-2 mb-4">
        <div>
          <div className="text-gray-400">FOLLOWERS</div>
          <div>{followers}</div>
        </div>
        <div>
          <div className="text-gray-400">JOINED</div>
          <div>{joined}</div>
        </div>
      </div>

      <hr className="my-2 border-gray-700" />

      {/* Username and Name */}
      <div className="text-sm mb-1">@{username}</div>
      <div className="text-xl font-bold mb-4">{name}</div>

      {/* Bottom Section */}
      <div className="flex justify-between items-start gap-2">
        {showQR && <QrCodeIcon className="w-6 h-6" />}
        <div className="text-xs space-y-3">
          <div>
            <div className="text-gray-400">ABOUT</div>
            <div className="whitespace-pre-line">{about}</div>
          </div>
          <div>
            <div className="text-gray-400">LOCATION</div>
            <div className="whitespace-pre-line">{location}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeCard;
