import User from "../models/User.js";
import jwt from "jsonwebtoken"

const isLogin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).send({ message: "Unauthorized", success: false });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res
        .status(401)
        .send({ message: "Unauthorized - Invalid Token", success: false });
    }

    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      return res
        .status(401)
        .send({ message: "Unauthorized - User Not Found", success: false });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
};

export default isLogin;
