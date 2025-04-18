const User = require("../models/User-model");
const RefreshToken = require("../models/Refresh-token-model");

// Fetch user by email
const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// Save new user
const saveUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

// Save refresh token
const saveRefreshToken = async (userId, token) => {
  return await RefreshToken.create({
    userId,
    token,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });
};

// Find refresh token
const findRefreshToken = async (token) => {
  return await RefreshToken.findOne({ token });
};

// Delete refresh token
const deleteRefreshToken = async (token) => {
  return await RefreshToken.deleteOne({ token });
};

module.exports = {
  findUserByEmail,
  saveUser,
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
};
