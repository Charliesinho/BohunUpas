const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const messageSchema = new Schema(
  {
    friend: {
        type: Schema.Types.ObjectId,
        ref: "Character",
        unique: true,
    },
    price: {
        type: Number,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "Character",
    },
  },
  {
    timestamps: true
  }
);

const Message = model("Message", messageSchema);

module.exports = Message;
