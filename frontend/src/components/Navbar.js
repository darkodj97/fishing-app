import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center gap-2 text-white font-bold text-xl no-underline">
          <span className="text-2xl">🎣</span>
          <span>Fishing App</span>
        </Link>
        {user && (
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-gray-300 hover:text-white transition duration-200 no-underline">
              My Catches
            </Link>
            <Link to="/add-catch" className="text-gray-300 hover:text-white transition duration-200 no-underline">
              Add Catch
            </Link>
            <Link to="/leaderboard" className="text-gray-300 hover:text-white transition duration-200 no-underline">
              Leaderboard
            </Link>
            <Link to="/profile" className="text-gray-300 hover:text-white transition duration-200 no-underline">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}