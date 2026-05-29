import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CatchCard from "../components/CatchCard";
import axios from "axios";

export default function Dashboard() {
  const [catches, setCatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchCatches();
  }, [token]);

  const fetchCatches = async () => {
    try {
      const response = await axios.get("https://fishing-app-backend-d77r.onrender.com/catches/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCatches(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setCatches(catches.filter((c) => c.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Catches</h1>
          <button
            onClick={() => navigate("/add-catch")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
          >
            + Add Catch
          </button>
        </div>
        {catches.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-8xl">🎣</span>
            <p className="text-gray-400 text-xl mt-4">No catches yet.</p>
            <button
              onClick={() => navigate("/add-catch")}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-200"
            >
              Add your first catch
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {catches.map((c) => (
              <CatchCard key={c.id} catch={c} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}