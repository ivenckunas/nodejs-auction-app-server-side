const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  image: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  time: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },

})

module.exports = mongoose.model('type12items-atsiskaitymas', itemSchema)