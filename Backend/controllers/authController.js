
const bcrypt = require("bcryptjs");

const User = require("../models/User")


const signupUser = async (req, res) => {

  console.log(req.body);

  const { name, email, password } = req.body;

  console.log(name);
  console.log(email);
  console.log(password);

  if( !name || !email || !password){
    return res.status(400).json({
      message: "All fields are requireed",
    });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  console.log(hashedPassword);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });



  return res.status(201).json({
    message: "User Registered Successfully",
    user,
  });

};

module.exports = {
  signupUser,
};