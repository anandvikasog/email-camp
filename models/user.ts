import mongoose, { InferSchemaType } from 'mongoose';
import validator from 'validator';
const { Schema } = mongoose;

const userSchema: any = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
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
    mobile: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
    },
    stripeCustomerId: {
      type: String,
    },
    subscription: {
      type: Schema.ObjectId,
      ref: 'Subscription',
    },
  },
  { timestamps: true }
);

export type UserType = InferSchemaType<typeof userSchema>;

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
