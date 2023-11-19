const express = require('express');
const router = express.Router();

const { Tags } = require('../models');
const { Op } = require('sequelize');
const { Product } = require('../models');

// Import authentification middleware
const auth = require('../middlewares/authentification');
const validAdmin = require('../middlewares/validAdmin');

// Manage pagination and limit
const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  };

const getDatas = (data, page, limit) => {
    const { 
        count: totalItems, 
        rows: product 
    } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, product, totalPages, currentPage };
  };

  let countRequest = {};

  // Get all products
router.get('/', async function(req, res){
    // Manage product per page and filter by category
    const { page, size, tags } = req.query;
    // Operator from sequelize
    var condition = {
        ...(tags ? { '$tags.tag$': { [Op.like]: `%${tags}%` } } : null),
        stocks: {
            [Op.not]: 0
        }
    };
  
    const { limit, offset } = getPagination(page, size);
  
    // findAndCountAll to find products and get pagination
    Product.findAndCountAll({ 
        where: 
            condition, 
            limit, 
            offset,
        include: {
            model: Tags,
            through: 'ProductTags',
            as: 'tags'
        }
    })
    .then(data => {
        // Sort product by most requested
        data.rows.sort((a, b) => (countRequest[b.id] || 0) - (countRequest[a.id] || 0 ));
        const response = getDatas(data, page, limit);
        res.send(response);
    })
    .catch(error => {
        res.status(500).json({ message: error });
    });
});
  
  // Get product by ID
router.get('/:id', async function (req, res) {
    // Get params id 
    const id = req.params.id;
    try {
        // Find product by id and include array of tags
        const product = await Product.findOne({
            where: {
                id
            },
            include: { 
                model: Tags,
                through: 'ProductsTags',
                as: 'tags'
            }
        });
        if (!product) {
            res.status(404).json({ message: "Product not Found" });
        } else {
            // Count number of request
            countRequest[id] = (countRequest[id] || 0) + 1;
            res.send(product);
          }
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

// Add product in db
router.post('/', auth, validAdmin, async function (req, res) {
    try {
        const { name, price, description, stocks, tagId } = req.body;

        const product = await Product.create({
            name: name,
            price: price,
            description: description,
            stocks: stocks,
        });

        // Find and add multiple tags in array
        if (tagId && tagId.length > 0) {
            const tags = await Tags.findAll({
                where: {
                    id: tagId,
                },
            });
            await product.addTags(tags);
        }
        res.status(201).json({product, message: "Product added successfully" }); 
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update product
router.patch('/:id', auth, validAdmin, async function(req, res) {
    try {
        const id = req.params.id;
        const update = req.body; 
  
    Product.findByPk(id)
        .then(product => {
            if (!product) {
                return res.status(404).send({
                message: "Product not found"
            });
            }
            return product.update(update);
        })
        .then(updateProduct => {
            res.send(updateProduct);
        })
        .catch(err => {
            res.status(500).send({ message: "Unable to update product" });
        });
    } catch(error) {
        res.status(500).json({message: "Internal Server Error"});
    }
});

// Delete product from db
router.delete('/:id', auth, validAdmin, async function (req, res) {
    const id = req.params.id;
    try {
        const product = await Product.destroy({
            where: {
                id
            }
        });
        if (product === 0) {
            res.status(404).json({ message: "Product Not Found" });
          } else {
            res.send('Product deleted successfuly');
          }
    } catch (error) {
        res.status(500).json({ message: "Unable to delete product"})
    }
});

module.exports = router;