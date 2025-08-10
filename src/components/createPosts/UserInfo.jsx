import { useAuth } from "../../hooks/useAuth";
import defaultAvatar from "../../assets/defaultAvatar.png";
import { Link } from "react-router-dom";

export default function UserInfo() {
  const { auth } = useAuth();
  console.log(auth);

  const avatarUrl = !auth?.user?.avatar
    ? defaultAvatar
    : `${auth?.user?.avatar}`;

  if (!auth?.user) return null;

  return (
    <Link
      to={`/profile/${auth.user._id}`}
      className="block hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center p-4 border-b">
        <div
          className="w-10 h-10 rounded-full overflow-hidden 
          bg-gray-300 border-2 border-gray-200 
          group-hover:border-blue-300 transition-all"
        >
          <img
            src={avatarUrl}
            alt={auth.user.name}
            className="w-full h-full object-cover 
              group-hover:scale-105 transition-transform"
            loading="lazy"
          />
        </div>

        <div className="ml-3">
          <span className="font-semibold text-sm block">{auth.user.name}</span>
          <span className="text-xs text-gray-500">
            @{auth.user.name.toLowerCase().replace(/\s+/g, "")}
          </span>
        </div>
      </div>
    </Link>
  );
}
