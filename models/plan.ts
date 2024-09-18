import mongoose from 'mongoose';
const { Schema } = mongoose;

const planSchema: any = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    stripePriceId: {
      type: String,
      required: true,
    },
    interval: {
      type: String,
      required: true,
      enum: ['monthly', 'yearly'],
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Plan = mongoose.models.Plan || mongoose.model('Plan', planSchema);
export default Plan;
