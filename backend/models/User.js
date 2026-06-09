const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: false, minlength: 6, select: false },
    googleId: { type: String, sparse: true, default: null },
    avatar: { type: String, default: "" },
    resetToken: String,
    resetTokenExpiry: Date,
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  // Only hash when password exists and was changed (Google users have no password)
  if (!this.password || !this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false; // Google-only accounts have no password
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.googleId;
  delete obj.resetToken;
  delete obj.resetTokenExpiry;
  return obj;
};

module.exports = mongoose.model("User", UserSchema);
