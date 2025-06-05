import { QrCode , XIcon } from "lucide-react"
import ModernCard from "./modern-card"

interface ProfileCardProps {
  name?: string
  username?: string
  followers?: number
  joinDate?: string
  location?: string
  about?: string
  backgroundImage?: string
}

const ProfileCard = ({
  name = "Aditya Srivastava",
  username = "@joekovlav",
  followers = 246,
  joinDate = "January 2025",
  location = "Northamptonshire, England",
  about = "Consummate Tinkerer",
  backgroundImage,
}: ProfileCardProps) => {
  return (
    <ModernCard backgroundImage={backgroundImage} width={320} height={480} className="text-white" overlayOpacity={0.4}>
      <div className="flex flex-col h-full">
        {/* Header with logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">X</span>
            {/* <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
<path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z"></path>
</svg> */}
          </div>
        </div>

        {/* Main title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-wider">LOWBIE</h1>
        </div>

        {/* Stats */}
        <div className="flex justify-between mb-8 text-sm">
          <div>
            <div className="text-gray-400 uppercase text-xs">Followers</div>
            <div className="font-semibold">{followers}</div>
          </div>
          <div>
            <div className="text-gray-400 uppercase text-xs">Joined</div>
            <div className="font-semibold">{joinDate}</div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-600 mb-6"></div>

        {/* Username */}
        <div className="mb-2">
          <div className="text-gray-400 text-sm">{username}</div>
        </div>

        {/* Name */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold">{name}</h2>
        </div>

        {/* Bottom section with QR and info */}
        <div className="flex-1 flex items-end">
          <div className="flex w-full gap-6">
            {/* QR Code */}
            <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center">
              <QrCode className="w-16 h-16 text-black" />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3 text-sm">
              <div>
                <div className="text-gray-400 uppercase text-xs">About</div>
                <div>{about}</div>
              </div>
              <div>
                <div className="text-gray-400 uppercase text-xs">Location</div>
                <div>{location}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModernCard>
  )
}

export default ProfileCard
