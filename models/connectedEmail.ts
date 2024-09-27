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
    body: {
      type: String,
    },
    domain: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const ConnectedEmail =
  mongoose.models.ConnectedEmail ||
  mongoose.model('ConnectedEmail', connectedEmailSchema);
export default ConnectedEmail;
