const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepo = require("../repositories/user-repo");

const ACCESS_SECRET = "your_access_secret";
const REFRESH_SECRET = "your_refresh_secret";

// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign({ userId: user._id }, ACCESS_SECRET, { expiresIn: "15m" });
};

// Generate Refresh Token
const generateRefreshToken = async (user) => {
  const refreshToken = jwt.sign({ userId: user._id }, REFRESH_SECRET, {
    expiresIn: "7d",
  });
  await userRepo.saveRefreshToken(user._id, refreshToken);
  return refreshToken;
};

// Register User
const register = async (req, res) => {
  try {
    const { email, password, companyName } = req.body;

    const existingUser = await userRepo.findUserByEmail(email);
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      email,
      password: hashedPassword,
      companyName,
    };

    await userRepo.saveUser(newUser);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userRepo.findUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    res.status(200).json({
      accessToken,
      refreshToken,
      companyName: user.companyName, // Include company name from the user object
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Refresh Token
const refresh = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token)
      return res.status(403).json({ message: "Refresh token is required" });

    const storedToken = await userRepo.findRefreshToken(token);
    if (!storedToken)
      return res.status(403).json({ message: "Invalid refresh token" });

    jwt.verify(token, REFRESH_SECRET, async (err, user) => {
      if (err)
        return res.status(403).json({ message: "Token verification failed" });

      const newAccessToken = generateAccessToken(user);
      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ message: "Error refreshing token", error });
  }
};

// Logout User
const logout = async (req, res) => {
  try {
    const { token } = req.body;
    await userRepo.deleteRefreshToken(token);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out", error });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
};
