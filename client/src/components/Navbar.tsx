import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings, Search } from "lucide-react";
import UploadModal from "./UploadModal";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <nav className="fixed top-0 w-full z-40 border-b border-white/10 bg-ocean-deep/80 backdrop-blur-md px-6 py-3 flex items-center justify-between">
      <Link to="/" className="text-2xl font-black italic bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
        PINK OCEAN
      </Link>

      <div className="flex items-center gap-6">
        {/* Search Bar - Aesthetic only for now */}
        <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 gap-2">
          <Search className="h-4 w-4 text-white/40" />
          <input className="bg-transparent outline-none text-sm w-48" placeholder="Search the wave..." />
        </div>

        {/* Create Button (Upload Modal) */}
        <UploadModal />

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <Avatar className="h-9 w-9 border-2 border-pink-hot/50 hover:border-pink-hot transition-all">
              <AvatarImage src={user?.profilePic} />
              <AvatarFallback className="bg-ocean-light">{user?.username?.[0]}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-ocean-deep border-white/10 text-white w-48">
            <DropdownMenuItem asChild>
              <Link to={`/profile/${user?.username}`} className="flex items-center gap-2 cursor-pointer">
                <User className="h-4 w-4" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                <Settings className="h-4 w-4" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout} className="text-pink-hot focus:text-pink-hot flex items-center gap-2 cursor-pointer">
              <LogOut className="h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}