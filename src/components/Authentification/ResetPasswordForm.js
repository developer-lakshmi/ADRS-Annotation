import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { BaseModal } from "../ui/index";
import { hideModal, showModal } from "../../redux/slices/modal/modalSlice";
import { updatePassword } from "../../services/api";

const ResetPasswordForm = ({ onSwitchForm }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.from(form).indexOf(e.target);
      if (form.elements[index + 1]) {
        form.elements[index + 1].focus();
      }
    }
  };

  const validate = () => {
    const errors = {};
    const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{6,}$/;

    if (!password) {
      errors.password = "Password is required!";
    } else if (!passwordPattern.test(password)) {
      errors.password =
        "Password must be at least 6 characters, include 1 uppercase letter, 1 number, and 1 special character (!@#$%^&*).";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match!";
    }

    return errors;
  };

  const handleModalOk = () => {
    if (modal.message.includes("successfully")) {
      onSwitchForm("login");
    }
    dispatch(hideModal());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      const userId = localStorage.getItem("resetUserId");
      if (!userId) {
        dispatch(showModal({ message: "❌ Invalid reset session. Please try again.", source: "resetPassword" }));
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await updatePassword(userId, password);

        if (response) {
          localStorage.removeItem("resetUserId");
          setPassword("");
          setConfirmPassword("");
          dispatch(showModal({ message: "🎉 Password has been successfully updated! Use your new Password to Login", source: "resetPassword" }));
        } else {
          dispatch(showModal({ message: "❌ Failed to update password. Please try again.", source: "resetPassword" }));
        }
      } catch (error) {
        console.error("Error updating password:", error);
        dispatch(showModal({ message: "❌ Something went wrong. Please try again later.", source: "resetPassword" }));
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

      <form className="flex flex-col max-w-xs w-full" onSubmit={handleSubmit}>
        <h2 className="text-2xl 2xl:text-3xl font-bold text-center mb-4 text-black dark:text-white">
          Update Password
        </h2>

        {/* Password Field */}
        <label htmlFor="password" className="text-base font-semibold mb-1 text-gray-700 dark:text-gray-400">New Password</label>
        <div className="relative flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your new password"
            name="password"
            value={password}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setFormErrors({ ...formErrors, password: "" })}
            onBlur={() => setFormErrors({ ...formErrors, password: "" })}
            id="password"
            className="h-10 w-full text-base p-2 mb-2 text-gray-700 dark:text-white/50 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90"
          />
          <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 cursor-pointer text-gray-500">
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>
        {formErrors.password && <span className="text-sm 2xl:text-base font-light text-red-600 mb-2">{formErrors.password}</span>}

        {/* Confirm Password */}
        <label htmlFor="confirmPassword" className="text-base font-semibold mb-1 text-gray-700 dark:text-gray-400">Confirm Password</label>
        <div className="relative flex items-center">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your new password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setFormErrors({ ...formErrors, confirmPassword: "" })}
            onBlur={() => setFormErrors({ ...formErrors, confirmPassword: "" })}
            id="confirmPassword"
            className="h-10 w-full text-base p-2 mb-2 text-gray-700 dark:text-white/50 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90"
          />
          <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 cursor-pointer text-gray-500">
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>
        {formErrors.confirmPassword && <span className="text-sm 2xl:text-base font-light text-red-600 mb-2">{formErrors.confirmPassword}</span>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#58AF9B] text-white text-base font-bold py-2 rounded-lg mt-4 w-full transition hover:bg-white dark:hover:bg-black dark:hover:text-white hover:border hover:border-[#58AF9B] hover:text-black dark:border-[0.5px] dark:bg-transparent dark:bg-darkHover dark:border-[#58AF9B] duration-500"
        >
          {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "Reset Password"}
        </button>
      </form>
    </>
  );
};

export default ResetPasswordForm;
