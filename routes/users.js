const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var express = require('express');
var router = express.Router();

const auth = require('../middlewares/authentification');

const { User } = require('../models/index');

// Create user or admin
router.post('/signup', async function(req, res) {
  const { email, password, address, isAdmin } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password empty" });
  }
  try {
    const hash = await bcrypt.hash(password, 10);

    // Create customer or admin
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
        user
      }
    });
  } catch (error) {
    //console.error(error);
    res.status(500).json({ message: error });
  }
});

// Login customer or admin
router.post('/login', async function(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    // Check if user exist
    if (!user) {
      return res.status(401).json({ error: "Email or password invalid" });
    }
    // Check if password is valid
    const validation = await bcrypt.compare(password, user.password);
    if (!validation) {
      return res.status(401).json({ error: "Email or password invalid" });
    }
    // JWT token is valid 24h
    const token = jwt.sign({ email: user.email, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(200).json({ message: "Success", token: token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all users by admin
router.get('/', auth, async function(req, res) {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch(error) {
    //console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get user by ID 
router.get('/:id', async function (req, res) {
  const id = req.params.id;
  try {
      const user = await User.findOne({
          where: {
              id
          },
      });
      if (!user) {
          res.status(404).json({ message: "User not Found" });

      } else {
          res.send(user);
      }
  } catch (error) {
      //console.log(error)
      res.status(500).json({ message: error })
  }
});

module.exports = router;

