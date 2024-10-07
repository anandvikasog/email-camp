import mongoose, { Schema } from 'mongoose';

const timingSchema = new Schema({
  mon: {
    checked: { type: Boolean, default: false },
    intervals: [
      {
        start: { type: String, required: true },
        end: { type: String, required: true },
      },
    ],
  },
  tue: {
    checked: { type: Boolean, default: false },
    intervals: [
      {
        start: { type: String, required: true },
        end: { type: String, required: true },
      },
    ],
  },
  wed: {
    checked: { type: Boolean, default: false },
    intervals: [
      {
        start: { type: String, required: true },
        end: { type: String, required: true },
      },
    ],
  },
  thu: {
    checked: { type: Boolean, default: false },
    intervals: [
      {
        start: { type: String, required: true },
        end: { type: String, required: true },
      },
    ],
  },
  fri: {
    checked: { type: Boolean, default: false },
    intervals: [
      {
        start: { type: String, required: true },
        end: { type: String, required: true },
      },
    ],
  },
  sat: {
    checked: { type: Boolean, default: false },
    intervals: [
      {
        start: { type: String, required: true },
        end: { type: String, required: true },
      },
    ],
  },
  sun: {
    checked: { type: Boolean, default: false },
    intervals: [
      {
        start: { type: String, required: true },
        end: { type: String, required: true },
      },
    ],
  },
});
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
    gapType: {
      type: String,
    },
    gapCount: {
      type: Number,
    },
    timing: timingSchema, // Add timing field
  },
  {
    timestamps: true,
  }
);

const CampaignMail =
  mongoose.models.CampaignMail ||
  mongoose.model('CampaignMail', campaignMailSchema);
export default CampaignMail;
