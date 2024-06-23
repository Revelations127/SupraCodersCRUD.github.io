// routes/items.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Item = require('../models/Item');

// @route   GET /items
// @desc    Get all items
// @access  Public
router.get('/', (req, res) => {
  Item.find()
    .populate('userId', 'username')
    .then(items => res.json(items))
    .catch(err => res.status(404).json({ noitemsfound: 'No items found' }));
});

// @route   GET /items/:id
// @desc    Get a single item by ID
// @access  Public
router.get('/:id', (req, res) => {
  Item.findById(req.params.id)
    .populate('userId', 'username')
    .then(item => res.json(item))
    .catch(err => res.status(404).json({ noitemfound: 'Item not found' }));
});

// @route   POST /items
// @desc    Create a new item
// @access  Managers Only (authentication required)
router.post('/', auth, (req, res) => {
  const newItem = new Item({
    userId: req.user.id,
    name: req.body.name,
    description: req.body.description,
    quantity: req.body.quantity
  });

  newItem.save().then(item => res.json(item));
});

// @route   PUT /items/:id
// @desc    Update an item
// @access  Managers Only (authentication required)
router.put('/:id', auth, (req, res) => {
  Item.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(item => res.json(item))
    .catch(err => res.status(404).json({ noitemfound: 'Item not found' }));
});

// @route   DELETE /items/:id
// @desc    Delete an item
// @access  Managers Only (authentication required)
router.delete('/:id', auth, (req, res) => {
  Item.findByIdAndDelete(req.params.id)
    .then(() => res.json({ success: true }))
    .catch(err => res.status(404).json({ noitemfound: 'Item not found' }));
});

module.exports = router;
