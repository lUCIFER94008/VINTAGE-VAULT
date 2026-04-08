import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this product.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price.'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description.'],
  },
  images: {
    type: [String], // Cloudinary URLs
    required: [true, 'Please provide at least one image URL.'],
    validate: [val => val.length > 0, 'Minimum 1 image required']
  },
    category: {
      type: String,
      enum: ['5 Sleeve Jersey', 'Shorts', 'Track Pant', 'Printed Socks', 'Headwear', 'Baggy'],
      default: '5 Sleeve Jersey',
    },
    available: {
      type: Boolean,
      default: true,
    },
    sizes: {
      type: [String],
      default: []
    },
}, {
  timestamps: true,
});


export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
