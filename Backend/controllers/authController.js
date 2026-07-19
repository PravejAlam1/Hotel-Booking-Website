

const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");
const User = require("../models/User");

const signupUser = async (req, res) => {
  try {
    console.log(req.body);

    const { name, email, password } = req.body;

    console.log(name);
    console.log(email);
    console.log(password);

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check Existing User
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(hashedPassword);

    // Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Success Response
    return res.status(201).json({
      message: "User Registered Successfully",
      user,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    const token = jwt.sign(
      {id: user._id},
      process.env.JWT_SECRET,
      {expiresIn: "1d"}
    );

    return res.status(200).json({
      message: "Login Successful",
      token,
    });

    

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  signupUser,
  loginUser,
};