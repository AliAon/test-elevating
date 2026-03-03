import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/png/logo.png";
import Slash from "../assets/svg/eye-slash.svg";
import { useLogInMutation } from "../redux/services/auth-api";
import Loader from "../components/common/loader";
import { toast } from "react-toastify";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLogInMutation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    const savedCredentials = localStorage.getItem("rememberedUser");
    if (savedCredentials) {
      const parsed = JSON.parse(savedCredentials);
      setForm({ email: parsed.email, password: parsed.password });
      setRemember(true);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    if (!form.email || !form.password) {
      toast.error("Please enter both email and password");
      return;
    }

    loginUser(form)
      .unwrap()
      .then((res) => {
        toast.success(res.message || "Login successful");
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res));

        if (remember) {
          localStorage.setItem("rememberedUser", JSON.stringify(form));
        } else {
          localStorage.removeItem("rememberedUser");
        }
        if (
          res?.user_type_name === "admin" ||
          res?.user_type_name === "superadmin"
        ) {
          navigate(`/admin/dashboard`);
        } else {
          navigate(`/dashboard`);
        }
      })
      .catch((err) => {
        toast.error(err?.data?.message || "Login failed");
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="bg-auth flex items-center justify-center min-h-screen">
      <div className="w-[480px] bg-white border border-gray-200 shadow-sm rounded-xl p-8 mx-auto animate-fadeInUp">
        <img className="mx-auto w-[170px] transition-transform duration-300" src={Logo} alt="logo" />
        <h1 className="text-center text-2xl font-semibold pt-5">
          Welcome Back
        </h1>
        <p className="text-center text-sm text-[#5B617F] font-medium pt-1">
          Please enter your details below
        </p>

        <div className="mt-5 border-2 border-[#EAECEF] flex flex-col px-4 py-3 gap-[2px] rounded-lg transition-all duration-300">
          <label className="text-sm font-medium text-[#5B617F]" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter your email"
            className="w-full outline-none bg-transparent text-[15px]"
          />
        </div>

        <div className="relative mt-3 border-2 border-[#EAECEF] flex flex-col px-4 py-3 gap-[2px] rounded-lg transition-all duration-300">
          <label
            className="text-sm font-medium text-[#5B617F]"
            htmlFor="password"
          >
            Enter Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter your password"
            className="w-full outline-none bg-transparent text-[15px]"
          />
          <img
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1 right-3 h-[20px] w-[20px] mt-5 cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95"
            src={Slash}
            alt="eye icon"
          />
        </div>

        <div className="flex justify-between mt-4">
          <div className="flex items-center group cursor-pointer">
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={() => setRemember(!remember)}
              className="mr-2 border-2 border-[#898EA6] self-center h-[16px] w-[16px] cursor-pointer transition-colors duration-200 hover:border-[#F06B3C]"
            />
            <label
              htmlFor="remember"
              className="text-sm text-[#5B617F] font-medium cursor-pointer transition-colors duration-200 group-hover:text-[#F06B3C]"
            >
              Remember Me
            </label>
          </div>
          <Link
            to="/forgotPassword"
            className="text-[15px] text-[#060606] font-semibold transition-all duration-200 hover:text-[#F06B3C] hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="flex items-center justify-center cursor-pointer w-full bg-gradient-to-r from-[#F06B3C] to-[#f07d51] text-white h-11 rounded-full font-semibold text-[15px] mt-6 transition-all duration-300 hover:shadow-lg hover:shadow-[#F06B3C]/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? <Loader size="small" /> : "Sign In"}
        </button>
      </div>
    </div>
  );
}
