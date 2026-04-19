import api from '../api/axios';

const handleSubmit = async (formData) => {
  try {
    const response = await api.post('/issues', formData);
    setToken(response.data.token);   // Show the token to the citizen
  } catch (error) {
    console.error(error.response.data.message);
  }
};