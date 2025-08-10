import { useAuth } from "../../hooks/useAuth";
import defaultAvatar from "../../assets/defaultAvatar.png";
import { BioIcon } from "../../utils/svg";
import { Link } from "react-router-dom";

export default function ProfileInfo({ userProfile }) {
  const { auth } = useAuth();
  const profileUser = userProfile?.user || {};
  const profileUserId = profileUser?._id;
  const postsCount = userProfile?.postsCount || 0;
  const isOwnProfile = auth?.user?._id === profileUserId;

  return (
    <div className="flex flex-col md:flex-row mb-10">
      <div className="flex justify-items-end md:justify-start md:w-1/3 mb-6 md:mb-0 relative">
        <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden border border-gray-300 mx-auto">
          <img
            src={profileUser?.avatar || defaultAvatar}
            alt="Profile picture"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="md:w-2/3">
        <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4">
          <h2 className="text-xl font-normal mb-4 sm:mb-0 sm:mr-4">
            {profileUser?.name}
          </h2>
        </div>

        {isOwnProfile && (
          <div className="flex space-x-2">
            <Link
              to="/edit-profile"
              className="bg-gray-100 px-4 py-1.5 rounded-md text-sm font-medium"
            >
              Edit profile
            </Link>
          </div>
        )}

        <div className="flex justify-center sm:justify-start space-x-8 mb-4 mt-2">
          <div>
            <span className="font-semibold">{postsCount}</span> posts
          </div>
        </div>

        <div className="text-sm">
          {profileUser?.bio && <p>{profileUser.bio}</p>}
          {profileUser?.website && (
            <p className="text-blue-900">
              <a
                href={profileUser.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <BioIcon />
                {profileUser.website}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
