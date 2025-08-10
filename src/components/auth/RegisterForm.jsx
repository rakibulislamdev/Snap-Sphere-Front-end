import { useForm } from "react-hook-form";
import Field from "../common/Field";
import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError,
  } = useForm();

  const password = watch("password");

  const submitForm = async (formData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/auth/signup`,
        formData
      );

      const { accessToken, refreshToken, user } = response.data;

      // Store tokens and user in local storage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Update auth context
      setAuth({ accessToken, refreshToken, user });

      toast.success("Your PhotoBooth account has been created successfully.");
      navigate("/edit-profile");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";

      setError("root.random", {
        type: "random",
        message: errorMessage,
      });

      toast.error(errorMessage);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="bg-white p-6 border border-gray-300 mb-3">
      <h2 className="text-center font-semibold text-gray-500 text-lg mb-4">
        Sign up to see photos and videos from your friends.
      </h2>

      <form onSubmit={handleSubmit(submitForm)}>
        <Field error={errors.email}>
          <input
            {...register("email", {
              required: "Email Address is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            type="email"
            id="email"
            name="email"
            className="form-input"
            placeholder="Email"
            aria-label="Email"
          />
        </Field>

        <Field error={errors.name}>
          <input
            {...register("name", {
              required: "Full Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
            type="text"
            id="name"
            name="name"
            className="form-input"
            placeholder="Full Name"
            aria-label="Full Name"
          />
        </Field>

        <Field error={errors.password}>
          <div className="relative">
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Must be at least 8 characters",
                },
                // pattern: {
                //   value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                //   message:
                //     "Password must contain uppercase, lowercase, and number",
                // },
              })}
              type={showPassword.password ? "text" : "password"}
              id="password"
              name="password"
              className="form-input pr-16"
              placeholder="Password"
              aria-label="Password"
            />

            <button
              onClick={() => togglePasswordVisibility("password")}
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 text-xs"
            >
              {showPassword.password ? "Hide" : "Show"}
            </button>
          </div>
        </Field>

        <Field error={errors.confirmPassword}>
          <div className="relative">
            <input
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              type={showPassword.confirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              className="form-input pr-16"
              placeholder="Confirm Password"
              aria-label="Confirm Password"
            />

            <button
              onClick={() => togglePasswordVisibility("confirmPassword")}
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 text-xs"
            >
              {showPassword.confirmPassword ? "Hide" : "Show"}
            </button>
          </div>
        </Field>

        {errors?.root?.random?.message && (
          <p className="text-red-500 text-xs my-1">
            {errors.root.random.message}
          </p>
        )}

        <div className="mb-2">
          <Field>
            <button
              type="submit"
              className="signup-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing up..." : "Sign up"}
            </button>
          </Field>
        </div>
      </form>
    </div>
  );
}
