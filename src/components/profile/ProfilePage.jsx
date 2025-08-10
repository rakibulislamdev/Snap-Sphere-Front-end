import { useState } from "react";
import useAxios from "../../hooks/useAxios";
import ProfileInfo from "./ProfileInfo";
import MyPosts from "./MyPosts";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function ProfilePage() {
  const { api } = useAxios();
  const { id } = useParams();
  const [error, setError] = useState(null);

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["userProfile", id],
    queryFn: async () => {
      try {
        const response = await api.get(`/users/${id}/with-posts`);
        return response.data;
      } catch (err) {
        setError(err.message || "Error loading profile");
        throw err;
      }
    },
    onError: (err) => {
      setError(err.message || "Failed to load profile");
    },
  });

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="main-container">
      <div className="profile-container">
        <ProfileInfo userProfile={userProfile} />
        <MyPosts userProfile={userProfile} />
      </div>
    </div>
  );
}
