import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CatchCard({ catch: fishCatch, onDelete }) {
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this catch?")) return;
    try {
      await axios.delete(`https://fishing-app-backend-d77r.onrender.com/catches/${fishCatch.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDelete(fishCatch.id);
    } catch (err) {
      console.error("Error deleting catch");
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-200">
      {fishCatch.image_url && (
        <img
          src={fishCatch.image_url}
          alt={fishCatch.fish_type}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-white">{fishCatch.fish_type}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/edit-catch/${fishCatch.id}`)}
              className="text-gray-500 hover:text-blue-400 transition duration-200 text-xl"
              title="Edit catch"
            >
              ✏️
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-500 hover:text-red-500 transition duration-200 text-xl"
              title="Delete catch"
            >
              🗑️
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-300">
            <span>⚖️</span>
            <span>{fishCatch.weight_kg} kg</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <span>🪱</span>
            <span>{fishCatch.bait}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <span>📅</span>
            <span>{new Date(fishCatch.caught_at).toLocaleDateString("en-GB")}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <span>🕐</span>
            <span>{new Date(fishCatch.caught_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
          {fishCatch.note && (
            <div className="flex items-center gap-2 text-gray-400 italic">
              <span>💬</span>
              <span>{fishCatch.note}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}