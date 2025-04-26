const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userInfoSchema = new Schema({
  userId: { type: String, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function() {
    return !this.isGoogleUser;
  } },
  isGoogleUser: {
    type: Boolean,
    default: false,
  },
  location: { type: String },
  profilePicImageLink: { type: String },
  department: [{ type: String }],
  skills: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

module.exports = mongoose.model("UserInfo", userInfoSchema);
