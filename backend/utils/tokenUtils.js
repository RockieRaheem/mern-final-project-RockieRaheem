import jwt from "jsonwebtoken";

// Generate JWT Token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Generate Refresh Token
export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "30d",
  });
};

// Send token response
export const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).cookie("refreshToken", refreshToken, options).json({
    success: true,
    token,
    refreshToken,
    user,
  });
};
