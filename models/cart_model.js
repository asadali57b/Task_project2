

// const mongoose = require('mongoose');
// const schema = mongoose.Schema;
// const CartSchema = new mongoose.Schema({
//     user: {
//         type: schema.Types.ObjectId,
//         required: true
//     },
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     description: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     price: {
//         type: Number,
//         required: true,
//         min: 0
//     },
//     category: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     brand: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     image: {
//         type: String,
//         required: false // Required if your products are visualized with images
//     },
//     stock: {
//         type: Number,
//         required: true,
//         min: 0,
//         default: 0 // Default is 0 to avoid showing unavailable products initially
//     },
//     ratings: {
//         type: Number,
//         default: 0
//     },
//     numReviews: {
//         type: Number,
//         default: 0
//     },
//     isFeatured: {
//         type: Boolean,
//         default: false
//     }
// }, { timestamps: true });

// // Creating an index for optimized search on frequently queried fields (e.g., name, category)
// CartSchema.index({ name: 'text', category: 'text', brand: 'text' });

// // Export the model
// module.exports = mongoose.model('Cart', CartSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const CartItemSchema = new Schema({
//   product: {
//     type: Schema.Types.ObjectId,
//     ref: 'Item',
//     required: true
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     min: 1
//   },
//   price: {
//     type: Number,
//     required: true
//   }
// });

const CartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true
  },
    product: {
    type: Schema.Types.ObjectId,
    ref: 'item',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Cart', CartSchema);

