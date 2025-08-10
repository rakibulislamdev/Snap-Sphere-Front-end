import { useForm } from "react-hook-form";
import { useEffect } from "react";
import useUserName from "../../hooks/useUserName";
import Password from "./Password";
import Field from "../common/Field";
import { DownArrow } from "../../utils/svg";
import useEditProfile from "../../hooks/useEditProfile";

export default function EditProfile() {
  const userName = useUserName();
  const { auth, avatar, handleProfile, handleAvatarChange } = useEditProfile();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  // ইনিশিয়াল ভ্যালু সেট করুন
  useEffect(() => {
    if (auth?.user) {
      setValue("bio", auth.user.bio || "");
      setValue("website", auth.user.website || "");
      setValue("gender", auth.user.gender || "");
      console.log("Initial user data:", auth.user); // ডিবাগিংয়ের জন্য
    }
  }, [auth?.user, setValue]);

  const bio = watch("bio") || "";

  // এখানে ফর্ম সাবমিট হ্যান্ডলার এ ডিবাগিং যোগ করুন
  const onSubmit = (data) => {
    console.log("Form submitted with data:", data);
    handleProfile(data, reset);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="edit-container">
      <h1 className="text-2xl font-bold mb-8">Edit profile</h1>
      <div className="bg-white rounded-lg p-6 mb-6">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
            <img
              src={avatar}
              alt={auth?.user?.name}
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
        <Field>
          <div>
            <label htmlFor="website" className="block mb-2 font-medium">
              Website
            </label>
            <input
              {...register("website")}
              name="website"
              id="website"
              type="url"
              className="form-input mb-2"
              placeholder="https://example.com"
            />

            <p className="text-gray-500 text-xs -mb-4">
              Editing your links is only available on mobile. Visit the
              PhotoBooth app and edit your profile to change the websites in
              your bio.
            </p>
          </div>
        </Field>
      </div>

      <div className="bg-white rounded-lg p-6 mb-6">
        <Field>
          <div>
            <label htmlFor="bio" className="block mb-2 font-medium">
              Bio
            </label>
            <textarea
              {...register("bio")}
              name="bio"
              id="bio"
              type="text"
              maxLength={150}
              className="form-input resize-none h-24 mb-1"
              placeholder="Write something about yourself"
            />

            <div className="flex justify-end -mb-4">
              <span className="text-gray-500 text-xs">{bio?.length} / 150</span>
            </div>
          </div>
        </Field>
      </div>

      <div className="bg-white rounded-lg p-6 mb-6">
        <label className="block mb-2 font-medium">Gender</label>
        <div className="relative">
          <select
            {...register("gender")}
            name="gender"
            id="gender"
            type="text"
            className="form-input appearance-none pr-8"
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
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
      <Password
        handleSubmit={handleSubmit}
        register={register}
        watch={watch}
        errors={errors}
        reset={reset}
      />
      <div className="mb-6">
        <p className="text-gray-500 text-sm">
          Certain profile info, like your name, bio and links, is visible to
          everyone.
          <a href="#" className="text-blue-500">
            See what profile info is visible
          </a>
        </p>
      </div>
      {/* Submit Button */}
      <div className="flex justify-end">
        <Field>
          <button
            type="submit"
            className="cursor-pointer bg-blue-100 text-blue-500 px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-200 transition"
          >
            Submit
          </button>
        </Field>
      </div>
    </form>
  );
}
