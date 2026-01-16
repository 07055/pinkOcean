import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./Pages/Auth";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import ProtectedRoute from "./components/ProtectedRoute"; // We need to create this

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Public Route: The Auth page has no Navbar */}
        <Route path="/auth" element={<Auth />} />

        {/* 2. Protected Wrapper: Everything inside here requires a login */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                {/* The 'pt-20' ensures content isn't hidden under the fixed Navbar */}
                <main className="pt-20 min-h-screen bg-background">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    {/* You can add /profile and /settings here later */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;