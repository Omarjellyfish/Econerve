import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info to `req`
    next(); // Proceed to the next middleware
  } catch (err) {
    return res.status(403).json({ message: "Invalid or Expired Token" });
  }
}
