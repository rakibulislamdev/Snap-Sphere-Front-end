import { useNavigate } from "react-router";
import { LogoutIcon } from "../../utils/svg";
import { useAuth } from "../../hooks/useAuth";

export default function Logout() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setAuth(null);
    navigate("/login");
  };
  return (
    <button onClick={handleLogout} title="logout" className="cursor-pointer">
      <LogoutIcon />
    </button>
  );
}
