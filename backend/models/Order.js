const mongoose = require('mongoose');
 


const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        qty: Number,
        price: Number,
      },
    ],
    total: Number,
    status: { type: String, enum: ["pending", "processing", "delivered"], default: "pending" },
  },
  { timestamps: true }  // ✅ this automatically adds createdAt & updatedAt
);

module.exports = mongoose.model('Order', orderSchema);
