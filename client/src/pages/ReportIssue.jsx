import { useState } from 'react';
import api from '../api/axios';

export default function ReportIssue() {
  // Move state inside the component
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    department: '',
    location: '',
    photoUrl: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/issues', formData);
      // Assuming the API returns a tracking token or ID
      setToken(res.data.token || 'Success'); 
      alert('Issue reported successfully!');
      setFormData({ description: '', department: '', location: '', photoUrl: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Report an Issue</h2>
      
      {error && <p className="text-red-500">{error}</p>}
      {token && <p className="text-green-600">Issue submitted! Token: {token}</p>}

      {/* The form must wrap all inputs and the button */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          required
          type="text"
          name="description"
          placeholder="Describe the issue"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2"
        />

        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full border p-2"
          required
        >
          <option value="">Select Department</option>
          <option value="Roads">Roads</option>
          <option value="Water">Water</option>
        </select>

        <input
          type="text"
          name="location"
          placeholder="Enter location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />

        <input
          type="text"
          name="photoUrl"
          placeholder="Paste photo URL"
          value={formData.photoUrl}
          onChange={handleChange}
          className="w-full border p-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 w-full"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}