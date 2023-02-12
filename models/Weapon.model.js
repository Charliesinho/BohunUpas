const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const weaponSchema = new Schema(
  {
    name: {
          type: String,
          required: true,
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
  },
  {
    timestamps: true
  }
);

const Weapon = model("Weapon", weaponSchema);

module.exports = Weapon;
