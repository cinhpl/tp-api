const express = require('express');
const router = express.Router();

const { Tags } = require('../models');

const auth = require('../middlewares/authentification');

// Get all tags
router.get('/', async function(req, res){
    try {
        const tags = await Tags.findAll();
        if (tags.length > 0) {
             res.status(200).json({ data: tags });
        } else {
            res.status(200).json({ message: "No tags found", data: [] });
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

// Get tag by ID
router.get('/:id', async function (req, res) {
    const id = req.params.id;
    try {
        // Find tag by id
        const tag = await tag.findOne({
            where: {
                id
            }
        });
        if (!tag) {
            res.status(500).json({ message: "Tag not find" })
        } else {
            res.send(tag);
        }
    } catch (error) {
        res.status(500).json({ message: error })
    }
});

// Add tag
router.post('/', auth, async function (req, res) {
    try {
        const response = await Tags.create({
            tag: req.body.tag 
        })
        .then(function (data) {
            const res = {
                success: true,
                data: data,
                message: "Tag added successful"
            }
            return res;
        })
        .catch(error => {
            res.status(500).json({message: error})
        })
        res.json(response);
    } catch(error) {
        res.status(500).json({message: "Internal Server Error"});
    }
});

module.exports = router;