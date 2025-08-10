import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import Field from "../common/Field";
import Password from "./Password";
import useUserName from "../../hooks/useUserName";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import defaultImage from "../../assets/defaultAvatar.png";
import { DownArrow } from "../../utils/svg";

export default function EditProfile() {
  const { auth, setAuth } = useAuth();
  const { api } = useAxios();
  const userName = useUserName();

  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm();

  const userProfileInfoMutation = useMutation({
    mutationFn: async (fromData) => {
      const response = await api.patch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/users/me`,
        fromData
      );
      setAuth({ ...auth, user: response.data });
      if (response.status === 200) return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userProfileInfo"]);
    },
  });

  const userProfileImageMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await api.patch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/users/me/avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userProfileAvatar"]);
    },
  });

  const handleProfileInfo = (formData) => {
    userProfileInfoMutation.mutate(formData);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      userProfileImageMutation.mutate(formData);
    }
  };

  const avatarSrc = auth?.user?.avatar
    ? `${import.meta.env.VITE_STATIC_BASE_URL}/${auth.user.avatar}`
    : defaultImage;

  return (
    <form onSubmit={handleSubmit(handleProfileInfo)} className="edit-container">
      <h1 className="text-2xl font-bold mb-8">Edit profile</h1>

      <div className="bg-white rounded-lg p-6 mb-6">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
            <img
              src={avatarSrc}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-semibold text-base">{auth?.user?.name}</h2>
            <p className="text-gray-500">@{userName}</p>
          </div>
          <div className="ml-auto">
            <Field>
              <div>
                <label
                  htmlFor="avatar"
                  className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition"
                >
                  Change photo
                </label>
                <input
                  onChange={handleAvatarChange}
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </Field>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 mb-6">
        <label className="block mb-2 font-medium">Website</label>
        <input
          {...register("website")}
          type="url"
          id="website"
          placeholder="https://example.com"
          className="form-input mb-2"
        />
        <p className="text-gray-500 text-xs">
          Editing your links is only available on mobile. Visit the PhotoBooth
          app and edit your profile to change the websites in your bio.
        </p>
      </div>

      <div className="bg-white rounded-lg p-6 mb-6">
        <label className="block mb-2 font-medium">Bio</label>
        <textarea
          {...register("bio")}
          placeholder="Pain Demands to be Felt"
          className="form-input resize-none h-24 mb-1"
        />
        <div className="flex justify-end">
          <span className="text-gray-500 text-xs">23 / 150</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 mb-6">
        <label className="block mb-2 font-medium">Gender</label>
        <div className="relative">
          <select
            {...register("gender")}
            id="gender"
            className="form-input appearance-none pr-8"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="Prefer not to say">Prefer not to say</option>
            <option value="Custom">Custom</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <DownArrow />
          </div>
        </div>
        <p className="text-gray-500 text-xs mt-2">
          This won't be part of your public profile.
        </p>
      </div>

      <Password />

      <div className="mb-6">
        <p className="text-gray-500 text-sm">
          Certain profile info, like your name, bio and links, is visible to
          everyone.{" "}
          <a href="#" className="text-blue-500">
            See what profile info is visible
          </a>
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-100 text-blue-500 px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-200 transition"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
