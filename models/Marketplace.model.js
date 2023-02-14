const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const marketplaceSchema = new Schema(
  {
    item: {
        type: [Schema.Types.ObjectId],
        ref: "Item",
        unique: true,
    },
    price: {
        type: Number,
        required: true
    },
    owner: {
        type: [Schema.Types.ObjectId],
        ref: "Character",
    }
  },
  {
    timestamps: true
  }
);

const Marketplace = model("Marketplace", marketplaceSchema);

module.exports = Marketplace;
