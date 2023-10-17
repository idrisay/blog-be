const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
let SECRET = process.env.SECRET;

router.post("/update", async (req, res) => {
  const { access_token } = req.body;

  // Verify the access_token using the SECRET
  try {
    const decoded = jwt.verify(access_token, SECRET);

    // Find the user by their userId from the decoded token
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // You can update user properties here as needed.
    // For example, to update firstName and lastName:
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;

    // Save the updated user
    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: user.email,
      isAdmin: user?.isAdmin,
      id: user?.id,
    });
  } catch (error) {
    // Handle the JWT verification error here
    return res
      .status(401)
      .json({ message: "Invalid signature", error: error.message });
  }
});

module.exports = router;
