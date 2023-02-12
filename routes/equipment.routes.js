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

// BUY ITEM
router.post("/generateWeapon/:charId", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);
  try {
      const profile = await User.findOne({username: req.session.user.username}).populate('character');
      const sessionName= req.session.user.username;
      const sessionRace = await User.find({username: sessionName});
      const character = await Character.findById(req.params.charId).populate("inventory");
      const availableSouls = parseInt(req.body.availableSouls);
      const price = parseInt(req.body.price)

      if (price <= availableSouls) { // ENOUGH SOULS CHECK
          if (character.inventory.length < 20) { // INVENTORY CHECK
              const newWeapon = {
                  name: "Awesome Weapon",
                  type: "Wand",
                  damage: 1,
                  race: "Dino",
                  value: 5
              }
              const craftedWeapon = await Weapon.create(newWeapon);
              character.inventory.push(craftedWeapon);
              character.souls = parseInt(character.souls) - price;
              character.save();

              console.log("TRANSACTION DONE")
              res.render("user/soulkeeper", {session: loginCheck, profile: profile, sessionRace: sessionRace[0].character, character: character, session: loginCheck, errorMessage: ""});
          } else { // INVENTORY FULL
              res.render("user/soulkeeper", {session: loginCheck, profile: profile, sessionRace: sessionRace[0].character, character: character, session: loginCheck, errorMessage: "Your inventory is full!"});
          }
      } else { // CAN'T AFFORD
        console.log("TOO EXPENSIVE!")
        res.render("user/soulkeeper", {session: loginCheck, profile: profile, sessionRace: sessionRace[0].character, character: character, session: loginCheck, errorMessage: "You cannot afford this pack!"});
      }
  } catch (err) {
      console.log("Something went wrong: ", err)
  }
});




// EQUIP
router.post("/equipItem/:charId/:itemId/:equip", async(req, res, next) => {
  checkLogin(req.session.user);
  // Get Character
  try {
    const character = await Character.findById(req.params.charId).populate("inventory").populate("weapon").populate("armor").populate("artefact");
    const itemEquip = req.params.equip;

    if (itemEquip === "Weapon") {
      const weapon = await Weapon.findByIdAndDelete(req.params.itemId);
      let tempWeapon = {
        name: weapon.name,
        equip: weapon.right,
        type: weapon.type,
        damage: weapon.damage,
        race: weapon.race,
        value: weapon.value,
        equipped: true,
      };
      const newWeapon = await Weapon.create(tempWeapon);
      const invItem = await Character.findById(req.params.itemId)
      if (!character.weapon.length) { // None equipped yet
        character.weapon.push(newWeapon);
        character.save();
      } else { // One equipped already
        const previousWeapon = character.weapon.pop();
        character.inventory.push(previousWeapon);
        character.weapon.push(newWeapon);
        character.save();
      }
    } else if (itemEquip === "Armor") {
      if (!character.armor) { // None equipped yet

      } else { // One equipped already

      }
    } else if (itemEquip === "Artefact") {
      if (!character.artefact) { // None equipped yet

      } else { // One equipped already

      }
    }

    res.redirect("/user/characterProfile");
  } catch (err) {
    console.log("Error equipping the item: ", err);
  }
});





// SELL ITEM
router.post("/sellItem/:charId/:itemId/:equip", async (req, res, next) => {
  checkLogin(req.session.user);
  try {
    // Get Character
    const character = await Character.findById(req.params.charId).populate("inventory");
    
    // Get Item type
    let item;
    if (req.params.equip === "Weapon") item = await Weapon.findById(req.params.itemId); 
    if (req.params.equip === "Armor") item =  await Armor.findById(req.params.itemId); 
    if (req.params.equip === "Artefact") item =  await Artefact.findById(req.params.itemId); 
    const value = item.value;
    character.souls = parseInt(character.souls) + value;
    character.save();
    if (req.params.equip === "Weapon") await Weapon.findByIdAndDelete(req.params.itemId); 
    if (req.params.equip === "Armor")  await Armor.findByIdAndDelete(req.params.itemId); 
    if (req.params.equip === "Artefact")  await Artefact.findByIdAndDelete(req.params.itemId); 

    res.redirect("/user/characterProfile");
  } catch (error) {
    console.log("Error selling item: ", error);
  }
});

module.exports = router;