import { useState } from "react";
import Field from "../common/Field";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { toast } from "react-toastify";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  const from = location.state?.from?.pathname || "/";

  const submitForm = async (formData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/auth/login`,
        formData
      );

      const { accessToken, refreshToken, user } = response.data;

      // Store tokens and user in local storage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Update auth context
      setAuth({ accessToken, refreshToken, user });

      // Success notification
      toast.success("Login Successful!");

      // Navigate to previous or home page
      navigate(from, { replace: true });
    } catch (error) {
      // Error handling
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";

      setError("root.random", {
        type: "random",
        message: errorMessage,
      });

      // Error toast
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <Field error={errors.email}>
        <input
          {...register("email", {
            required: "Email is required!",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          id="email"
          type="email"
          name="email"
          className="form-input"
          placeholder="Email address"
          aria-label="Email address"
        />
      </Field>

      <Field error={errors.password}>
        <div className="relative">
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            className="form-input pr-16"
            placeholder="Password"
            aria-label="Password"
          />

          <button
            onClick={() => setShowPassword(!showPassword)}
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 text-xs"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </Field>

      <div className="mb-4">
        <Field>
          <button
            type="submit"
            className="login-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </Field>
      </div>

      {errors?.root?.random?.message && (
        <p className="text-red-500 text-xs mt-1">
          {errors.root.random.message}
        </p>
      )}

      <div className="or-separator">OR</div>

      <div className="mb-4">
        <Field>
          <button type="button" className="login-button bg-red-500 text-white">
            Log in with Google
          </button>
        </Field>
      </div>
    </form>
  );
}
