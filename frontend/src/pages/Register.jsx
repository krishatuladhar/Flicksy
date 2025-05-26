import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { TbSocial } from "react-icons/tb";
import { BsShare } from "react-icons/bs";
import { AiOutlineInteraction } from "react-icons/ai";
import { ImConnection } from "react-icons/im";
import { CustomButton, Loading, TextInput } from "../components";
import { apiRequest } from "../utils";

const Register = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrMsg("");
   
    try {
      const res = await apiRequest({
        url: "/auth/register",
        data: data,
        method: "POST",
      });
     
      if (res?.status === "failed") {
        setErrMsg({
          status: "failed",
          message: res?.message || "Registration failed. Please try again."
        });
      } else {
        setErrMsg({
          status: "success",
          message: "Registration successful! Redirecting to login..."
        });
        setTimeout(() => {
          window.location.replace("/login");
        }, 5000);
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

  return (<div className='bg-bgColor w-full h-screen flex items-center justify-center p-6'>
  <div className='w-full max-w-4xl flex bg-primary rounded-xl overflow-hidden shadow-xl'>
    {/* FORM SECTION */}
    <div className='w-full p-10 md:p-16 flex flex-col justify-center'>
      {/* header */}
      <div className='w-full flex gap-2 items-center mb-6'>
        <div className='p-2 bg-[#065ad8] rounded text-white'>
          <TbSocial />
        </div>
        <span className='text-2xl text-[#065ad8] font-semibold'>Flicksy</span>
      </div>

      <p className='text-ascent-1 text-base font-semibold'>
        Create your account
      </p>

      {/* form */}
      <form
        className='py-8 flex flex-col gap-5'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='w-full flex flex-col lg:flex-row gap-1 md:gap-2'>
          <TextInput
            name='firstName'
            label='First Name'
            placeholder='First Name'
            type='text'
            styles='w-full'
            register={register("firstName", {
              required: "First Name is required!",
            })}
            error={errors.firstName?.message}
          />

          <TextInput
            label='Last Name'
            placeholder='Last Name'
            type='text'
            styles='w-full'
            register={register("lastName", {
              required: "Last Name is required!",
            })}
            error={errors.lastName?.message}
          />
        </div>

        <TextInput
          name='email'
          placeholder='email@example.com'
          label='Email Address'
          type='email'
          register={register("email", {
            required: "Email Address is required",
          })}
          styles='w-full'
          error={errors.email?.message}
        />

        <div className='w-full flex flex-col lg:flex-row gap-1 md:gap-2'>
          <TextInput
            name='password'
            label='Password'
            placeholder='Password'
            type='password'
            styles='w-full'
            register={register("password", {
              required: "Password is required!",
            })}
            error={errors.password?.message}
          />

          <TextInput
            label='Confirm Password'
            placeholder='Password'
            type='password'
            styles='w-full'
            register={register("cPassword", {
              validate: (value) =>
                value === getValues("password") || "Passwords do not match",
            })}
            error={errors.cPassword?.message}
          />
        </div>

        {errMsg?.message && (
          <span
            className={`text-sm ${
              errMsg?.status == "failed"
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
            title='Create Account'
          />
        )}
      </form>

      <p className='text-ascent-2 text-sm text-center'>
        Already have an account?{" "}
        <Link
          to='/login'
          className='text-[#065ad8] font-semibold ml-2 cursor-pointer'
        >
          Login
        </Link>
      </p>
    </div>
  </div>
</div>

  
  );
};

export default Register;