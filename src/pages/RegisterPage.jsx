import { Link } from "react-router";
import PhotoBoothLogo from "../assets/logo-2.svg";
import RegisterForm from "../components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-8 sm:px-6 lg:px-8">
      <div className="signup-container">
        <div className="flex justify-center mb-4">
          <img src={PhotoBoothLogo} alt="PhotoBooth" className="h-[51px]" />
        </div>
        <RegisterForm />
        <div className="bg-white p-6 border border-gray-300 text-center mb-4 rounded-md">
          <p className="text-sm">
            Have an account?{" "}
            <Link to="/login" className="text-blue-500 font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
