import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const FISH_TYPES = ["Carp", "Catfish", "Pike", "Perch", "Chub", "Ide"];

const getLocalDatetime = () => {
  return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

export default function AddCatch() {
  const [fishType, setFishType] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [bait, setBait] = useState("");
  const [caughtAt, setCaughtAt] = useState("");
  const [note, setNote] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [identifying, setIdentifying] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const identifyFish = async (file) => {
    setIdentifying(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.post(
        "https://fishing-app-backend-d77r.onrender.com/catches/identify-fish",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFishType(response.data.fish_type);
    } catch (err) {
      console.error("Could not identify fish");
    } finally {
      setIdentifying(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      identifyFish(file);
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

      await axios.post("https://fishing-app-backend-d77r.onrender.com/catches/", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard");
    } catch (err) {
      setError("Error adding catch");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Add Catch</h1>
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-400 mb-2">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 w-full h-64 object-cover rounded-lg"
              />
            )}
            {identifying && (
              <div className="mt-3 flex items-center gap-2 text-blue-400">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                <span>Identifying fish...</span>
              </div>
            )}
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
              placeholder="e.g. 3.5"
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
              placeholder="e.g. Corn"
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
              placeholder="Notes about your catch..."
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
              {submitting ? "Saving..." : "Save Catch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}