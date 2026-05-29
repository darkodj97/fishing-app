import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const FISH_TYPES = ["Carp", "Catfish", "Pike", "Perch", "Chub", "Ide"];

export default function Leaderboard() {
  const [fishType, setFishType] = useState("Carp");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    fetchLeaderboard();
  }, [fishType, year, month]);

  const fetchLeaderboard = async () => {
    if (!fishType) return;
    setLoading(true);
    try {
      const response = await axios.get("https://fishing-app-backend-d77r.onrender.com/leaderboard/", {
        params: { fish_type: fishType, period: "monthly", year, month },
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(response.data);
    } catch (err) {
      console.error("Error loading leaderboard");
    } finally {
      setLoading(false);
    }
  };

  const medals = ["🥇", "🥈", "🥉", "4.", "5."];
  const medalColors = [
    "border-yellow-500",
    "border-gray-400",
    "border-amber-600",
    "border-gray-600",
    "border-gray-600",
  ];

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">🏆 Leaderboard</h1>

        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Fish Type</label>
            <div className="flex gap-2 flex-wrap">
              {FISH_TYPES.map((fish) => (
                <button
                  key={fish}
                  onClick={() => setFishType(fish)}
                  className={`px-4 py-2 rounded-full font-semibold transition duration-200 ${
                    fishType === fish
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {fish}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <label className="block text-gray-400 mb-2">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
              >
                {months.map((m, i) => (
                  <option key={i + 1} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-gray-400 mb-2">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-10">
            <p className="text-white text-xl">Loading...</p>
          </div>
        )}

        {!loading && results.length === 0 && (
          <div className="text-center py-10">
            <span className="text-6xl">🎣</span>
            <p className="text-gray-400 text-xl mt-4">No catches for this period.</p>
          </div>
        )}

        <div className="space-y-4">
          {results.map((r) => (
            <div
              key={r.rank}
              className={`bg-gray-800 rounded-2xl p-5 border-2 ${medalColors[r.rank - 1]} flex items-center gap-4`}
            >
              <span className="text-3xl w-10 text-center">{medals[r.rank - 1]}</span>
              <div className="flex-1">
                <p className="text-white font-bold text-lg">{r.username}</p>
                <p className="text-gray-400 text-sm">{r.total_catches} catches</p>
              </div>
              <div className="text-right">
                <p className="text-blue-400 font-bold text-xl">{r.biggest_catch_kg} kg</p>
                <p className="text-gray-400 text-sm">biggest catch</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}