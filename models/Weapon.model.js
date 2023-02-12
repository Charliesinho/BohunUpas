const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const weaponSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    equip: {
      type: String,
      default: "Weapon"
    },
    type: {
      type: String,      
      required: true, 
      enum: ["none", "Bow", "Gun", "Wand"],
      default: "none"     
    },
    damage: {
      type: Number,
      default: 1,
      required: true,
    },
    race: {
      type: String,      
      required: true, 
      enum: ["Dino", "Undead", "Human"],
    },
    value: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

const Weapon = model("Weapon", weaponSchema);

module.exports = Weapon;
