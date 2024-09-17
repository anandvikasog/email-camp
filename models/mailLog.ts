import mongoose from "mongoose";
const { Schema } = mongoose;

const mailLogSchema: any = new Schema(
  {
    to: {
      type: String,
    },
    from: {
      type: String,
    },
    subject: {
      type: String,
    },
    body: {
      type: String,
    },
  },
  { timestamps: true }
);
const MailLog =
  mongoose.models.MailLog || mongoose.model("MailLog", mailLogSchema);
export default MailLog;
