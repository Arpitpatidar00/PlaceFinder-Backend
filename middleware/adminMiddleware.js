const protectAdminRoute = async (req, res, next) => {
  const { token } = req.params; // Extract the token from URL params

  if (!token) {
      return res.status(401).json({ message: "No token provided." });
  }

  try {
      const envToken = process.env.SECRET_ADMIN;

      if (envToken === token) {
          // If valid, add role and verified status to request object
          req.role = "admin"; // Assign the role as "admin"

          req.verified = true;
          return next(); // Proceed to the next middleware
      } else {
          return res.status(401).json({ message: "Invalid token or token verification failed." });
      }
  } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(500).json({ message: "Internal server error." });
  }
};

export default protectAdminRoute;

  