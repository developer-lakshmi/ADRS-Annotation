import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { showModal, hideModal } from "../../redux/slices/modal/modalSlice";
import { login } from "../../redux/slices/auth/authSlice";
import { getLoginUsers, getSignupUsers } from "../../services/api";
import { BaseModal } from "../ui/index";

const LoginForm = ({ onSwitchForm }) => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "employeeId") setEmployeeId(value);
    else if (name === "password") setPassword(value);
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
    if (!employeeId) errors.employeeId = "Employee ID is required!";
    else if (!/^\d{5}$/.test(employeeId))
      errors.employeeId = "Employee ID must be exactly 5 digits.";
    if (!password) errors.password = "Password is required!";
    return errors;
  };

  const handleModalOk = () => {
    if (modal.source === "login" && modal.message === "✅ Login successful! Welcome back! 😊") {
      navigate("/Home");
    }
    dispatch(hideModal());
  };

  const handleModalCancel = () => {
    dispatch(hideModal());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      setTimeout(async () => {
        try {
          const loginUsers = await getLoginUsers();
          const user = loginUsers.find(
            (u) => u.employeeId === employeeId && u.password === password
          );

          if (user) {
            const signupUsers = await getSignupUsers();
            const matchedSignupUser = signupUsers.find(
              (u) => u.employeeId === user.employeeId
            );

            const email = matchedSignupUser.email || "";
            const role = user.role || "user";
            const token = user.token || "default-token";

            const currentUser = { ...user, email, role };
            const tokenExpiry = Date.now() + 1 * 60 * 60 * 1000; // Token valid for 2 minutes

            // const tokenExpiry = Date.now() + 5 * 60 * 1000; // Token valid for 5 minutes
            // const tokenExpiry = Date.now() + 1 * 60 * 60 * 1000; // Token valid for 1 hour

            console.log("Token expiry set:", tokenExpiry); // Debugging log
            localStorage.setItem("tokenExpiry", tokenExpiry); // Set token expiry in localStorage
            console.log("Dispatching login with:", currentUser, token, tokenExpiry); // Debugging log

            localStorage.setItem("tokenExpiry", tokenExpiry); // Set token expiry in localStorage
            dispatch(login({ user: currentUser, token }));
            dispatch(showModal({ message: "✅ Login successful! Welcome back! 😊", source: "login" })); // Add source
          } else {
            dispatch(showModal({ message: "❌ Invalid credentials. Please try again.", source: "login" }));
          }
        } catch (error) {
          console.error("Login failed:", error);
          dispatch(showModal({ message:"⚠️ An error occurred. Please try again later. 🙏",source:'login'}));
        } finally {
          setIsSubmitting(false);
        }
      }, 2000);
    }
  };

  return (
    <>
      {modal.isVisible && (
        <BaseModal
          message={modal.message}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
        />
      )}
      <form className="flex flex-col w-full max-w-xs md:max-w-md mx-auto" onSubmit={handleSubmit}>
        <h2 className="text-2xl 2xl:text-3xl font-bold text-center mb-4 text-black dark:text-white">
          Welcome Back!
        </h2>

        <label htmlFor="employeeId" className="text-base font-semibold text-gray-700 dark:text-gray-400 mb-1">
          Employee ID
        </label>
        <input
          type="text"
          placeholder="Enter your Employee ID"
          name="employeeId"
          value={employeeId}
          onChange={handleChange}
          id="employeeId"
          onFocus={() => setFormErrors({ ...formErrors, employeeId: "" })}
          onBlur={() => setFormErrors({ ...formErrors, employeeId: "" })}
          onKeyDown={handleKeyDown}
          maxLength={5}
          className="h-10 w-full text-base p-2 mb-2 text-gray-700 dark:text-white/50 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90"
        />
        {formErrors.employeeId && (
          <span className="text-sm 2xl:text-base text-red-500 mb-2">
            {formErrors.employeeId}
          </span>
        )}

        <label htmlFor="password" className="text-base font-semibold text-gray-700 dark:text-gray-400 mb-1">
          Password
        </label>
        <div className="relative flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            name="password"
            value={password}
            onChange={handleChange}
            onFocus={() => setFormErrors({ ...formErrors, password: "" })}
            onBlur={() => setFormErrors({ ...formErrors, password: "" })}
            onKeyDown={handleKeyDown}
            id="password"
            className="h-10 w-full text-base p-2 mb-2 text-gray-700 dark:text-white/50 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90"
          />
          <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 cursor-pointer text-gray-500">
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>
        {formErrors.password && (
          <span className="text-sm 2xl:text-base text-red-500 mb-0">
            {formErrors.password}
          </span>
        )}

        <span className="text-sm 2xl:text-base text-[#58AF9B] font-semibold cursor-pointer hover:underline text-right"
          onClick={() => onSwitchForm("forgotPassword")}
        >
          Forgot Password?
        </span>

        <button
          type="submit"
          className="text-base bg-[#58AF9B] text-white font-bold py-2 rounded-lg mt-2 w-full flex justify-center items-center gap-2 transition hover:bg-white dark:hover:bg-black dark:hover:text-white hover:border hover:border-[#58AF9B] hover:text-black dark:border-[0.5px] dark:bg-transparent dark:bg-darkHover dark:border-[#58AF9B] duration-500"
          disabled={isSubmitting}
        >
          <span>Login</span>
          {isSubmitting && <Loader2 className="animate-spin" size={20} />}
        </button>

        {/* <button
          onClick={() =>
            dispatch(
              showSnackBar({
                message: "Test Snackbar Message",
                severity: "error"
              })
            )
          }
        >
          Test Snackbar
        </button> */}

        <p className="text-sm 2xl:text-base text-center mt-4 text-gray-700 dark:text-white/60">
          Don't have an account?{" "}
          <span onClick={() => onSwitchForm("signup")} className="cursor-pointer text-[#58AF9B] font-bold text-sm 2xl:text-base">
            Sign up
          </span>
        </p>
      </form>
    </>
  );
};

export default LoginForm;
