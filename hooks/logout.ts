import { useRouter } from "next/navigation";
import { store } from "@/store";
import { clearUser } from "@/store/slices/userSlice";
import { notify } from "@/utils/toastStore";

export const useLogout = () => {
  const router = useRouter();

  const logout = () => {
    store.dispatch(clearUser());
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    notify({
      type: "success",
      title: "Logged Out",
      message: "You have been logged out successfully",
      autoClose: true,
      autoCloseDelay: 3000,
    });

    router.push("/");
  };

  return { logout };
};
