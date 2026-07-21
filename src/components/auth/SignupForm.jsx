import {
  ArrowForwardRounded,
  LockOutlineRounded,
  MailOutlineOutlined,
  PersonOutlineOutlined,
} from "@mui/icons-material";
import { useState } from "react";

const SignupForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsCheck, setTermsCheck] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Specific error tracking for fields and global requests
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!newPassword) {
      newErrors.password = "Password is required";
    } else if (newPassword.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!termsCheck) {
      newErrors.terms = "You must agree to the Terms of Service and Privacy Policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createAccount = async (e) => {
    e.preventDefault();
    setGlobalError("");
    setErrors({});

    // Validate entries before executing network call
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const fetchData = await fetch(
        "http://localhost:5000/api/auth/signup",
        // "https://backend-mealablev2.onrender.com/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Required to set session cookies on successful sign up
          body: JSON.stringify({
            username: fullName.trim(),
            email: email.trim(),
            password: newPassword,
          }),
        },
      );

      const data = await fetchData.json();

      if (!fetchData.ok) {
        throw new Error(data.message || "Account registration failed");
      }

      // Route smoothly to landing/dashboard or verification
      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
      setGlobalError(error.message || "An expected network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 lg:p-12 flex flex-col justify-center max-w-lg mx-auto w-full">
      <h1 className="text-4xl lg:text-5xl font-bold text-green-900">
        Create Account
      </h1>

      <h3 className="text-green-900 text-md mt-2">
        Join our community and start organizing your healthy life.
      </h3>

      {/* Global Form Response Message */}
      {globalError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
          {globalError}
        </div>
      )}

      <form className="mt-8 space-y-5" onSubmit={createAccount}>
        {/* Full Name Input */}
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-semibold text-gray-700">
            Full Name
          </label>
          <div className="relative bg-green-50">
            <PersonOutlineOutlined
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
              sx={{ fontSize: 22 }}
            />
            <input
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
              }}
              type="text"
              value={fullName}
              disabled={isLoading}
              placeholder="Enter your full name"
              className={`w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:border-green-800 transition-colors ${
                errors.fullName ? "border-red-400 focus:border-red-500" : "border-gray-300"
              }`}
            />
          </div>
          {errors.fullName && (
            <span className="text-xs font-medium text-red-600 pl-1">{errors.fullName}</span>
          )}
        </div>

        {/* Email Address Input */}
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-semibold text-gray-700">
            Email Address
          </label>
          <div className="relative bg-green-50">
            <MailOutlineOutlined
              className="absolute top-1/2 -translate-y-1/2 text-gray-600 left-4"
              sx={{ fontSize: 22 }}
            />
            <input
              type="text"
              value={email}
              disabled={isLoading}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              placeholder="name@example.com"
              className={`w-full border rounded-xl py-3 pl-12 outline-none focus:border-green-800 transition-colors ${
                errors.email ? "border-red-400 focus:border-red-500" : "border-gray-300"
              }`}
            />
          </div>
          {errors.email && (
            <span className="text-xs font-medium text-red-600 pl-1">{errors.email}</span>
          )}
        </div>

        {/* Passwords Layout Area */}
        <div className="flex flex-col md:flex-row gap-5">
          {/* Main Password Input */}
          <div className="flex-1 flex flex-col gap-2">
            <label className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <div className="relative bg-green-50">
              <LockOutlineRounded
                className="absolute top-1/2 -translate-y-1/2 text-gray-600 left-4"
                sx={{ fontSize: 22 }}
              />
              <input
                type="password"
                value={newPassword}
                disabled={isLoading}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                }}
                placeholder="Enter password"
                className={`w-full border rounded-xl py-3 pl-12 outline-none focus:border-green-800 transition-colors ${
                  errors.password ? "border-red-400 focus:border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            {errors.password && (
              <span className="text-xs font-medium text-red-600 pl-1">{errors.password}</span>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="flex-1 flex flex-col gap-2">
            <label className="block text-sm font-semibold text-gray-700">
              Confirm
            </label>
            <div className="relative bg-green-50">
              <LockOutlineRounded
                className="absolute top-1/2 -translate-y-1/2 text-gray-600 left-4"
                sx={{ fontSize: 22 }}
              />
              <input
                type="password"
                value={confirmPassword}
                disabled={isLoading}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }}
                placeholder="Confirm password"
                className={`w-full border rounded-xl py-3 pl-12 outline-none focus:border-green-800 transition-colors ${
                  errors.confirmPassword ? "border-red-400 focus:border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <span className="text-xs font-medium text-red-600 pl-1">{errors.confirmPassword}</span>
            )}
          </div>
        </div>

        {/* Terms Agreement Checkbox Container */}
        <div>
          <div className="flex items-start gap-3 mt-2">
            <input
              type="checkbox"
              checked={termsCheck}
              disabled={isLoading}
              onChange={(e) => {
                setTermsCheck(e.target.checked);
                if (errors.terms) setErrors((prev) => ({ ...prev, terms: "" }));
              }}
              id="terms"
              className="mt-1 h-4 w-4 accent-green-800 cursor-pointer"
            />
            <label
              htmlFor="terms"
              className="text-sm text-gray-600 leading-6 cursor-pointer select-none"
            >
              I agree to the{" "}
              <span className="text-green-800 font-semibold hover:underline">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-green-800 font-semibold hover:underline">
                Privacy Policy
              </span>
              .
            </label>
          </div>
          {errors.terms && (
            <span className="text-xs font-medium text-red-600 pl-1 mt-1 block">{errors.terms}</span>
          )}
        </div>

        {/* Account Creation Action Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
            isLoading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-green-900 hover:bg-green-800 active:scale-[0.99]"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Creating Account...</span>
            </div>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowForwardRounded sx={{ fontSize: 20, color: "white" }} />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{" "}
        <a className="text-green-900 font-bold hover:underline" href="/">
          Login
        </a>
      </p>
    </div>
  );
};

export default SignupForm;