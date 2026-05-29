import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const FISH_TYPES = ["Carp", "Catfish", "Pike", "Perch", "Chub", "Ide"];

const getLocalDatetime = () => {
  return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

export default function EditCatch() {
  const [fishType, setFishType] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [bait, setBait] = useState("");
  const [caughtAt, setCaughtAt] = useState("");
  const [note, setNote] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchCatch();
  }, []);

  const fetchCatch = async () => {
    try {
      const response = await axios.get(`https://fishing-app-backend-d77r.onrender.com/catches/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const c = response.data;
      setFishType(c.fish_type);
      setWeightKg(c.weight_kg);
      setBait(c.bait);
      setCaughtAt(new Date(c.caught_at).toISOString().slice(0, 16));
      setNote(c.note || "");
      setPreview(c.image_url || null);
    } catch (err) {
      setError("Error loading catch");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("fish_type", fishType);
      formData.append("weight_kg", weightKg);
      formData.append("bait", bait);
      formData.append("caught_at", new Date(caughtAt).toISOString());
      if (note) formData.append("note", note);
      if (image) formData.append("image", image);

      await axios.put(`https://fishing-app-backend-d77r.onrender.com/catches/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard");
    } catch (err) {
      setError("Error updating catch");
      setSubmitting(false);
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
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Edit Catch</h1>
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-400 mb-2">Photo</label>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mb-4 w-full h-64 object-cover rounded-lg"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Fish Type</label>
            <select
              value={fishType}
              onChange={(e) => setFishType(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">-- Select fish type --</option>
              {FISH_TYPES.map((fish) => (
                <option key={fish} value={fish}>{fish}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Bait</label>
            <input
              type="text"
              value={bait}
              onChange={(e) => setBait(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Date & Time</label>
            <input
              type="datetime-local"
              value={caughtAt}
              max={getLocalDatetime()}
              onChange={(e) => setCaughtAt(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 h-24 resize-none"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition duration-200"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}