import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddCatch from "./pages/AddCatch";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import EditCatch from "./pages/EditCatch";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-gray-900 min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-catch" element={<AddCatch />} />
            <Route path="/edit-catch/:id" element={<EditCatch />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;