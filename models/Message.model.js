const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const messageSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    textBody: {
      type: String,
      required: true,
    },
    attachment: {
      type: [Schema.Types.ObjectId],
      ref: "Item",
    },
    messageType: {
      type: String,
      enum: ["friendrequest", "message"]
    }
  },
  {
    timestamps: true
  }
);

const Message = model("Message", messageSchema);

module.exports = Message;
