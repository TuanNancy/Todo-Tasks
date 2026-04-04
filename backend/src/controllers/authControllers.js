import jwt from "jsonwebtoken";
import User from "../../models/User.js";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const setCookie = (res, token) => {
  const maxAge = process.env.COOKIE_MAX_AGE
    ? parseInt(process.env.COOKIE_MAX_AGE)
    : 7 * 24 * 60 * 60 * 1000;

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge,
    path: "/",
  });
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email
            ? "Email đã được sử dụng"
            : "Username đã tồn tại",
      });
    }

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);
    setCookie(res, token);

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in register:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Username hoặc email đã tồn tại" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }

    const token = generateToken(user._id);
    setCookie(res, token);

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.status(200).json({ message: "Đăng xuất thành công" });
};

export const getMe = async (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
    },
  });
};
