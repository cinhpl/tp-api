const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var express = require('express');
var router = express.Router();

const { User } = require('../models/index');

router.post('/signup', async function(req, res) {
  const { email, password, address, isAdmin } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password empty" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    let user;
    if (isAdmin) {
      user = await User.create({
        email: email,
        password: hash,
        isAdmin: true
      })
    } else {
       user = await User.create({
        email: email,
        password: hash,
        address: address
      });
    }

    res.status(201).json({
      status: "Success",
      data: {
        user,
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
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(401).json({ error: "Email or password invalid" });
    }
    const validation = await bcrypt.compare(password, user.password);
    if (!validation) {
      return res.status(401).json({ error: "Email or password invalid" });
    }
    const token = jwt.sign({ email: user.email, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({ message: "Success", token: token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

