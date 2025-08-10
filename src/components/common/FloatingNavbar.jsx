import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import photoBoothLogo from "../../assets/logo-2.svg";
import { CreatePost, Home, Notifications, Profile } from "../../utils/svg";
import Logout from "../auth/Logout";
import { useAuth } from "../../hooks/useAuth";
import defaultAvatar from "../../assets/defaultAvatar.png";
import useUserName from "../../hooks/useUserName";
import useAxios from "../../hooks/useAxios";

export default function FloatingNavbar() {
  const { auth } = useAuth();
  const userName = useUserName();
  const user = auth?.user;
  const { api } = useAxios();
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      try {
        const response = await api.get(
          `${import.meta.env.VITE_SERVER_BASE_URL}/notifications`
        );
        const unread = response.data.filter(
          (notification) => !notification.isRead
        ).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [user, api]);

  const handleNotificationClick = async () => {
    try {
      navigate("/notifications");

      if (unreadCount > 0) {
        await api.patch(
          `${import.meta.env.VITE_SERVER_BASE_URL}/notifications/read-all`
        );

        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const navbarLinks = [
    {
      path: "/",
      icon: <Home />,
      label: "Home",
      onClick: () => navigate("/"),
    },
    {
      path: "/notifications",
      icon: <Notifications />,
      label: "Notifications",
      badge: unreadCount > 0,
      onClick: handleNotificationClick,
    },
    {
      path: "/create-post",
      icon: <CreatePost />,
      label: "Create",
      onClick: () => navigate("/create-post"),
    },
    {
      path: `/profile/${user?._id}`,
      icon: <Profile />,
      label: "Profile",
      onClick: () => navigate(`/profile/${user?._id}`),
    },
  ];

  const renderUserAvatar = () => {
    const avatarSrc = user?.avatar ? `${user.avatar}` : defaultAvatar;

    return (
      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300">
        <img
          src={avatarSrc}
          alt="User avatar"
          className="w-full h-full object-cover"
        />
      </div>
    );
  };

  return (
    <aside className="hidden floating-navbar border-gray-200 bg-white border px-6 py-2 md:flex flex-col">
      <Link
        to="/"
        className="flex gap-2 items-center font-medium py-4 mb-8 hover:opacity-80 transition-opacity"
      >
        <img
          src={photoBoothLogo}
          alt="PhotoBooth"
          className="h-6 object-contain"
        />
        <h2 className="text-lg">Photo Booth</h2>
      </Link>

      <nav>
        <ul className="space-y-8 flex-1">
          {navbarLinks.map((item, index) => (
            <li key={index}>
              <button
                onClick={item.onClick}
                className={`
                  flex flex-row items-center gap-2 w-full text-left
                  group transition-colors duration-200
                  ${
                    location.pathname === item.path
                      ? "font-semibold text-blue-600"
                      : "text-zinc-800 hover:text-blue-600"
                  }
                `}
              >
                <span className="group-hover:scale-110 transition-transform relative">
                  {item.icon}
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </span>
                <span className="text-sm">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {user && (
        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <Link
            to={`/profile/${user._id}`}
            className="flex items-center hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              {renderUserAvatar()}
              <div>
                <span className="font-semibold text-sm block">
                  {user?.name}
                </span>
                <p className="text-xs text-gray-500 leading-tight">
                  @{userName}
                </p>
              </div>
            </div>
          </Link>

          <Logout />
        </div>
      )}
    </aside>
  );
}
