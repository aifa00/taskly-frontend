import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import Dialog from "../assets/Dialog";

function Navbar() {
  const { user, setUser }: any = useContext(UserContext);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [dialog, setDialog] = useState<any>({});
  const navigate = useNavigate();

  const handleLogout = () => {
    setDialog({
      message: "Are you sure you want to logout?",
      buttonLabel: "Logout",
      onCancel: () => setOpenConfirmDialog(false),
      onSuccess: () => {
        localStorage.removeItem("token");
        setUser({
          isUser: false,
          email: "",
        });
        navigate("/login");
      },
    });
    setOpenConfirmDialog(true);
  };

  return (
    <div className="h-20 w-full bg-white flex items-center justify-around shadow-md">
      <h1 className="text-2xl font-bold">Taskly</h1>
      {user.isUser && (
        <div>
          <strong className="hidden md:inline-block">{user.email}</strong>{" "}
          &nbsp;
          <button
            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300"
            onClick={handleLogout}
          >
            <i className="fa-solid fa-power-off"></i>
          </button>
        </div>
      )}
      {openConfirmDialog && <Dialog dialog={dialog} />}
    </div>
  );
}

export default Navbar;
