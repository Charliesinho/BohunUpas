const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const itemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true
    },
    type: {
      type: String,      
      required: true, 
      enum: ["Weapon", "Armor", "Artefact"],    
    },
    modifier: {
      type: Number,
      default: 1,
    },
    race: {
      type: String,      
      enum: ["Dino", "Undead", "Human"],
    },
    value: {
      type: Number,
      default: 1
    },
    equipped: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Item = model("Item", itemSchema);

module.exports = Item;
