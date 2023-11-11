const express = require('express');
const router = express.Router();
const { Tags } = require('../models');
const { Op } = require('sequelize');

// Importation d'un modèle Sequelize dans une vue.
// Par défaut, require ira chercher le fichier index.js
const { Product } = require('../models');

const authHeader = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  };

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: product } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, product, totalPages, currentPage };
  };

// Get all products
router.get('/', async function(req, res){
    // Manage product per page and filter by category(tags)
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
            const response = getPagingData(data, page, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving products."
            });
        });
});

// Get product by ID
router.get('/:id', async function (req, res) {
    const id = req.params.id;
    try {
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
            res.send(product);
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error })
    }
});

// Add product
router.post('/', authHeader, authorize, async function (req, res) {
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

        const response = {
            success: true,
            data: product,
            message: "Product added successfully",
        };

        res.status(201).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update product
router.patch('/:id', authHeader, authorize, async function(req, res) {
    try {
      const id = req.params.id;
      const update = req.body; 
  
      Product.findByPk(id)
        .then(product => {
          if (!product) {
            return res.status(404).send({
              message: "Can't find product"
            });
          }
  
          return product.update(update);
        })
        .then(updateProduct => {
          res.send(updateProduct);
        })
        .catch(err => {
          res.status(500).send({
            message: "Unable to update product"
          });
        });
    } catch(error) {
      res.status(500).json({message: "Internal Server Error"});
    }
  });

// Delete product
router.delete('/:id', authHeader, authorize, async function (req, res) {
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