import mongoose from 'mongoose';
const { Schema } = mongoose;

const subscriptionSchema: any = new Schema(
  {
    userId: {
      type: Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    stripeSubscriptionId: {
      type: String,
    },
    stripePriceId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'due',
      enum: ['active', 'past', 'due', 'canceled'],
    },
    currentPeriodStart: {
      type: Date,
    },
    currentPeriodEnd: {
      type: Date,
    },
  },
  { timestamps: true }
);
const Subscription =
  mongoose.models.Subscription ||
  mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
