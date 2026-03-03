import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/png/logo.png";
import { useOtpMutation } from "../redux/services/auth-api";
import Loader from "../components/common/loader";
import { toast } from "react-toastify";

export const ForgotPassword = () => {
  const [sendOtp, { isLoading }] = useOtpMutation();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleOtp = () => {
    sendOtp({ email: email })
      .unwrap()
      .then((res) => {
        toast.success(res.message || "OTP sent successfully");
        localStorage.setItem("token", res?.token);
        navigate(`/otp?email=${email}`);
      })
      .catch((err) => {
        toast.error(err.data.message);
      });
  };
  return (
    <>
      <div className="bg-auth flex items-center justify-center min-h-screen">
        <div className="w-[480px] bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-8 mx-auto">
          <img className="mx-auto w-[110px] h-[37px]" src={Logo} alt="" />
          <h1 className="text-center text-[32px] font-semibold pt-5">
            Forgot Password
          </h1>
          <p className="text-center text-sm text-[#5B617F] font-medium pt-1">
            Please enter your email, we will send you a OTP
          </p>
          <div className="mt-5 border border-[#EAECEF] flex flex-col px-4 py-3 gap-[2px] rounded-2xl focus-within:border-[#5B617F]">
            <label
              className="text-sm font-medium text-[#5B617F]"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full outline-none bg-transparent text-[15px]"
            />
          </div>

          <button
            onClick={handleOtp}
            disabled={isLoading || !email}
            className="flex items-center justify-center cursor-pointer w-full h-11 bg-[#F06B3C] text-white rounded-[90px] font-semibold text-[15px] mt-6 hover:opacity-90"
          >
            {isLoading ? <Loader /> : "Continue"}
          </button>

          <p className="text-center text-sm text-[#5B617F] font-medium pt-6">
            Remember Your Password?{" "}
            <Link to="/" className="text-black font-semibold">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
