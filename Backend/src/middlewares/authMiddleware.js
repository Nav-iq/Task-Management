import jwt from "jsonwebtoken";
import ms from "ms";

const authMiddleware = (roles) => {
  return (req, res, next) => {
    // Extract token from headers
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    try {
      // Verify token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET, {
        maxAge: ms("1d"),
      });

      // Check if user role matches required roles
      if (!roles.includes(decodedToken.role)) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // Attach decoded token to request for further processing if needed
      req.user = decodedToken;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: "Token expired" });
      }
      console.error("Error verifying token:", error);
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

export default authMiddleware;
