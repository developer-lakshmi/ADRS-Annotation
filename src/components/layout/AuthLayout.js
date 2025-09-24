import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { assets } from "../../Assets/assets";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "../Authentification/LoginForm";
import SignupForm from "../Authentification/SignUpForm";
import ForgotPasswordForm from "../Authentification/ForgotPassForm";
import ResetPasswordForm from "../Authentification/ResetPasswordForm";

const AuthLayout = () => {
  const [activeForm, setActiveForm] = useState("login");
  const [imageLoaded, setImageLoaded] = useState(false);

  const token = useSelector((state) => state.auth.token);
  const tokenExpiry = localStorage.getItem("tokenExpiry");
  const currentTime = new Date().getTime();

  // Redirect to home if token is valid
  if (token && tokenExpiry && Number(tokenExpiry) > currentTime) {
    console.log("Redirecting to /Home:", { token, tokenExpiry, currentTime }); // Debugging log
    return <Navigate to="/Home" replace />;
  }


  return (
    <div className="max-w-full flex items-center justify-center mx-auto mt-6 lg:mt-0 2xl:mt-12">
      <div className="flex flex-col lg:flex-row justify-center items-center h-full w-full p-2 overflow-hidden scrollbar-hide bg-white dark:bg-transparent dark:shadow-white/40 border-1 border-black rounded-2xl shadow-md flex-wrap relative max-w-2xl 2xl:max-w-3xl">
        <div className="w-full lg:w-1/2 flex justify-center items-center min-h-[300px]">
          {!imageLoaded && (
            <div className="w-full h-[280px] bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          )}
          <img
            src={assets.bg1}
            alt="Background"
            onLoad={() => setImageLoaded(true)}
            className={`max-w-full h-auto rounded-lg object-cover transition-opacity duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0 absolute"
            }`}
          />
        </div>

        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-5 min-h-[470px] 2xl:min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeForm === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <LoginForm onSwitchForm={setActiveForm} />
              </motion.div>
            )}
            {activeForm === "signup" && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <SignupForm onSwitchForm={setActiveForm} />
              </motion.div>
            )}
            {activeForm === "forgotPassword" && (
              <motion.div
                key="forgotPassword"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <ForgotPasswordForm onSwitchForm={setActiveForm} />
              </motion.div>
            )}
            {activeForm === "resetPassword" && (
              <motion.div
                key="resetPassword"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <ResetPasswordForm onSwitchForm={setActiveForm} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

