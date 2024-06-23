// models/Item.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Item Schema
const ItemSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
});

module.exports = Item = mongoose.model('item', ItemSchema);
