import { FormEvent, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { Input, message } from "antd";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setDisabled(true);
    if (password.length < 6) {
      setDisabled(false);
      return message.error({
        content: "Password must be at least 6 characters",
        className: "absolute right-0 px-5",
      });
    }
    if (username.length < 3) {
      setDisabled(false);
      return message.error({
        content: "Username must be at least 3 characters",
        className: "absolute right-0 px-5",
      });
    }
    if (role === "") {
      setDisabled(false);
      return message.error({
        content: "Please select a role",
        className: "absolute right-0 px-5",
      });
    }

    try {
      await axios.post("http://localhost:4000/api/users/register", {
        username,
        email,
        password,
        role,
      });
      message.success({
        content: "User Registered Successfully",
        className: "absolute right-0 px-5",
      });
      navigate("/login");
    } catch (error) {
      setDisabled(false);
      message.error({
        content: "Error registering user",
        className: "absolute right-0 px-5",
      });
      console.error("Error registering user", error);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-bg">
      <h1 className="text-3xl font-semibold text-gray py-3 u border-b border-primary">Register</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full m-auto max-w-[500px] font-normal text-lg p-10 flex flex-col gap-3 items-center bg-gray rounded-sm shadow-inner shadow-[#00000040]"
      >
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="input"
          required
        />
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="input"
          required
        />
        <Input.Password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="input"
          required
        />

        <div className="w-full flex items-center gap-3">
          <label className="text-lg text-tertiary">Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="input">
            <option value="User">User</option>
            <option value="Manager">Manager</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <p className="text-sm">
          Already have an account?&nbsp;&nbsp;
          <NavLink to="/login" className="text-tertiary ">
            Login
          </NavLink>
        </p>

        <button
          type="submit"
          className={`main-btn ${disabled && " active:animate-none"}`}
          disabled={disabled}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
