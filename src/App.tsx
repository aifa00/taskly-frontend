import "./App.css";
import { useContext, useEffect } from "react";
import axios from "./axiosConfig";
import { UserContext } from "./contexts/UserContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { user, setUser }: any = useContext(UserContext);
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axios.get("/auth/user");
        setUser(data.userData);
      } catch (error) {
        setUser({
          isUser: false,
          email: "",
        });
        console.log(error);
      }
    };

    getUser();
  }, []);

  return (
    <div className="App">
      <ToastContainer position="bottom-left" />
      <BrowserRouter>
        <Routes>
          <Route
            path="/register"
            Component={user.isUser ? HomePage : SignupPage}
          />
          <Route path="/login" Component={user.isUser ? HomePage : LoginPage} />
          <Route path="/" Component={user.isUser ? HomePage : LoginPage} />
          <Route path="*" element={<p>404 Page Not Found</p>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
