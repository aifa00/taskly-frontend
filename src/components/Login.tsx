import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import axios from "../axiosConfig";
import InputGroup from "./InputGroup";
import Button from "../assets/Button";

function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState({
    emailError: "",
    passwordError: "",
    commonError: "",
  });
  const { setUser }: any = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      let hasError = false;
      let errorObj = {
        emailError: "",
        passwordError: "",
        commonError: "",
      };

      // Validate Email
      if (!email.trim()) {
        hasError = true;
        errorObj.emailError = "Please enter your email address.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        hasError = true;
        errorObj.emailError = "Please enter a valid email address.";
      }

      // Validate Password
      if (!password) {
        hasError = true;
        errorObj.passwordError = "Please enter a password.";
      } else if (password.length < 6) {
        hasError = true;
        errorObj.passwordError = "Password must be at least 6 characters long.";
      }

      setError(errorObj);

      if (hasError) return;

      if (loading) return;

      setLoading(true);

      const { data } = await axios.post(`/login`, {
        email: email.trim(),
        password,
      });

      navigate("/");

      localStorage.setItem("token", data.token);

      setUser(data.userData);
    } catch (error: any) {
      const status = error.response ? error.response.status : null;
      const errorMessage: string = error.response.data.message;

      if (status === 401 || status === 404) {
        setError({
          ...error,
          commonError: errorMessage,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignup = () => {
    navigate("/register");
  };

  return (
    <div
      className="w-80 p-3 md:w-96 md:p-5 shadow rounded-lg text-center
    absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <h1 className="mb-8 text-2xl">LOGIN</h1>

      <InputGroup
        label={"Email"}
        type={"email"}
        value={email}
        onChange={(e: any) => setEmail(e.target.value)}
        placeholder={"e.g.john@gmail.com"}
        error={error.emailError}
      />

      <div className="relative">
        <InputGroup
          label={"Password"}
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
          placeholder={"e.g.john@89"}
          error={error.passwordError}
        />
        <i
          className={`fa-solid ${
            showPassword ? "fa-eye-slash" : "fa-eye"
          } cursor-pointer text-slate-500 absolute top-9 right-5`}
          onClick={() => setShowPassword(!showPassword)}
        ></i>
      </div>
      <Button
        label={"LOGIN"}
        onClick={handleSubmit}
        loading={loading}
        error={error.commonError}
      />
      <span className="block mt-3 text-sm">
        Already have an account?&nbsp;
        <strong className="underline cursor-pointer" onClick={navigateToSignup}>
          Signup
        </strong>
      </span>
    </div>
  );
}

export default Login;
