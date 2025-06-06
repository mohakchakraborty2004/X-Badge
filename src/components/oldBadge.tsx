import { QrCodeIcon, DotIcon } from "lucide-react";

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
    overlayOpacity?: number; // Opacity for the dark overlay on background image
  };
};

const OldBadgeCard : React.FC<BadgeProps> = ({
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
    backgroundColor = "black",
    textColor = "white",
    backgroundImage,
    overlayOpacity = 0.7, // Default overlay opacity
  } = style;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-white flex items-center justify-center p-6">
      <div className="relative">
        {/* Badge Clip */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-16 h-10 bg-gray-300 rounded-lg shadow-md flex items-center justify-center">
            <div className="w-10 h-4 bg-gray-200 rounded-md shadow-inner" />
          </div>
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-400 rounded-full shadow">
            <div className="w-2 h-2 bg-gray-500 rounded-full mx-auto mt-1"></div>
          </div>
        </div>

        {/* Card */}
        <div 
          className="text-white rounded-2xl shadow-xl p-6 w-80 h-[430px] flex flex-col justify-between relative overflow-hidden"
          style={{
            backgroundColor,
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: textColor,
          }}
        >
          {/* Dark Overlay for background image */}
          {backgroundImage && (
            <div 
              className="absolute inset-0 bg-black rounded-2xl"
              style={{
                opacity: overlayOpacity,
              }}
            />
          )}

          {/* Content - ensure it's above the overlay */}
          <div className="relative z-10 flex flex-col justify-between h-full">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="text-5xl text-gray-300 font-light tracking-wide">𝕏</div>
              <div className="text-xl font-extrabold tracking-widest">{name}</div>
            </div>

            {/* Stats */}
            <div className="flex justify-between text-[10px] text-gray-400 mt-4">
              <div>
                <div className="mb-1">FOLLOWERS</div>
                <div className="text-white font-bold text-xs">{followers}</div>
              </div>
              <div className="text-center">
                <div className="mb-1">WORTH</div>
                <div className="text-white font-bold text-xs">{worth}</div>
              </div>
              <div className="text-right">
                <div className="mb-1">JOINED</div>
                <div className="text-white font-bold text-xs">{joined.toUpperCase()}</div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700 my-3" />

            {/* Username and Name */}
            <div className="flex justify-between">
              <div>
              <div className="text-gray-400 font-medium text-xs">@{username}</div>
              <div className="text-white text-[1.2rem] font-bold mt-1">{Fullname}</div>
              </div>
             <div>
              <Badge status={userStatus.toLowerCase()} />
              </div>
            </div>

            {/* Bottom section */}
            <div className="flex justify-between items-end mt-4">
              {/* QR 
              enter Image here 
              */}
              
              {showQR && (
                <div>
                  <QrCodeIcon size={60} />
                </div>
              )}

              {/* Info */}
              <div className="text-right text-[10px] text-gray-400 space-y-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1">ABOUT</div>
                  <div className="font-bold">
                    {about.split('\n').map((line, index) => (
                      <span key={index}>
                        {line}
                        {index < about.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">LOCATION</div>
                  <div className="font-bold">
                    {location.split('\n').map((line, index) => (
                      <span key={index}>
                        {line}
                        {index < location.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OldBadgeCard;

const statusStyles: Record<string, { bg: string; dot: string; text: string; border: string }> = {
  wagmi: {
    bg: "bg-green-300/50",
    dot: "bg-green-500",
    text: "text-green-900",
    border: "border-green-700",
  },
  ngmi: {
    bg: "bg-red-300/50",
    dot: "bg-red-500",
    text: "text-red-900",
    border: "border-red-700",
  },
  mgmi: {
    bg: "bg-orange-300/50",
    dot: "bg-orange-500",
    text: "text-orange-900",
    border: "border-orange-700",
  },
  ygmi: {
    bg: "bg-yellow-300/50",
    dot: "bg-yellow-500",
    text: "text-yellow-900",
    border: "border-yellow-700",
  },
  npc: {
    bg: "bg-gray-300/50",
    dot: "bg-gray-500",
    text: "text-gray-900",
    border: "border-gray-700",
  },
};

const Badge = ({ status }: { status: string }) => {
  const styles = statusStyles[status] || statusStyles["npc"]; // Fallback to npc

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full ${styles.bg} ${styles.border} border`}>
      <span className={`h-2 w-2 rounded-full ${styles.dot} mr-2`} />
      <p className={`text-xs ${styles.text} font-medium`}>{status}</p>
    </div>
  );
};