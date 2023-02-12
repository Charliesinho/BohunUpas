const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const armorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,      
      required: true, 
      enum: ["Light", "Medium", "Heavy"],    
    },
    equip: {
      type: String,
      default: "Armor"
    },
    protection: {
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

const Armor = model("Armor", armorSchema);

module.exports = Armor;
