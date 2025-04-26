const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  userId: { type: String, ref: "UserInfos", required: true },
  objectId: {type: String},
  department: { type: String },
  jobTitle: { type: String },
  jobDescription: { type: String },
  location: { type: String },
  status: { type: String },
  price: { type: Number }, 
  postedBy: { type: String },
  postedAt: { type: Date, default: Date.now },
  imageLink: { type: String },
});

module.exports = mongoose.model("Listing", listingSchema);
