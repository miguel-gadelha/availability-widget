import { LogOut } from "lucide-react";
import SmallButton from "../ui/SmallButton";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const LogOutButton = () => {
  const router = useRouter();

  const handleClick = () => {
    Cookies.remove("auth");
    router.push("/auth/login");
  };

  return (
    <SmallButton onClick={handleClick}>
      <LogOut width={16} height={16} />
    </SmallButton>
  );
};

export default LogOutButton;
