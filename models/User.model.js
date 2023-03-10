const { Schema, model, Types } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: false,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    character: {
      type: [Schema.Types.ObjectId], 
      ref: "Character",       
    },
    friends: {
      type: [Schema.Types.ObjectId], 
      ref: "User"
    },
    messages: {
      type: [Schema.Types.ObjectId], 
      ref: "Message"
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
