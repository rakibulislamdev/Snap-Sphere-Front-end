import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import useAxios from "../../hooks/useAxios";
import { toast } from "react-toastify";

export default function Password({
  register,
  watch,
  handleSubmit,
  reset,
  errors,
}) {
  const [strength, setStrength] = useState(0);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const queryClient = useQueryClient();
  const { api } = useAxios();
  const newPassword = watch("newPassword");

  useEffect(() => {
    if (!newPassword) {
      setStrength(0);
      return;
    }
    let score = 0;
    if (newPassword.length >= 6) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/\d/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;
    if (newPassword.length >= 10) score++;
    setStrength(Math.min(score, 4));
  }, [newPassword]);

  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-400",
    "bg-green-500",
  ];

  const { mutate: userPasswordMutation, isLoading } = useMutation({
    mutationFn: async (fromData) => {
      const response = await api.patch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/users/me/password`,
        fromData
      );

      if (response.status === 200) return response.data;
    },

    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["userProfileInfo"]);
      reset();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || error.message);
      console.error("API Error:", error.response?.data || error.message);
    },
  });

  const handlePasswordChange = (fromData) => {
    const { currentPassword, newPassword, confirmPassword } = fromData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return;
    }

    userPasswordMutation({
      currentPassword,
      newPassword,
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <h2 className="font-medium text-lg mb-4">Change Password</h2>

      <div className="mb-4">
        <label className="block mb-2 text-sm">Current Password</label>
        <div className="relative">
          <input
            {...register("currentPassword")}
            id="currentPassword"
            type={showPassword.currentPassword ? "text" : "password"}
            className="form-input pr-10"
            placeholder="Enter your current password"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility("currentPassword")}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 text-sm"
          >
            {showPassword.currentPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm">New Password</label>
        <div className="relative">
          <input
            {...register("newPassword")}
            id="newPassword"
            type={showPassword.newPassword ? "text" : "password"}
            className="form-input pr-10 mb-1"
            placeholder="Enter new password"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility("newPassword")}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 text-sm"
          >
            {showPassword.newPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="flex w-full h-1 mb-1">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-1/4 ${
                index < strength ? colors[strength - 1] : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <p className="text-xs text-gray-500 mb-1">
          {["Weak", "Fair", "Good", "Strong"][strength - 1] || "Too weak"}
        </p>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm">Confirm New Password</label>
        <div className="relative">
          <input
            {...register("confirmPassword", {
              validate: (value) =>
                value === watch("newPassword") || "Passwords do not match",
            })}
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword.confirmPassword ? "text" : "password"}
            className="form-input pr-10"
            placeholder="Confirm new password"
          />

          <button
            type="button"
            onClick={() => togglePasswordVisibility("confirmPassword")}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 text-sm"
          >
            {showPassword.confirmPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors?.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        disabled={isLoading}
        onClick={handleSubmit(handlePasswordChange)}
        type="submit"
        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition"
      >
        {isLoading ? "Saving..." : "Change Password"}
      </button>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          After changing your password, you'll be logged out of all devices
          except the ones you're using now.
        </p>
      </div>
    </div>
  );
}
