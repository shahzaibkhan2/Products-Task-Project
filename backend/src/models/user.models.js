import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email address format",
      },
    },
    fullname: {
      type: String,
      // required: [true, "Fullname is required"],
      trim: true,
      minlength: [3, "Fullname must be at least 3 characters"],
      maxlength: [50, "Fullname must be at most 50 characters"],
    },
    password: {
      type: String,
      // required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    cartItems: {
      type: Array,
      default: [],
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
