import { Link } from "react-router-dom"; // react-router-dom এ পরিবর্তন
import SnapSphereLogo from "../assets/SnapSphereLogo.svg";
import LoginForm from "../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="login-container rounded-md">
        <div className="flex justify-center mb-8">
          <img src={SnapSphereLogo} alt="SnapSphereLogo" className="h-[51px]" />
        </div>

        <div className="bg-white p-6 border border-gray-300 mb-3 rounded-md">
          <LoginForm />
        </div>

        <div className="bg-white p-6 border border-gray-300 text-center ">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
