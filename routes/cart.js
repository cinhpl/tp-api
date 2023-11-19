const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { Product } = require('../models');
const { Order } = require('../models');
const { ProductOrder } = require('../models');

// Import authentification middleware
const auth = require('../middlewares/authentification');

// Manage shopping cart //

// Get shopping cart
router.get('/', async function (req, res) {
  try {
    // Get token associated to shopping cart
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(' ')[1];

    // Get shopping cart
    const cart = req.cookies.cart;
    if (cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    res.status(200).json({ cart: cart });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
  }
});

// Add product to cart by customer
router.post('/add/:id', auth, async function (req, res) {
  try {
    const productId = req.params.id;
    const { quantity } = req.body;
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if stock are available
    if (quantity > product.stocks) {
      return res.status(400).json({ message: "Requested quantity exceeds available stock" });
    }
       
    // Get shopping cart
    let cart = req.cookies.cart || [];

    // Check if product already in cart
    const existingProduct = cart.find(item => item.productId === productId);
    if (existingProduct) {
      return res.status(400).json({ message: "Product already in shopping cart" });
    }
        
    const cartItem = {
      productId: productId,
      quantity: quantity,
      price: product.price
    };

    cart.push(cartItem);

    // Set cookie time in headers 
    const maxAge = req.headers['user-agent'] === 'Store' ? 3600000 : 2592000000; 
    res.cookie('cart', cart, { maxAge: maxAge }); 
    
    const response = {
        success: true,
        message: "Product added to cart successfully",
        cartItem: cartItem
    };
    res.status(201).json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
});

// Put to modify quantity
router.put('/update/:id', auth, async function (req, res) {
  try {
    const productId = req.params.id;
    const { quantity } = req.body;

    // Get shopping cart
    let cart = req.cookies.cart || [];

    // Get product in shopping cart
    const cartProduct = cart.find(product => product.productId === productId);

     if (!cartProduct) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Check if stock are available
    const product = await Product.findByPk(productId);
    if (quantity > product.stocks) {
      return res.status(400).json({ message: "Requested quantity exceeds available stock" });
    }

    // Update quantity
    cartProduct.quantity = quantity;

    // Update cookies
    const maxAge = req.headers['user-agent'] === 'Store' ? 3600000 : 2592000000;
    res.cookie('cart', cart, { maxAge: maxAge });
    res.status(200).json({ cart: cart });

  } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
  }
});

// Delete product from cart
router.delete('/delete/:id', auth, async function (req, res) {
  try {
    const productId = req.params.id;

    // Get shopping cart
    let cart = req.cookies.cart || [];

    // Get product in shopping cart
    const cartProduct = cart.find(product => product.productId === productId);

    if (!cartProduct) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Delete product from cart
    cart.splice(cartProduct, 1);

    // Update cookies
    const maxAge = req.headers['user-agent'] === 'Store' ? 3600000 : 2592000000;
    res.cookie('cart', cart, { maxAge: maxAge });
    res.status(200).json({ cart: cart });

  } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
  }
});

// Manage orders //

// Confirm shopping cart and create order
router.post('/checkout', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken;
  
    const cart = req.cookies.cart || [];
  
    // Sum total amount of shopping cart
    let totalAmount = 0;
    for (const item of cart) {
      const product = await Product.findByPk(item.productId);
      totalAmount += item.quantity * product.price;
    }
  
    if (cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
  
    // Create order associated to user
    const order = await Order.create({
      totalAmount: totalAmount,
      userId: userId
    });
  
    // Associate products to order 
    for (const item of cart) {
      const product = await Product.findByPk(item.productId);
      await ProductOrder.create({
        quantity: item.quantity,
        price: product.price,
        OrderId: order.id,
        ProductId: product.id,
      });
  
      // Update stocks of product
      product.stock -= item.quantity;
      await product.save();
    }
  
    // Clear cookies
    res.clearCookie('cart');
    res.status(201).json({ order });

  } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
});

  // Get all orders
  router.get('/orders', async (req, res) => {
    try {
      // Get orders with associate product
      const orders = await Order.findAll({
        include: {
          model: Product,
          through: 'ProductOrder',
          as: 'Products'
        },
      });
      res.status(200).json({ orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
  });

module.exports = router;
