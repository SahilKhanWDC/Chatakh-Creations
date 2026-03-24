import { clerkClient, getAuth } from "@clerk/express";

export const requireAuth = (req, res, next) => {
  const auth = getAuth(req);
  
  console.log("🔍 [requireAuth] Middleware Check:", {
    path: req.path,
    method: req.method,
    hasAuthHeader: !!req.headers.authorization,
    authHeaderValue: req.headers.authorization?.slice(0, 50) + "...",
    auth: {
      hasAuth: !!auth,
      userId: auth?.userId,
      sessionId: auth?.sessionId,
      getAuth_result: !!auth, 
    }
  });
  
  if (!auth?.userId) {
    console.error("❌ TOKEN EXTRACTION FAILED for:", req.path);
    console.error("TOKEN EXTRACTION DETAILS:", {
      hasAuth: !!auth,
      userId: auth?.userId,
      sessionId: auth?.sessionId,
      hasAuthHeader: !!req.headers.authorization,
      allHeaders: Object.keys(req.headers),
    });
    return res.status(401).json({ message: "Not authenticated" });
  }

  console.log("✅ Authentication successful for userId:", auth.userId);
  next();
};

export const adminOnly = async (req, res, next) => {
  const auth = getAuth(req);

  if (!auth?.userId) {
    console.error("❌ [adminOnly] User not authenticated");
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const user = await clerkClient.users.getUser(auth.userId);
    const role = user?.publicMetadata?.role;

    console.log("✅ [adminOnly] User found:", {
      userId: auth.userId,
      role: role,
      isAdmin: role === "admin",
    });

    if (role !== "admin") {
      console.warn("❌ [adminOnly] User is not admin - role:", role);
      return res.status(403).json({ message: "Admin access only" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("❌ CLERK USER FETCH ERROR:", err.message);
    return res.status(500).json({ message: "Authorization error" });
  }
};
