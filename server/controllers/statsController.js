// controllers/statsController.js
const { getDepartmentScore } = require('../utils/scoreCalculator');

const DEPARTMENTS = ['Roads', 'Water', 'Sanitation', 'Electricity', 'Health', 'Education'];

const getStats = async (req, res) => {
  try {
    const scores = await Promise.all(
      DEPARTMENTS.map(async (dept) => ({
        department: dept,
        score: await getDepartmentScore(dept),
      }))
    );
    res.json({ success: true, scores });
  } catch (error) {
    console.error('Error computing stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getStats };
