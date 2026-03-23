import { clerkMiddleware, clerkClient, getAuth } from "@clerk/express";

export const requireAuth = (req, res, next) => {
  try {
    const { userId, sessionId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    req.auth = { userId, sessionId };
    next();
  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    return res.status(401).json({ message: "Authentication failed" });
  }
};

export const adminOnly = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await clerkClient.users.getUser(userId);
    const role = user.publicMetadata?.role;

    if (role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    next();
  } catch (err) {
    console.error("ADMIN CHECK ERROR:", err.message);
    return res.status(500).json({ message: "Auth error" });
  }
};
