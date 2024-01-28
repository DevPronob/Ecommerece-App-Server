const mongoose = require('mongoose');
// const slug = require('mongoose-slug-generator');

// mongoose.plugin(slug);

const CategorySchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  slug: {
    type: String,
    slug: 'name',
    unique: true,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
//   products: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Product',
//     },
//   ],
  created: {
    type: Date,
    default: Date.now,
  },
  // Add more fields as needed...
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
