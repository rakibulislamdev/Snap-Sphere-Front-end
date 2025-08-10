import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import defaultAvatar from "../assets/defaultAvatar.png";
import { toast } from "react-toastify";

export default function useEditProfile() {
  const { auth, setAuth } = useAuth();
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [avatarFile, setAvatarFile] = useState(null);

  const baseURL = import.meta.env.VITE_SERVER_BASE_URL || "";

  useEffect(() => {
    if (auth?.user?.avatar) {
      setAvatar(auth.user.avatar);
    }
  }, [auth?.user?.avatar]);

  const handleProfile = async (data) => {
    try {
      if (!auth?.accessToken) {
        toast.error("You are not logged in. Please log in and try again.");
        return;
      }

      const profileResponse = await fetch(`${baseURL}/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify({
          name: auth.user.name,
          bio: data.bio,
          website: data.website,
          gender: data.gender,
        }),
      });

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json();
        throw new Error(errorData.message || "Profile update failed");
      }

      const updatedUser = await profileResponse.json();

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setAuth({
        ...auth,
        user: updatedUser,
      });

      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        const avatarResponse = await fetch(`${baseURL}/users/me/avatar`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
          body: formData,
        });

        if (!avatarResponse.ok) {
          const errorData = await avatarResponse.json();
          throw new Error(errorData.message || "Avatar update failed");
        }

        const avatarData = await avatarResponse.json();

        localStorage.setItem("user", JSON.stringify(avatarData.user));
        setAuth({
          ...auth,
          user: avatarData.user,
        });
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatar(URL.createObjectURL(file));
    }
  };

  return { auth, avatar, handleProfile, handleAvatarChange };
}
