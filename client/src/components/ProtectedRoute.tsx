import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProtectedRoute() {
  const token = useAuthStore((state) => state.token);

  // If no token exists, redirect to the Auth page
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // If token exists, render the "children" (the rest of the app)
  return <Outlet />;
}