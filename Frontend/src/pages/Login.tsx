import { FormEvent, useState } from "react";
import axios from "axios";
import { Input, message } from "antd";
import { NavLink, useNavigate } from "react-router-dom";

const Login = ({ setToken }: { setToken: (token: string | null) => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setDisabled(true);
    try {
      const response = await axios.post("http://localhost:4000/api/users/login", {
        email,
        password,
      });
      setToken(response.data.token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("role", response.data.role);
      message.success({
        content: "Login successful",
        className: "absolute right-0 px-5",
      });
      navigate("/tasks");
    } catch (error) {
      setDisabled(false);
      message.error({
        content: "Invalid email or password",
        className: "absolute right-0 px-5",
      });
      console.error("Error logging in", error);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <>
      <div className="w-full min-h-screen flex flex-col items-center bg-bg">
        <h1 className="text-3xl font-semibold text-gray py-3 u border-b border-primary">
          Login To continue
        </h1>
        <form
          onSubmit={handleSubmit}
          className="w-full m-auto max-w-[500px] font-normal text-lg p-10 flex flex-col gap-3 items-center bg-gray rounded-sm shadow-inner shadow-[#00000040]"
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input"
          />
          <Input.Password
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="input"
          />

          <p className="text-sm">
            Don't have an account?&nbsp;&nbsp;
            <NavLink to="/register" className="text-tertiary ">
              Register
            </NavLink>
          </p>

          <button
            type="submit"
            className={`main-btn ${disabled && " active:animate-none"}`}
            disabled={disabled}
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
