const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const achievementSchema = new Schema(
  {
    inGameId: {
        type: String,
        required: true,
    },
    image: {
        type: String,      
        required: true,   
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
  }
);

const Achievement = model("Achievement", achievementSchema);

module.exports = Achievement;
