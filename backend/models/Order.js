import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        },
        name: String,
        price: Number,
        quantity: Number,
        size: String
      }
    ],

    totalAmount: {
      type: Number,
      required: true
    },

    paymentInfo: {
      razorpay_order_id: String,
      razorpay_payment_id: String,
      paymentMethod: String
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending"
    },

    orderStatus: {
      type: String,
      enum: ["Placed", "Shipped", "Delivered", "Cancelled"],
      default: "Placed"
    },

    returnRequest: {
      status: {
        type: String,
        enum: ["None", "Requested", "Approved", "Rejected", "Completed"],
        default: "None"
      },
      reason: String,
      description: String,
      requestedAt: Date,
      approvedAt: Date,
      refundAmount: Number,
      refundStatus: {
        type: String,
        enum: ["Pending", "Processed", "Failed"],
        default: "Pending"
      }
    },

    shippingAddress: {
      fullName: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      phone: String,
    },

  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
