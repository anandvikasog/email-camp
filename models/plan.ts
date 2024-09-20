import mongoose, { InferSchemaType } from 'mongoose';
const { Schema } = mongoose;

const planSchema: any = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    interval: {
      type: String,
      required: true,
      enum: ['month', 'year'],
    },
    pros: [
      {
        type: String,
        required: true,
      },
    ],
    cons: [
      {
        type: String,
        required: true,
      },
    ],
    stripePriceId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export type PlanType = InferSchemaType<typeof planSchema>;

const Plan = mongoose.models.Plan || mongoose.model('Plan', planSchema);
export default Plan;
