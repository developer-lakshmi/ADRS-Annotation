import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAppDetails } from "../services/api"; // Import the API function
import SkeletonCard from "../components/Loader/SkeltonCard";
import { useDispatch } from "react-redux";
import { setAppId, setApplications } from "../redux/slices/apps/appSlices"; // Import setApplications

const AppDashboard = () => {
  const [profiles, setProfiles] = useState([]); // Store profiles
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAppDetails = async () => {
      setLoading(true);
      try {
        const appDetails = await getAppDetails();

        const allProfiles = appDetails.flatMap((user) =>
          user.profiles.map((profile) => ({
            ...profile,
            appId: user.appId, // Attach appId to each profile
          }))
        );

        if (allProfiles.length === 0) {
          setError("No profiles found.");
          return;
        }

        dispatch(setAppId(allProfiles[0].appId)); // Save appId in Redux
        dispatch(setApplications(allProfiles)); // Save all profiles as applications in Redux

        setProfiles(allProfiles);
      } catch (err) {
        console.error("Failed to fetch app details:", err);
        setError("Failed to load profiles.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppDetails();
  }, [dispatch]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const handleStartHereClick = (appId) => {
    dispatch(setAppId(appId)); // Save appId in Redux
    navigate(`/app/${appId}/dashboard`); // Navigate to the app's dashboard
  };

  return (
    <div className="p-4" >
      <div className="flex flex-wrap justify-start items-center gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : profiles.map((profile, index) => (
              <div
                key={index}
                className="w-full max-w-[375px] 2xl:max-w-[420px] relative border rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer"
              >
                <img
                  src={profile.bgImg}
                  alt={`${profile.name}'s background`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-0 w-full bg-black bg-opacity-30 text-white p-4 flex justify-between items-center">
                  <h1 className="text-lg font-bold">{profile.name}</h1>
                  <button
                    onClick={() => handleStartHereClick(profile.appId)} // Use the appId for navigation
                    className="text-blue-400 hover:underline text-md"
                  >
                    Start Here
                  </button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default AppDashboard;

