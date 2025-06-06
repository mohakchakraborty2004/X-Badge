import { QrCodeIcon, DotIcon, GitBranch, Star, Activity } from "lucide-react";

type BadgeProps = {
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
  profileUrl,
  remarks,
  Xusername,
  followers,
  Xname,
  about,
  location,
  FullName,
  QrUrl,
  NgmiBadge,
  Worth,
  created_At,
  jobLevel,
  Trepos,
  ghStars,
  Tcommits,
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

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${QrUrl}&size=90x90`;


  return (

    <div className="grid grid-flow-col grid-cols-2">


      <div className="col-span-1">
           <div className="min-h-screen bg-gradient-to-b from-blue-200 to-white flex items-center justify-center p-6 rounded-3xl m-6">
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
              <div className="text-xl font-extrabold tracking-widest">{Xname}</div>
            </div>

            {/* Stats */}
            <div className="flex justify-between text-[10px] text-gray-400 mt-4">
              <div>
                <div className="mb-1">FOLLOWERS</div>
                <div className="text-white font-bold text-xs">{followers}</div>
              </div>
              <div className="text-center">
                <div className="mb-1">WORTH</div>
                <div className="text-white font-bold text-xs">{Worth}</div>
              </div>
              <div className="text-right">
                <div className="mb-1">JOINED</div>
                <div className="text-white font-bold text-xs">{created_At.toUpperCase()}</div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700 my-3" />

            {/* Username and Name */}
            <div className="flex justify-between">
              <div>
              <div className="text-gray-400 font-medium text-xs">@{Xusername}</div>
              <div className="text-white text-[1.2rem] font-bold mt-1">{FullName}</div>
              </div>
             <div>
              <Badge status={NgmiBadge.toLowerCase()} />
              </div>
            </div>

            {/* Bottom section */}
            <div className="flex justify-between items-end mt-4">
              {/* QR 
              enter Image here 
              */}
              
              {showQR && (
                <div>
                  <img src={qrUrl} alt="QR Code" />
                </div>
              )}

              {/* Info */}
              <div className="text-right text-[10px] text-gray-400 space-y-3">
                <div>
                  <div className=" text-[10px] text-gray-400 mb-1">ABOUT</div>
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
                  <div className=" text-[10px] text-gray-400 mb-1">LOCATION</div>
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
      </div>


      <div className="col-span-3">

       <div className="min-h-screen  bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 m-6">
        {/* Header Section */}
        <div className="flex items-center gap-8 mb-10">
          <div className="relative">
            {profileUrl &&
             <img
              className="h-32 w-32 rounded-full object-cover ring-4 ring-white shadow-xl"
              src={profileUrl}
              alt="Profile"
            />
            }
           
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
              {FullName}
            </h1>
          <p className="text-slate-600 text-lg font-medium">{jobLevel}</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <GitBranch className="size-[2rem]" />
              <span className="text-sm font-medium opacity-90">Repositories</span>
            </div>
            <div className="text-3xl font-bold">{Trepos}</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-6 h-6" />
              <span className="text-sm font-medium opacity-90">Total Stars</span>
            </div>
            <div className="text-3xl font-bold">{ghStars}</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-6 h-6" />
              <span className="text-sm font-medium opacity-90">Commits</span>
            </div>
            <div className="text-3xl font-bold">{Tcommits}</div>
          </div>
        </div>

        {/* Remarks Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span></span> Remarks
          </h3>
          <p className="text-slate-700 leading-relaxed font-handwriting text-lg">
            {remarks}
          </p>
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