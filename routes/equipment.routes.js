const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const { isLoggedIn } = require('../middleware/route-guard');
const User = require('../models/User.model');
const Character = require('../models/Character.model');
const Weapon = require("../models/Weapon.model");
const Armor = require("../models/Armor.model");
const Artefact = require("../models/Artefact.model");
let loginCheck = false;

function checkLogin(session) {
  if (session !== undefined) {
    loginCheck = true;
  } else {
    loginCheck = false;
  }
}

router.post("/generateWeapon/:charId", isLoggedIn, async (req, res, next) => {
    checkLogin(req.session.user);
    try {
        const profile = await User.findOne({username: req.session.user.username}).populate('character');
        const sessionName= req.session.user.username;
        const sessionRace = await User.find({username: sessionName});
        const character = await Character.findById(req.params.charId).populate("inventory");

        const availableSouls = parseInt(req.body.availableSouls);
        const price = parseInt(req.body.price)

        if (character.inventory.length < 20) { // INVENTORY CHECK
            if (price <= availableSouls) { // AFFORDABLE CHECK
                const newWeapon = {
                    name: "Awesome Weapon",
                    type: "Wand",
                    damage: 1,
                    race: "Dino"
                }
                const craftedWeapon = await Weapon.create(newWeapon);
                character.inventory.push(craftedWeapon._id);
                character.souls = parseInt(character.souls) - price;
                character.save();

                console.log("TRANSACTION DONE")
                res.render("user/soulkeeper", {session: loginCheck, profile: profile, sessionRace: sessionRace[0].character, character: character, session: loginCheck, errorMessage: ""});
            } else { // CAN'T AFFORD
                console.log("TOO EXPENSIVE!")
                res.render("user/soulkeeper", {session: loginCheck, profile: profile, sessionRace: sessionRace[0].character, character: character, session: loginCheck, errorMessage: "You cannot afford this pack!"});
            }
        } else { // INVENTORY FULL
            res.render("user/soulkeeper", {session: loginCheck, profile: profile, sessionRace: sessionRace[0].character, character: character, session: loginCheck, errorMessage: "Your inventory is full!"});
        }
    } catch (err) {
        console.log("Something went wrong: ", err)
    }
  });

module.exports = router;