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
      enum: ["none", "Ring", "Bracelet", "Amulet", "Beads"],
      default: "none"     
    },
    attribute: {
      type: [String],
      modifyingAttribute: {
        type: String,
        enum: ["none", "damage", "armor", "speed"]
      },
      required: true,
    },
    modifier: {
      type: Number,
      default: 1,
      required: true,
    },
  },
  {
    timestamps: true
  }
);

const Artefact = model("Artefact", artefactSchema);

module.exports = Artefact;
