import { clerkMiddleware, clerkClient, getAuth } from "@clerk/express";

export const requireAuth = (req, res, next) => {
  try {
    const auth = getAuth(req);
    const { userId, sessionId } = auth;

    if (!userId) {
      console.warn("AUTH MISSING:", {
        authKeys: Object.keys(auth),
        hasAuth: !!auth,
        headerAuth: !!req.headers.authorization,
      });
      return res.status(401).json({ message: "Not authenticated" });
    }

    req.auth = { userId, sessionId };
    next();
  } catch (err) {
    console.error("REQUIRE AUTH ERROR:", err.message);
    return res.status(401).json({ message: "Authentication error" });
  }
};

export const adminOnly = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await clerkClient.users.getUser(userId);
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    const role = user.publicMetadata?.role;

    if (role !== "admin") {
      console.warn("NON-ADMIN ACCESS ATTEMPT:", { userId, role });
      return res.status(403).json({ message: "Admin access only" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("ADMIN CHECK ERROR:", err.message);
    return res.status(500).json({ message: "Authorization error" });
  }
};
