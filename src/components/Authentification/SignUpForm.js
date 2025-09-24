import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { BaseModal } from "../ui/index";
import { useDispatch, useSelector } from "react-redux";
import { showModal, hideModal } from "../../redux/slices/modal/modalSlice";
import { getSignupUsers, createUser } from "../../services/api";

const SignupForm = ({ onSwitchForm }) => {
  const [formData, setFormData] = useState({ employeeId: "", email: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.from(form).indexOf(e.target);
      if (form.elements[index + 1]) form.elements[index + 1].focus();
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.employeeId) errors.employeeId = "Employee ID is required!";
    else if (!/^\d{5}$/.test(formData.employeeId))
      errors.employeeId = "Employee ID must be exactly 5 digits.";
    if (!formData.email) errors.email = "Email is required!";
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email))
      errors.email = "Invalid email format.";
    if (!formData.password) errors.password = "Password is required!";
    else if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{6,}$/.test(formData.password))
      errors.password = "Password must have 6+ chars, 1 uppercase, 1 symbol, 1 number.";
    return errors;
  };

  const handleModalOk = () => {
    if (modal.message === "🎉 Signup successful! Welcome aboard! 🚀") {
      onSwitchForm("login");
    }
    dispatch(hideModal());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      try {
        const users = await getSignupUsers();
        const employeeIdExists = users.some((user) => user.employeeId === formData.employeeId);
        const emailExists = users.some((user) => user.email === formData.email);

        if (employeeIdExists && emailExists) {
          dispatch(showModal({message: "🚫 Employee ID and Email already exist. Please use different ones. 🆔✉️",source:"signup"}));
          setIsSubmitting(false);
          return;
        } else if (employeeIdExists) {
          dispatch(showModal({message:"🚫 Employee ID already exists. Please use a different one. 🆔",source:"signup"}));
          setIsSubmitting(false);
          return;
        } else if (emailExists) {
          dispatch(showModal({message:"📧 Email already exists. Please use a different Email. ✉️",source:"signup"}));
          setIsSubmitting(false);
          return;
        }

        console.log("Submitting signup form with data:", formData);
        const signupResponse = await createUser(formData);

        if (signupResponse) {
          dispatch(showModal({ message: "🎉 Signup successful! Welcome aboard! 🚀", source: "signup" }));
        } else {
          dispatch(showModal({ message: `❌ Signup failed: ${signupResponse.message || "Unknown error"} 😞`, source: "signup" }));
        }
      } catch (error) {
        console.error("Error during signup:", error);
        dispatch(showModal("🚨 An error occurred. Please try again. 🤕"));
      } finally {
        setIsSubmitting(false);
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
      <form className="flex flex-col w-full max-w-xs mx-auto" onSubmit={handleSubmit}>
        <h2 className="text-2xl 2xl:text-3xl font-bold text-center mb-4 text-black dark:text-white">
          Create an Account
        </h2>
        {/* Employee ID Input */}
        <label className="text-base font-semibold mb-1 text-gray-700 dark:text-gray-400">Employee ID</label>
        <input
          type="text"
          placeholder="Enter your Employee ID"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          maxLength={5}
          onFocus={() => setFormErrors((prev) => ({ ...prev, employeeId: "" }))}
          onBlur={() => setFormErrors((prev) => ({ ...prev, employeeId: "" }))}
          id="employeeId"
          className="h-10 w-full text-base p-2 mb-2 text-gray-700 dark:text-white/50 outline-none border border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90"
        />
        {formErrors.employeeId && <span className="text-red-500 text-sm 2xl:text-base">{formErrors.employeeId}</span>}
        {/* Email Input */}
        <label className="text-base font-semibold mb-1 text-gray-700 dark:text-gray-400">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setFormErrors((prev) => ({ ...prev, email: "" }))}
          onBlur={() => setFormErrors((prev) => ({ ...prev, email: "" }))}
          id="email"
          maxLength={50}
          className="h-10 w-full text-base p-2 mb-2 text-gray-700 dark:text-white/50 outline-none border border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90"
        />
        {formErrors.email && <span className="text-red-500 text-sm 2xl:text-base">{formErrors.email}</span>}
        {/* Password Input */}
        <label className="text-base font-semibold mb-1 text-gray-700 dark:text-gray-400">Password</label>
        <div className="relative flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setFormErrors((prev) => ({ ...prev, password: "" }))}
            onBlur={() => setFormErrors((prev) => ({ ...prev, password: "" }))}
            id="password"
            className="h-10 w-full text-base p-2 mb-2 text-gray-700 dark:text-white/50 outline-none border border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90"
          />
          <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 cursor-pointer text-gray-500">
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>
        {formErrors.password && <span className="text-red-500 text-sm 2xl:text-base">{formErrors.password}</span>}
        <button
          type="submit"
          className="text-base bg-[#58AF9B] text-white font-bold py-2 rounded-lg mt-4 w-full flex justify-center items-center gap-2 transition hover:bg-white dark:hover:bg-black dark:hover:text-white hover:border hover:border-[#58AF9B] hover:text-black dark:border-[0.5px] dark:bg-transparent dark:bg-darkHover dark:border-[#58AF9B] duration-500"
          disabled={isSubmitting}
        >
          <span>Sign Up</span>
          {isSubmitting && <Loader2 className="animate-spin" size={20} />}
        </button>
        <p className="text-sm 2xl:text-base text-center mt-4 text-gray-700 dark:text-white/60">
          Already have an account?{" "}
          <span onClick={() => onSwitchForm("login")} className="text-sm 2xl:text-base text-[#58AF9B] font-bold cursor-pointer">
            Login here
          </span>
        </p>
      </form>
    </>
  );
};

export default SignupForm;