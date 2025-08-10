import { useEffect } from "react";

export default function useGlobalLogin(
  auth,
  isLoginModalOpen,
  setIsLoginModalOpen
) {
  useEffect(() => {
    if (auth?.accessToken) return;

    const handleWindowClick = () => {
      setIsLoginModalOpen(true);
    };

    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, [auth, isLoginModalOpen, setIsLoginModalOpen]);
}
