// Add this to frontend/src/pages/AdminDashboard.jsx top of component for debugging

// Temporary debugging - Add this right after the imports to diagnose the issue
export const DEBUG_AdminAuth = async () => {
  const { getToken } = useAuth();
  
  console.group("🔍 ADMIN AUTHENTICATION DEBUG");
  
  try {
    // 1. Check Clerk token
    const token = await getToken();
    console.log("1. Clerk Token obtained:", {
      exists: !!token,
      length: token?.length,
      prefix: token?.slice(0, 20) + "...",
    });

    // 2. Check API base URL
    const baseURL = import.meta.env.VITE_API_URL || window.location.origin;
    console.log("2. API Base URL:", baseURL);

    // 3. Test unauthenticated request
    console.log("3. Testing unauthenticated GET /api/products...");
    try {
      const res1 = await fetch(`${baseURL}/api/products`);
      console.log("   Response status:", res1.status);
      const data1 = await res1.json();
      console.log("   Works without auth:", res1.ok, "Data count:", data1.length);
    } catch (e) {
      console.error("   Error:", e.message);
    }

    // 4. Test authenticated request
    console.log("4. Testing authenticated GET /api/orders with Bearer token...");
    try {
      const res2 = await fetch(`${baseURL}/api/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      console.log("   Response status:", res2.status);
      const data2 = await res2.json();
      console.log("   Orders fetched:", res2.ok);
      if (!res2.ok) {
        console.error("   Error message:", data2.message);
      }
    } catch (e) {
      console.error("   Error:", e.message);
    }

    // 5. Check if interceptor logged token
    console.log("5. Interceptor should have logged token injection above ☝️");

  } catch (err) {
    console.error("Debug error:", err);
  }
  
  console.groupEnd();
};

// Call this from useEffect or a debug button:
// useEffect(() => {
//   const timer = setTimeout(() => {
//     DEBUG_AdminAuth();
//   }, 2000);
//   return () => clearTimeout(timer);
// }, []);
