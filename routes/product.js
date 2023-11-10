const express = require('express');
const router = express.Router();
const { Tags } = require('../models');

// Importation d'un modèle Sequelize dans une vue.
// Par défaut, require ira chercher le fichier index.js
const { Product } = require('../models');

// Get all products
router.get('/', async function(req, res){
    try {
        const products = await Product.findAll({
            include: { 
                model: Tags,
                through: 'ProductsTags',
                as: 'tags'
            }
        });
        if (products.length > 0) {
             res.status(200).json({ message: "Success", data: products });
        } else {
            res.status(404).json({ message: "Products not Found"});
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
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
router.post('/', async function (req, res) {
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
            if (!tagId) {
                res.status(500).json({ message: "Tag not find" })
            } 
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
router.patch('/:id', async function(req, res) {
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
router.delete('/:id', async function (req, res) {
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