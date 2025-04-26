const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "UserInfo",
    required: true,
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: "UserInfo",
    required: true,
  },
  text: {
    type: String,
  },
  image: {
    type: String,
  },
},
  { timestamps: true }
);

module.exports =  mongoose.model("Messages", messageSchema);

