import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  const currentUserId = req.user.id;
  if (!currentUserId) {
    return res.status(400).send("User ID is required");
  }
  try {
    const users = await User.find(
      { _id: { $ne: currentUserId } },
      "profilePic email username"
    );
    res.status(200).json({
      users,
      message: "Users fetched successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
};
