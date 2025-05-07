import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { getDecodeTokenHook } from '@/hooks/useAuth';
import { FaPaperPlane } from "react-icons/fa";

interface NavbarProps {
  isAdmin: boolean
}

const Navbar: React.FC<NavbarProps> = ({ isAdmin }) => {
  // const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const Navigate = useNavigate()
  const decodedToken = getDecodeTokenHook();
  const userId = decodedToken?.userId;
  const profilePic = decodedToken?.profilePicImageLink || "https://res.cloudinary.com/dajedrpdx/image/upload/v1743661662/listingImg/of0xuc2hupwzblvhtufd.png";
  // console.log("profilePic", profilePic);

  // console.log(decodedToken);

  const handleLogout = () => {
    localStorage.removeItem('token');
    Navigate("/login");
  }

  const handleChat = () => {
    Navigate(`/chat/`);
  }
  return (
    <>
      <header className="border-b bg-background/95 backdrop-blur-md sticky top-0 z-50 w-full">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between">
            {/* Logo & Desktop Nav */}
            <div className="flex items-center">
              {isAdmin ? (
                <Link className="font-bold text-lg" to="/admin-dashboard">Gig's Hub</Link>
              ) : (
                <Link className="font-bold text-lg" to="/dashboard">Gig's Hub</Link>
              )}
              <nav className="hidden md:flex items-center gap-6 ml-8 text-sm">
                {isAdmin ? (
                  <>
                  </>
                ) : (
                  <>
                    <Link className="hover:text-foreground/80" to="/create-job">Create Job</Link>
                    <Link className="hover:text-foreground/80" to={`/my-jobs/${userId}`}>My Jobs</Link>
                  </>
                )
                }
              </nav>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5"></path>
              </svg>
            </button>

            {/* Search & User Dropdown */}
            <div className="hidden md:flex items-center gap-4">
              {isAdmin ? (
                <><DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar>
                      <AvatarImage src={profilePic} />
                      <AvatarFallback></AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem><button onClick={() => { handleLogout() }}>Logout</button></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu></>
              ) : (
                <>
                  <button
                    onClick={handleChat}
                    className="p-3 bg-transparent text-white rounded-xl"
                  >
                    <FaPaperPlane />
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Avatar>
                        <AvatarImage src={profilePic} />
                        <AvatarFallback></AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem><Link to="/dashboard/myAccount/profile">Profile</Link></DropdownMenuItem>
                      {/* <DropdownMenuItem><Link to="myAccount/Subscription">Subscription</Link></DropdownMenuItem> */}
                      <DropdownMenuItem><button onClick={() => { handleLogout() }}>Logout</button></DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>)}
            </div>
          </div>
          {/* Mobile Nav Menu */}
          {isMenuOpen && (
            <nav className="md:hidden flex flex-col gap-4 py-4 border-t">
              {isAdmin ? (
                <><Link className="hover:text-foreground/80" to="/dashboard/myAccount/profile">Profile</Link>
                  <button className="text-left hover:text-foreground/80 font-medium" onClick={() => { handleLogout() }}>
                    Logout
                  </button></>
              ) : (
                <>
                  <Link className="hover:text-foreground/80" to="/create-job">Create Job</Link>
                  <Link className="hover:text-foreground/80" to={`/my-jobs/${userId}`}>My Jobs</Link>
                  <Link className="hover:text-foreground/80" to="/chat/">Chat</Link>
                  <Link className="hover:text-foreground/80" to="/dashboard/myAccount/profile">Profile</Link>
                  <button className="text-left hover:text-foreground/80 font-medium" onClick={() => { handleLogout() }}>
                    Logout
                  </button>
                </>
              )}
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;