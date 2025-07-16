const jwt = require("jsonwebtoken");
const User = require("../Models/Users");
const bcryptjs = require("bcryptjs");
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || (await bcryptjs.compare(password, user.password)) === false) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.status(200).json({ token, userID: user._id });
};
const register = async (req, res) => {
  const { name, email, password } = req.body;
  const availableuser = await User.findOne({ email });
  if (availableuser) {
    return res.status(400).json({ message: "Email already exists" });
  }
  const hashpassword = await bcryptjs.hash(password, 10);
  const newuser = new User({
    name,
    email,
    password: hashpassword,
  });
  await newuser.save();
  const token = jwt.sign({ userID: newuser._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.status(201).json({ token, userID: newuser._id });
};
module.exports = { login, register };
