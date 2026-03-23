import { clerkClient, getAuth } from "@clerk/express";

export const requireAuth = (req, res, next) => {
  const auth = getAuth(req);
  
  if (!auth?.userId) {
    console.error("TOKEN EXTRACTION FAILED:", {
      hasAuth: !!auth,
      userId: auth?.userId,
      sessionId: auth?.sessionId,
      hasAuthHeader: !!req.headers.authorization,
    });
    return res.status(401).json({ message: "Not authenticated" });
  }

  next();
};

export const adminOnly = async (req, res, next) => {
  const auth = getAuth(req);

  if (!auth?.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const user = await clerkClient.users.getUser(auth.userId);
    const role = user?.publicMetadata?.role;

    if (role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("CLERK USER FETCH ERROR:", err.message);
    return res.status(500).json({ message: "Authorization error" });
  }
};
