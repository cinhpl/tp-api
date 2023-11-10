const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var express = require('express');
var router = express.Router();

const { Admin } = require('../models/index');

router.post('/signup', async function(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password empty" });
  }

  try {
    console.log("Before hashing");
    const hash = await bcrypt.hash(password, 10);
    console.log("After hashing, before Admin.create");
    const admin = await Admin.create({
      email: email,
      password: hash,
    });
    console.log("After Admin.create");

    res.status(201).json({
      status: "Success",
      data: {
        admin,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error" });
  }
});


router.post('/login', async function(req, res) {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({
      where: {
        email: email,
      },
    });
    if (!admin) {
      return res.status(401).json({ error: "Email or password invalid" });
    }
    const validation = await bcrypt.compare(password, admin.password);
    if (!validation) {
      return res.status(401).json({ error: "Email or password invalid" });
    }
    const token = jwt.sign({ email: admin.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(200).json({ message: "Success", token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
  
module.exports = router;