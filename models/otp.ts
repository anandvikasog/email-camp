// ~/models/otp.ts
import mongoose, { InferSchemaType } from 'mongoose';
import validator from 'validator';
const { Schema } = mongoose;

const otpSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value: string) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    },
  },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  verified: { type: Boolean, default: false },
});

export type OtpType = InferSchemaType<typeof otpSchema>;

const Otp = mongoose.models.Otp || mongoose.model('Otp', otpSchema);

export default Otp;
