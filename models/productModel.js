const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],
  name: {
    type: String,
    required: true,
  },
  reviews: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  productCode: {
    type: String,
    required: true,
  },
  offerPrice: {
    type: Number,
    // required: true,
  },
  availability: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  featuredImage: {
    type: String,
    required: true,
  },
  packaging: {
    boxType: {
      type: String,
      required: true,
    },
    giftWrap: {
      type: Boolean,
      default: false,
    },
  },
  delivery: {
    estimatedDays: {
      type: Number,
      required: true,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
  },
  size: {
    type: String,
    required: true,
  },
  isTrending: {
    type: Boolean,
    default: false,
  },
  isDealOfTheDay: {
    type: Boolean,
    default: false,
  },
  isBestSeller: {
    type: Boolean,
    default: false,
  },
  year: {
    type: Number,
    required: true,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
