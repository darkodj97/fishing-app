import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Profile() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchStats();
  }, [token]);

  const fetchStats = async () => {
    try {
      const response = await axios.get("https://fishing-app-backend-d77r.onrender.com/catches/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const catches = response.data;

      if (catches.length === 0) {
        setStats({ total: 0, biggest: null, favoriteBait: null, favoriteFish: null, catches });
        return;
      }

      const biggest = catches.reduce((a, b) => a.weight_kg > b.weight_kg ? a : b);

      const baitCount = {};
      catches.forEach(c => { baitCount[c.bait] = (baitCount[c.bait] || 0) + 1; });
      const favoriteBait = Object.keys(baitCount).reduce((a, b) => baitCount[a] > baitCount[b] ? a : b);

      const fishCount = {};
      catches.forEach(c => { fishCount[c.fish_type] = (fishCount[c.fish_type] || 0) + 1; });
      const favoriteFish = Object.keys(fishCount).reduce((a, b) => fishCount[a] > fishCount[b] ? a : b);

      setStats({ total: catches.length, biggest, favoriteBait, favoriteFish, catches });
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
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
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">👤 My Profile</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-2xl p-5 text-center">
            <p className="text-4xl font-bold text-blue-400">{stats.total}</p>
            <p className="text-gray-400 mt-1">Total Catches</p>
          </div>
          <div className="bg-gray-800 rounded-2xl p-5 text-center">
            <p className="text-4xl font-bold text-blue-400">
              {stats.biggest ? `${stats.biggest.weight_kg}kg` : "-"}
            </p>
            <p className="text-gray-400 mt-1">Biggest Catch</p>
          </div>
          <div className="bg-gray-800 rounded-2xl p-5 text-center">
            <p className="text-2xl font-bold text-blue-400">
              {stats.favoriteBait || "-"}
            </p>
            <p className="text-gray-400 mt-1">Favorite Bait</p>
          </div>
          <div className="bg-gray-800 rounded-2xl p-5 text-center">
            <p className="text-2xl font-bold text-blue-400">
              {stats.favoriteFish || "-"}
            </p>
            <p className="text-gray-400 mt-1">Favorite Fish</p>
          </div>
        </div>

        {stats.biggest && (
          <div className="bg-gray-800 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">🏆 Biggest Catch</h2>
            <div className="flex items-center gap-6">
              {stats.biggest.image_url && (
                <img
                  src={stats.biggest.image_url}
                  alt={stats.biggest.fish_type}
                  className="w-32 h-32 object-cover rounded-xl"
                />
              )}
              <div>
                <p className="text-2xl font-bold text-white">{stats.biggest.fish_type}</p>
                <p className="text-blue-400 text-xl font-bold">{stats.biggest.weight_kg} kg</p>
                <p className="text-gray-400">🪱 {stats.biggest.bait}</p>
                <p className="text-gray-400">📅 {new Date(stats.biggest.caught_at).toLocaleDateString("en-GB")}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">📊 Catches by Fish Type</h2>
          {Object.entries(
            stats.catches.reduce((acc, c) => {
              acc[c.fish_type] = (acc[c.fish_type] || 0) + 1;
              return acc;
            }, {})
          ).map(([fish, count]) => (
            <div key={fish} className="flex justify-between items-center py-3 border-b border-gray-700 last:border-0">
              <span className="text-white">{fish}</span>
              <span className="text-blue-400 font-bold">{count} catches</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}