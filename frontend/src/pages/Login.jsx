import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { TbSocial } from "react-icons/tb";
import { CustomButton, Loading, TextInput } from "../components";
import { UserLogin } from "../redux/userSlice";
import { apiRequest } from "../utils";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrMsg("");
    try {
      const res = await apiRequest({
        url: "/auth/login",
        data: data,
        method: "POST",
      });
      if (res?.success) {
        setErrMsg({
          status: "success",
          message: res?.message || "Login successful!"
        });
        const newData = { token: res?.token, ...res?.user };
        dispatch(UserLogin(newData));
        window.location.replace("/");
      } else {
        setErrMsg({
          status: "failed",
          message: res?.message || "Login failed. Please try again."
        });
      }
    } catch (error) {
      console.log(error);
      setErrMsg({
        status: "failed",
        message: error?.response?.data?.message || "Something went wrong. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  return (
    <div className='bg-bgColor w-full h-screen flex items-center justify-center p-6'>
      <div className='w-full max-w-4xl flex bg-primary rounded-xl overflow-hidden shadow-xl'>
        {/* LEFT */}
        <div className='w-full p-10 md:p-16 flex flex-col justify-center'>
          <div className='w-full flex gap-2 items-center mb-6'>
            <div className='p-2 bg-[#065ad8] rounded text-white'>
              <TbSocial />
            </div>
            <span className='text-2xl text-[#065ad8] font-semibold'>
              Flicksy
            </span>
          </div>

          <p className='text-ascent-1 text-base font-semibold'>
            Log in to your account
          </p>
          <span className='text-sm mt-2 text-ascent-2'>Welcome back</span>

          <form
            className='py-8 flex flex-col gap-5'
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextInput
              name='email'
              placeholder='email@example.com'
              label='Email Address'
              type='email'
              register={register("email", {
                required: "Email Address is required",
              })}
              styles='w-full rounded-full'
              labelStyle='ml-2'
              error={errors.email ? errors.email.message : ""}
            />

            <TextInput
              name='password'
              label='Password'
              placeholder='Password'
              type='password'
              styles='w-full rounded-full'
              labelStyle='ml-2'
              register={register("password", {
                required: "Password is required!",
              })}
              error={errors.password ? errors.password?.message : ""}
            />

            <Link
              to='/reset-password'
              className='text-sm text-right text-blue font-semibold'
            >
              Forgot Password?
            </Link>

            {errMsg?.message && (
              <span
                className={`text-sm ${
                  errMsg?.status === "failed"
                    ? "text-[#f64949fe]"
                    : "text-[#2ba150fe]"
                } mt-0.5`}
              >
                {errMsg?.message}
              </span>
            )}

            {isSubmitting ? (
              <Loading />
            ) : (
              <CustomButton
                type='submit'
                 containerStyles={`inline-flex justify-center rounded-md bg-[#065ad8] mt-7 px-8 py-3 text-sm font-medium text-white outline-none`}
                title='Login'
              />
            )}
          </form>

          <p className='text-ascent-2 text-sm text-center'>
            Don't have an account?
            <Link
              to='/register'
              className='text-[#065ad8] font-semibold ml-2 cursor-pointer'
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
