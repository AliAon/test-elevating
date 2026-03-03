import React, { useState } from "react";
import Logo from "../assets/png/logo.png";
import Slash from "../assets/svg/eye-slash.svg";
import { useRestPasswordMutation } from "../redux/services/auth-api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../components/common/loader";

export default function SetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [passwordStrength, setPasswordStrength] = useState({
    label: "Weak",
    color: "bg-red-500",
    level: 1,
  });

  const [passwordTyped, setPasswordTyped] = useState(false);

  const [restPassword, { isLoading }] = useRestPasswordMutation();

  const evaluatePasswordStrength = (password) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return { label: "Weak", color: "bg-red-500", level: 1 };
    } else if (score === 3 || score === 4) {
      return { label: "Medium", color: "bg-yellow-500", level: 3 };
    } else {
      return { label: "Strong", color: "bg-green-500", level: 5 };
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      setPasswordTyped(value.length > 0);
      setPasswordStrength(evaluatePasswordStrength(value));
    }
  };

  const handleRest = () => {
    if (form.password !== form.confirmPassword) {
      toast.error("Password and confirm password should be same");
      return;
    }

    restPassword({
      newPassword: form.password,
    })
      .unwrap()
      .then((res) => {
        toast.success(res.message || "Password changed successfully");
        navigate(`/`);
      })
      .catch((err) => {
        toast.error(err?.data?.message || "Error resetting password");
      });
  };

  return (
    <div className="bg-auth flex items-center justify-center min-h-screen">
      <div className="w-[480px] bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-8 mx-auto">
        <img className="mx-auto w-[110px] h-[37px]" src={Logo} alt="Logo" />
        <h1 className="text-center text-[32px] font-semibold pt-5">
          Set Password
        </h1>
        <p className="text-center text-sm text-[#5B617F] font-medium pt-1">
          Enter a new password you can remember
        </p>

        {/* Password Field */}
        <div className="relative mt-3 border border-[#EAECEF] flex flex-col px-4 py-3 gap-[2px] rounded-2xl focus-within:border-[#5B617F]">
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
            onChange={handleChange}
            value={form.password}
            className="w-full outline-none bg-transparent text-[15px]"
          />
          <img
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1 right-3 h-[20px] w-[20px] mt-5 cursor-pointer"
            src={Slash}
            alt="eye icon"
          />
        </div>

        {/* Confirm Password Field */}
        <div className="relative mt-3 border border-[#EAECEF] flex flex-col px-4 py-3 gap-[2px] rounded-2xl focus-within:border-[#5B617F]">
          <label
            className="text-sm font-medium text-[#5B617F]"
            htmlFor="confirmPassword"
          >
            Re-enter Password
          </label>
          <input
            type={showRePassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full outline-none bg-transparent text-[15px]"
          />
          <img
            onClick={() => setShowRePassword(!showRePassword)}
            className="absolute top-1 right-3 h-[20px] w-[20px] mt-5 cursor-pointer"
            src={Slash}
            alt="eye icon"
          />
        </div>
        <div className="pt-3">
          <div className="flex items-center gap-2">
            {passwordTyped && (
              <span className="text-sm font-medium text-gray-700">
                {passwordStrength.label} Password
              </span>
            )}
            <div className="flex-1 flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                    passwordTyped
                      ? level <= passwordStrength.level
                        ? passwordStrength.color
                        : "bg-gray-200"
                      : "bg-gray-200"
                  }`}
                ></div>
              ))}
            </div>
          </div>
          <p className="font-medium text-[12px] text-[#5B617F] pt-2">
            Password must have at least 8 characters, with uppercase, lowercase,
            a number, and a special character.
          </p>
        </div>

        <button
          disabled={isLoading || !form.password || !form.confirmPassword}
          onClick={handleRest}
          className={`w-full flex items-center justify-center h-11 rounded-[90px] font-semibold text-[15px] mt-6 cursor-pointer 
            ${
              isLoading || !form.password || !form.confirmPassword
                ? "bg-[#F06B3C]/70 cursor-not-allowed text-white"
                : "bg-[#F06B3C] hover:opacity-90 text-white"
            }`}
        >
          {isLoading ? <Loader /> : "Reset"}
        </button>
      </div>
    </div>
  );
}
