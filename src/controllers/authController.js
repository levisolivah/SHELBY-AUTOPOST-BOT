const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({
        message: "User already exists"
      });

    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered",
      user
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

};

// LOGIN
exports.login = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(400).json({
        message: "Invalid credentials"
      });

    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {

      return res.status(400).json({
        message: "Invalid credentials"
      });

    }

    const token = jwt.sign(
      {
        id: user._id
      },
      "SHELBY_SECRET",
      {
        expiresIn: "7d"
      }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

};
