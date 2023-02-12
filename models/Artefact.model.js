const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const artefactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,      
      required: true, 
      enum: ["Ring", "Bracelet", "Amulet", "Beads"],    
    },
    equip: {
      type: String,
      default: "Artefact"
    },
    attribute: {
      type: [String],
      modifyingAttribute: {
        type: String,
        enum: ["damage", "armor", "speed"]
      },
      required: true,
    },
    modifier: {
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

const Artefact = model("Artefact", artefactSchema);

module.exports = Artefact;
