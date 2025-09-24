import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, logoutAsync } from "../../redux/slices/auth/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import cubelight from '../../icons/cubelight.json';
import cubeblack from '../../icons/cubeblack.json';
import { Popover } from "react-tiny-popover";
import { assets } from "../../Assets/assets";
import { LogOut, Settings } from "lucide-react";
import Lottie from "lottie-react";
import { toggleTheme } from "../../redux/slices/theme/themeSlice";
import { resetSidebarState } from "../../redux/slices/sidebar/sidebarSlice";
import { Menu } from "lucide-react";
import { toggleDocMobileSidebar } from "../../redux/slices/doc-viewer/docSidebarSLice";
import { toggleMobileSidebar } from "../../redux/slices/sidebar/sidebarSlice";

const Navbar = ({ isScroll,hasBorder }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isDarkMode = useSelector((state) => state.theme.isDarkMode); // Access Redux state
  const { currentUser } = useSelector((state) => state.auth);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutAsync()); // Dispatch the async logout action
    navigate("/"); // Redirect to the login page
     // Reset the sidebar state
     dispatch(resetSidebarState());

  };

  const getAvatarLetters = (email) => {
    if (!email) return ""; // Return an empty string if email is undefined
    const emailName = email.split("@")[0];
    const words = emailName.split(".");
    if (words.length > 1) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return `${emailName[0]}${emailName[emailName.length - 1]}`.toUpperCase();
  };

  // Reset popover on route change
  useEffect(() => {
    setIsPopoverOpen(false);
  }, [location.pathname]);

  // Check token expiry
  useEffect(() => {
    const checkTokenExpiry = () => {
      const expiry = localStorage.getItem("tokenExpiry");
      const currentTime = new Date().getTime();
      if (expiry && Number(expiry) - currentTime <= 0) {
        console.log("Session expired. Logging out for security.");
        handleLogout();
      }
    };
    const intervalId = setInterval(checkTokenExpiry, 1000);
    return () => clearInterval(intervalId);
  }, []);


 

  console.log("Current user in Navbar:", currentUser);
  // console.log("Avatar letters:", getAvatarLetters(currentUser.email));

  const handleLogoClick = () => {
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    const currentTime = new Date().getTime();

    // Redirect to /Home if the token is still valid
    if (tokenExpiry && Number(tokenExpiry) > currentTime) {
      navigate("/Home");
    } else {
      console.log("Token expired. Redirecting to login.");
      dispatch({ type: "auth/logout" });
      navigate("/");
    }
  };

  // Define paths where the menu should be hidden
  const hideMenuPaths = [
    "/", "/auth", "/Home", "/app/:id/dashboard/newprojectid/:uniqueId"
  ];
  // Also hide on any create project form page (adjust as needed)
  const isCreateProjectPage = location.pathname.includes("/dashboard/newprojectid/");
  const hideMenu =
    hideMenuPaths.includes(location.pathname) || isCreateProjectPage;

  return (
    <nav
      className={`w-full fixed top-0 left-0 right-0 h-14 px-4 flex items-center justify-between z-50 ${
        isScroll
          ? "bg-white text-black shadow-md dark:bg-darkTheme dark:text-white bg-opacity-50 backdrop-blur-lg"
          : "bg-transparent/10 dark:bg-darkPrimary text-black dark:text-white"
      } ${hasBorder ? "border-b border-[#c3bdbd] dark:border-gray-700" : ""} transition-all duration-300`}
      style={{ width: "100vw" }} // Add this line
    >
      {/* Only in mobile */}
      {!hideMenu && (
        <div
          className="lg:hidden mr-2"
          onClick={() => {
            if (location.pathname.includes("/view/")) {
              dispatch(toggleDocMobileSidebar());
            } else {
              dispatch(toggleMobileSidebar());
            }
          }}
        >
          <Menu size={20} className="text-black dark:text-white" />
        </div>
      )}
       <div className="flex items-center" onClick={handleLogoClick}>
        <div className="w-10 font-bold">
          <Lottie
            animationData={isDarkMode ?  cubelight : cubeblack}
            loop={true}
            style={{ width: 30, height: 30 }}
            speed={0.5}
          />
        </div>
      <h1 className="text-xl font-bold">DataHub</h1>
      </div>
      <div className="flex items-center gap-4">
        {/* Dark/Light Mode Toggle */}
        <button onClick={() => dispatch(toggleTheme())}>
          <img
            src={isDarkMode ? assets.sun_icon : assets.moon_icon}
            alt="Toggle Dark Mode"
            className={`${isDarkMode ? "w-[14px]" : "w-[14px]"} transition-all duration-300`}
          />
        </button>

        {/* Avatar and Popover */}
        {currentUser && !["/", "/auth"].includes(location.pathname) && (
          <Popover
          
          positions={{ bottom: true, right: true }} // Enable bottom and right positions
          containerStyle={{zIndex:1000}}
            isOpen={isPopoverOpen}
            position={["bottom", "right"]}
            padding={10}
            onClickOutside={() => setIsPopoverOpen(false)}
            content={
              <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg py-2 w-48 transition-all duration-200 text-gray-700 dark:text-gray-100">
              <div className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer font-Ovo">
                <Settings className="mr-2 w-4" /> <span>Settings</span>
                  </div>
                <div className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer font-Ovo" onClick={handleLogout}>
                  <LogOut className="mr-2 w-4" /> <span>Logout</span>
                </div>
              </div>
            }
          >
            <div
              className="cursor-pointer"
              onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold">
                {getAvatarLetters(currentUser.email)}
              </div>
            </div>
          </Popover>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
