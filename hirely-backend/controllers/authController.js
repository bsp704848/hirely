
import User from '../models/User.js'
import bcrypt from 'bcryptjs';

export const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body

  try {
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const newUser = await User.create({ username, email, password, role })

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;

      console.log('Received login request:', req.body)
      
      if (!email?.trim() || !password?.trim()) {
        return res.status(400).json({ message: 'Email and password are required' })
    }
    
  
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  
      return res.status(200).json({ message: 'Login success', user });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  };
