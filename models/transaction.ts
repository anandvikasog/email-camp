import mongoose from 'mongoose';
const { Schema } = mongoose;

const transactionSchema: any = new Schema(
  {
    userId: {
      type: Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    stripePaymentIntentId: {
      type: String,
    },
    amount: {
      type: Number,
    },
    currency: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['succeeded', 'pending', 'failed'],
    },
    invoiceNumber: {
      type: String,
    },
    invoiceUrl: {
      type: String,
    },
    invoicePdf: {
      type: String,
    },
  },
  { timestamps: true }
);
const Transaction =
  mongoose.models.Transaction ||
  mongoose.model('Transaction', transactionSchema);
export default Transaction;
