import { clerkMiddleware, clerkClient, getAuth } from "@clerk/express";


export const requireAuth = async (req, res, next) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  next();
};

export const adminOnly = async (req, res, next) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    const role = user.publicMetadata?.role;

    if (role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    next();
  } catch (err) {
    console.error("CLERK ADMIN CHECK ERROR:", err);
    return res.status(500).json({ message: "Auth error" });
  }
};
