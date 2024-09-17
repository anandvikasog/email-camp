import mongoose from 'mongoose';
import validator from 'validator';
const { Schema } = mongoose;

const userSchema: any = new Schema(
  {
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
    password: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      enum: ['credential', 'google', 'facebook'],
      default: 'credential',
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
    },
  },
  { timestamps: true }
);
const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
