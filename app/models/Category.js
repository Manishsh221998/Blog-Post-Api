const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
     },
    description: {
      type: String,
    required: true,
      trim: true,
    },
  },
  {
    versionKey:false,
    timestamps: true,
  }
);

module.exports = mongoose.model('Category', categorySchema);
