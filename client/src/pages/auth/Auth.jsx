import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import apiClient from "../apiClient";
import { useUser } from "../../context/UserContextApi";

const Auth = ({ type }) => {
  const { updateUser } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "male",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === "signup" && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const endpoint = type === "signup" ? "/auth/signup" : "/auth/login";
      const response = await apiClient.post(endpoint, formData);
      toast.success(response.data.message || "Success!");
      if (type === "signup") {
        navigate("/login");
      }
      if (type === "login") {
        updateUser(response.data);
        //   localStorage.setItem('userData', JSON.stringify(response.data));
        // Save token in cookies
        const date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 30 days
        const expires = "expires=" + date.toUTCString();
        document.cookie = `jwt=${response.data.token}; path=/; ${expires}`;
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-800 text-white">
      <div className="bg-white text-gray-900 p-8 rounded-lg shadow-white shadow-2xl w-full max-w-md m-2">
        <h2 className="text-3xl font-extrabold text-center mb-6">
          {type === "signup" ? "SignUp" : "Login"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "signup" && (
            <>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-purple-500 text-sm" />
                </div>
                <input
                  type="text"
                  name="fullname"
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-purple-500 text-sm" />
                </div>
                <input
                  type="text"
                  name="username"
                  placeholder="Username (e.g., Jondo99)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-purple-500 text-sm" />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-purple-500 text-sm" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <FaEyeSlash className="text-gray-400 hover:text-purple-500 transition-colors" />
              ) : (
                <FaEye className="text-gray-400 hover:text-purple-500 transition-colors" />
              )}
            </button>
          </div>

          {type === "signup" && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-purple-500 text-sm" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="text-gray-400 hover:text-purple-500 transition-colors" />
                ) : (
                  <FaEye className="text-gray-400 hover:text-purple-500 transition-colors" />
                )}
              </button>
            </div>
          )}

          {type === "signup" && (
            <div className="flex items-center space-x-6 p-2">
              <p className="text-sm text-gray-600">Gender:</p>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleChange}
                  className="text-purple-500 focus:ring-purple-500"
                />
                <span>Male</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleChange}
                  className="text-purple-500 focus:ring-purple-500"
                />
                <span>Female</span>
              </label>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-purple-500 text-white py-2 rounded-lg hover:opacity-90 transition duration-300"
            disabled={loading}
          >
            {loading ? "Loading..." : type === "signup" ? "Sign Up" : "Login"}
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          {type === "signup" ? (
            <>
              Already have an account?{" "}
              <Link to="/login">
                <span className="underline text-purple-500">Login</span>
              </Link>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <Link to="/signup">
                <span className="underline text-purple-500">Register</span>
              </Link>
            </>
          )}
        </p>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default Auth;
