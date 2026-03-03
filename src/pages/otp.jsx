import React, { useState } from "react";
import OtpInput from "react-otp-input";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/png/logo.png";
import Resend from "../assets/svg/resend.svg";
import { toast } from "react-toastify";
import {
  useOtpMutation,
  useVerifyOtpMutation,
} from "../redux/services/auth-api";
import Loader from "@/components/common/loader";

export default function Otp() {
  const [otp, setOtp] = useState("");
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const email = queryParams.get("email");
  const [sendOtp, { isLoading }] = useOtpMutation();
  const navigate = useNavigate();
  const [verifingOtp, { isLoading: isVerifingOtp }] = useVerifyOtpMutation();

  const handleOtp = () => {
    sendOtp({ email: email })
      .unwrap()
      .then((res) => {
        localStorage.setItem("token", res?.token);
        toast.success(res.message || "OTP sent successfully");
      })
      .catch((err) => {
        toast.error(err.data.message);
      });
  };

  const handleVerify = () => {
    verifingOtp({ otp: otp })
      .unwrap()
      .then((res) => {
        toast.success(res.message || "OTP verified successfully");
        navigate(`/setPassword`);
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
            Enter OTP
          </h1>
          <p className="text-center text-sm text-[#5B617F] font-medium pt-1">
            Enter the OTP we sent to your registered email
          </p>

          <div className="mx-auto bg-[#F6F6F8] w-fit space-x-1 rounded-[50px] px-[16px] py-[8px] mt-3">
            <span className="text-[#5B617F] font-medium text-sm">{email}</span>
          </div>

          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderInput={(props) => <input {...props} />}
            inputStyle="!w-[50px] h-[60px] border border-[#EAECEF] !rounded-[16px] text-center text-[20px] focus:border-[#5B617F] focus:outline-none"
            containerStyle="justify-center mt-6 gap-4"
          />

          <div
            onClick={handleOtp}
            className="mx-auto flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            <img
              src={Resend}
              alt="icon"
              className={isLoading ? "animate-spin" : ""}
            />
            <span className="font-medium text-sm text-[#060606]">Resend</span>
          </div>

          <button
            onClick={handleVerify}
            disabled={!otp}
            className="flex items-center justify-center w-full bg-[#F06B3C] text-white h-11 rounded-[90px] font-semibold text-[15px] mt-6 hover:opacity-90 cursor-pointer"
          >
            {isVerifingOtp ? <Loader /> : "Continue"}
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
}
