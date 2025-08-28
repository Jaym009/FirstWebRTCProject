import e from "express";
import User from "../models/User.js";
import jwtToken from "../utils/jwtToken.js";

export const Register = async (req, res) => {
  try {
    const { fullname, username, email, password, profilePic, gender } =
      req.body;

    // Registration logic here (e.g., save user to database)
    if (!fullname || !username || !email || !gender) {
      return res.status(400).send("All fields are required");
    }

    if (password.length < 6) {
      return res
        .status(400)
        .send("Password must be at least 6 characters long");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).send("Please enter a valid email address");
    }

    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).send("User already exists with this username");
    }

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).send("Email is already registered");
    }

    const randomAvatar =
      gender == "male"
        ? `https://avatar.iran.liara.run/public/boy?username=${username}`
        : `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = await User.create({
      fullname,
      username,
      email,
      password,
      gender,
      profilePic: profilePic || randomAvatar,
    });

    if (!newUser) {
      return res.status(500).send("Failed to create user");
    }

    // const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
    //   expiresIn: "7d",
    // });

    // res.cookie("token", token, {
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    //   httpOnly: true,
    //   sameSite: "strict",
    //   secure: process.env.NODE_ENV === "production",
    // });

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      success: true,
    });
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found with this email");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).send("Invalid email or password");
    }

    const token = jwtToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      message: "Login successful",
      success: true,
      token,
      fullname: user.fullname,
      username: user.username,
      profilePic: user.profilePic,
      email: user.email,
    });
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
};

export const Logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
};
