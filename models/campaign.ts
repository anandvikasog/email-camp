import mongoose, { Schema, Document, Types } from 'mongoose';

const campaignSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    mails: [
      {
        type: Schema.ObjectId,
        ref: 'CampaignMail',
      },
    ],
    fromEmail: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'ConnectedEmail',
    },
    status: {
      type: String,
      enum: ['Pending', 'Running', 'Completed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Campaign =
  mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema);
export default Campaign;
