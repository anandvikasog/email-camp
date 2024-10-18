import mongoose from 'mongoose';
const { Schema } = mongoose;

const connectedEmailSchema: any = new Schema(
  {
    userId: {
      type: Schema.ObjectId,
      ref: 'User',
    },
    emailId: {
      type: String,
      required: true,
    },
    signature: {
      type: String,
    },
    type: {
      type: String,
      enum: ['gmail', 'outlook', 'custom'],
      required: true,
    },
    gmailToken: {
      type: String,
    },
    outlookToken: {
      type: String,
    },
    smtpHost: {
      type: String,
    },
    smtpPort: {
      type: String,
    },
    smtpUsername: {
      type: String,
    },
    imapHost: {
      type: String,
    },
    imapPort: {
      type: String,
    },
    imapUsername: {
      type: String,
    },
    smtpPassword: {
      type: String,
    },
    imapPassword: {
      type: String,
    },
  },
  { timestamps: true }
);
const ConnectedEmail =
  mongoose.models.ConnectedEmail ||
  mongoose.model('ConnectedEmail', connectedEmailSchema);
export default ConnectedEmail;
