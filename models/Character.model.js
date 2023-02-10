const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const characterSchema = new Schema(
  {
    race: {
      type: String,      
      required: true, 
      enum: ["none", "Dino", "Undead", "Human"],
      default: "none"     
    },
    weapon: {
      type: String,
      required: true,
      default: "none"            
    },
    armor: {
      type: String,
      required: true,
      default: "none"
    },
    artifact: {
      type: String,
      required: true,
      default: "none"
    },
    souls: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Character = model("Character", characterSchema);

module.exports = Character;
