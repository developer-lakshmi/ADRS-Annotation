import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideNotification } from "../../redux/slices/notification/notificationSlice";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

const NOTIF_DURATION = 4000;

const bgColors = {
  success: "bg-green-500",
  error: "bg-red-500",
  info: "bg-blue-500",
};

const icons = {
  success: <CheckCircle className="w-5 h-5 mr-2" />,
  error: <XCircle className="w-5 h-5 mr-2" />,
  info: <Info className="w-5 h-5 mr-2" />,
};

const BaseNotification = () => {
  const dispatch = useDispatch();
  const { message, visible, type } = useSelector((state) => state.notification);
  const [progress, setProgress] = useState(100);
  const intervalRef = useRef();

  useEffect(() => {
    if (visible) {
      setProgress(100);
      const start = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - start;
        setProgress(Math.max(0, 100 - (elapsed / NOTIF_DURATION) * 100));
      }, 30);

      const timer = setTimeout(() => {
        dispatch(hideNotification());
      }, NOTIF_DURATION);

      return () => {
        clearTimeout(timer);
        clearInterval(intervalRef.current);
      };
    }
  }, [visible, dispatch]);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 text-white p-4 rounded shadow-lg flex items-center transition-opacity duration-500 ${
        bgColors[type] || bgColors.info
      }`}
      style={{ zIndex: 9999, minWidth: 240 }}
      role="alert"
    >
      {icons[type] || icons.info}
      <span className="flex-1">{message}</span>
      <button
        onClick={() => dispatch(hideNotification())}
        className="ml-4 p-1 rounded hover:bg-white/20 focus:outline-none"
        aria-label="Dismiss notification"
      >
        <X className="w-5 h-5" />
      </button>
      {/* Progress Bar */}
      <div className="absolute left-0 bottom-0 w-full h-1 bg-white bg-opacity-30 rounded overflow-hidden">
        <div
          className="h-full bg-white transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default BaseNotification;