import mongoose, { Schema } from 'mongoose';

const campaignMailSchema = new Schema(
  {
    campaignId: {
      type: Schema.ObjectId,
      ref: 'Campaign',
      required: true,
    },
    sendAt: {
      type: Date,
      required: true,
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    subject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    prospects: [
      {
        prospectData: {
          type: Object,
        },
        isDelivered: {
          type: Boolean,
          default: false,
        },
        isBounced: {
          type: Boolean,
          default: false,
        },
        isRejected: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CampaignMail =
  mongoose.models.CampaignMail ||
  mongoose.model('CampaignMail', campaignMailSchema);
export default CampaignMail;
