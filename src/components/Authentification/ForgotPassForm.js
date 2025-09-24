import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { hideModal, showModal } from "../../redux/slices/modal/modalSlice";
import { BaseModal } from "../ui/index";

const ForgotPasswordForm = ({ onSwitchForm }) => {
  const [emailOrId, setEmailOrId] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);

  const handleChange = (e) => {
    const value = e.target.value;
    setEmailOrId(value);
  
    const errors = validate(value);
    setFormErrors(errors);
  };
  

  const validate = () => {
    const errors = {};
    if (!emailOrId) {
      errors.email = "Email or Employee ID is required!";
    }
    return errors;
  };
  // const validate = (value) => {
  //   const errors = {};
  //   const emailRegex = /^[a-z0-9._%+-]+@gmail\.com$/;  // Accept only @gmail.com
  //   const employeeIdRegex = /^\d{5}$/;  // 5-digit employee ID
  
  //   if (!value) {
  //     errors.emailOrId = "Email or Employee ID is required!";
  //   } else {
  //     const trimmedInput = value.trim();
  //     const isEmail = emailRegex.test(trimmedInput);
  //     const isEmployeeId = employeeIdRegex.test(trimmedInput);
  
  //     if (!isEmail && !isEmployeeId) {
  //       errors.emailOrId = "Enter a valid email address or Employee ID.";
  //     }
  //   }
  
  //   return errors;
  // };
  
  const handleModalOk = () => {
    if (modal.message === "✅ User found! Proceed to reset your password.") {
      onSwitchForm("resetPassword");
    }
    dispatch(hideModal());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/signup`);
        const users = response.data;

        const matchedUser = users.find(
          (user) =>
            user.email.toLowerCase() === emailOrId.toLowerCase() ||
            user.employeeId.toLowerCase() === emailOrId.toLowerCase()
        );

        if (matchedUser) {
          localStorage.setItem("resetUserId", matchedUser.id);
          dispatch(showModal({ message: "✅ User found! Proceed to reset your password.", source: "forgotPassword" }));
        } else {
          dispatch(showModal({ message: "❌ No user found with this Email or Employee ID.", source: "forgotPassword" }));
        }
      } catch (error) {
        console.error("Error finding user:", error);
        dispatch(showModal({ message: "⚠️ Something went wrong. Please try again later.", source: "forgotPassword" }));
      }
    }
  };

  return (
    <>
      {modal.isVisible && (
        <BaseModal
          message={modal.message}
          onOk={handleModalOk}
          onCancel={() => dispatch(hideModal())}
        />
      )}
      <form className="flex flex-col max-w-xs w-full" onSubmit={handleSubmit}>
        <h2 className="text-2xl 2xl:text-3xl font-bold text-center mb-4 text-black dark:text-white">Reset Password</h2>
        <label htmlFor="emailOrId" className="text-base font-semibold mb-1 text-gray-700 dark:text-gray-400">Email or EmployeeID</label>
        <input
          type="text"
          name="emailOrId"
          value={emailOrId}
          onChange={handleChange}
          id="emailOrId"
          placeholder="Enter your Email or Employee ID"
          maxLength={50}
          className="h-10 w-full text-base p-2 mb-2 text-gray-700 dark:text-white/50 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90"
        />
{formErrors.emailOrId && (
  <span className="text-sm 2xl:text-base font-light text-red-600 mb-2">
    {formErrors.emailOrId}
  </span>
)}        <button
          type="submit"
          className="bg-[#58AF9B] text-white text-base font-bold py-2 rounded-lg mt-4 w-full transition hover:bg-white dark:hover:bg-black dark:hover:text-white hover:border hover:border-[#58AF9B] hover:text-black dark:border-[0.5px] dark:bg-transparent dark:bg-darkHover dark:border-[#58AF9B] duration-500"
        >
          Reset Password
        </button>
      </form>
    </>
  );
};

export default ForgotPasswordForm;

