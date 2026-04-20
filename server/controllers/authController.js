const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
	try {
		const { fullName, phone, email, password } = req.body;
		if (!fullName || !phone || !email || !password) {
			return res.status(400).json({ message: 'All fields are required.' });
		}

		// Check if phone or email already exists
		const existingUser = await User.findOne({ $or: [{ phone }, { email }] });
		if (existingUser) {
			return res.status(409).json({ message: 'Phone or email already registered.' });
		}

		// Hash password
		const passwordHash = await bcrypt.hash(password, 10);

		// Aadhaar last 4 is required by schema, but not provided here. You may need to adjust this as per your registration form.
		// For now, set a dummy value or handle accordingly.
		const aadhaarLast4 = '0000'; // TODO: Replace with actual value from req.body if available

		const user = new User({
			fullName,
			phone,
			email,
			aadhaarLast4,
			passwordHash
		});
		await user.save();
		return res.status(201).json({ message: 'Registration successful.' });
	} catch (err) {
		return res.status(500).json({ message: 'Server error.', error: err.message });
	}
};

// Login user
exports.login = async (req, res) => {
	try {
		const { phone, email, password } = req.body;
		if ((!phone && !email) || !password) {
			return res.status(400).json({ message: 'Phone/email and password are required.' });
		}

		// Find user by phone or email
		const user = await User.findOne({ $or: [{ phone }, { email }] });
		if (!user) {
			return res.status(401).json({ message: 'Invalid credentials.' });
		}

		// Compare password
		const isMatch = await bcrypt.compare(password, user.passwordHash);
		if (!isMatch) {
			return res.status(401).json({ message: 'Invalid credentials.' });
		}

		// Sign JWT
		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: '7d' }
		);
		return res.json({ token });
	} catch (err) {
		return res.status(500).json({ message: 'Server error.', error: err.message });
	}
};
