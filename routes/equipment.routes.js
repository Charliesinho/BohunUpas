const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const { isLoggedIn } = require('../middleware/route-guard');
const User = require('../models/User.model');
const Character = require('../models/Character.model');
const Item = require('../models/Item.model');

let loginCheck = false;

function checkLogin(session) {
  if (session !== undefined) {
    loginCheck = true;
  } else {
    loginCheck = false;
  }
}

//Generate bad quality Item
function generateItemCommon() {
      let randomNum = Math.floor(Math.random() * 100);
      console.log(randomNum)
      let namePosition = Math.floor(Math.random() * 6)
      let randomName = ["Bad ", "Broken ", "Shady ", "Illegally obtained ", "Probably some ", "Weird "]

      if (randomNum >= 0 && randomNum <= 40) {
        const newItem = {
          name: randomName[namePosition] + `Wooden wand`,
          image: "../images/Weapons/woodenWand.png",
          type: "Weapon",
          subtype: "Wand",
          modifier: Math.floor(Math.random() * (6 - 1) + 1),
          value: 5,
          equipped: false,
        }
        return newItem;
      } else if (randomNum >= 41 && randomNum <= 90) {
        const newItem = {
          name: randomName[namePosition] + `old Armor`,
          image: "../images/Armor/peasantArmor.png",
          type: "Armor",
          subtype: "Light",
          modifier: Math.floor(Math.random() * (6 - 1) + 1),
          value: 5,
          equipped: false,
        }
        return newItem;
      }
      
}

              // name: `Awesome Weapon`,
              // equip: "Weapon",
              // type: "Wand",
              // damage: 5,
              // race: "Dino",
              // value: 5,
              // equipped: false,

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
            // Check next free inventory slot  
            let newItem = generateItemCommon(); 
            console.log(newItem)           
            
            if (newItem.type === "Armor") {
              newItem = await Item.create(newItem);
            }   
            else if (newItem.type === "Weapon") {
              newItem = await Item.create(newItem);
            }         
            character.inventory.push(newItem);
            // Deduct souls and save
            character.souls = parseInt(character.souls) - price;
            character.save();
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
router.post("/equipItem/:charId/:type/:itemId", async(req, res, next) => {
  checkLogin(req.session.user);
  // Get Character
  try {
    const character = await Character.findById(req.params.charId).populate("inventory").populate("weapon").populate("armor").populate("artefact");
    const itemType = req.params.type;
    const itemId = req.params.itemId;
    
    if (itemType === "Weapon") {
      // FIND THE INDEX IN THE INVENTORY
      let thisIndex;
      for (let i = 0; i < character.inventory.length; i++) {
        if (JSON.stringify(character.inventory[i]._id) === `"${req.params.itemId}"`) {
          thisIndex = i;
        }
      }
      if (!character.weapon.length) { // None equipped yet
          const invWeapon = character.inventory.splice(thisIndex, 1);
          await Item.findByIdAndUpdate(itemId, {equipped: true}, {new: true});
          character.weapon.push(invWeapon[0]);
          await character.save();
      } else { // One equipped already
          const previousWeapon = character.weapon.pop();
          await Item.findOneAndUpdate(previousWeapon._id, {equipped: false}, {new: true});
          const invWeapon = character.inventory.splice(thisIndex, 1)
          await Item.findOneAndUpdate(invWeapon[0]._id, {equipped: true}, {new: true});
          character.inventory.splice(thisIndex, 0, previousWeapon);
          character.weapon.push(invWeapon[0]);
          await character.save();
        }
    } else if (itemType === "Armor") {
      // FIND THE INDEX IN THE INVENTORY
      let thisIndex;
      for (let i = 0; i < character.inventory.length; i++) {
        if (JSON.stringify(character.inventory[i]._id) === `"${req.params.itemId}"`) {
          thisIndex = i;
        }
      }
      if (!character.armor.length) { // None equipped yet
          const invArmor = character.inventory.splice(thisIndex, 1);
          await Item.findByIdAndUpdate(itemId, {equipped: true}, {new: true});
          character.armor.push(invArmor[0]);
          await character.save();
      } else { // One equipped already
          const previousArmor = character.armor.pop();
          await Item.findOneAndUpdate(previousArmor._id, {equipped: false}, {new: true});
          const invArmor = character.inventory.splice(thisIndex, 1)
          await Item.findOneAndUpdate(invArmor[0]._id, {equipped: true}, {new: true});
          character.inventory.splice(thisIndex, 0, previousArmor);
          character.armor.push(invArmor[0]);
          await character.save();
        }
    } else if (itemType === "Artefact") {
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
router.post("/sellItem/:charId/:type/:itemId", async (req, res, next) => {
  checkLogin(req.session.user);
  try {
    // Get Character
    const character = await Character.findById(req.params.charId).populate("inventory").populate("weapon").populate("armor").populate("artefact");
    let thisIndex;
    for (let i = 0; i < character.inventory.length; i++) {
      if (JSON.stringify(character.inventory[i]._id) === `"${req.params.itemId}"`) {
        thisIndex = i;
      }
    }
    // Get Item type
    let item;
    if (req.params.type === "Weapon") item = await Item.findById(req.params.itemId); 
    if (req.params.type === "Armor") item =  await Item.findById(req.params.itemId); 
    if (req.params.type === "Artefact") item =  await Item.findById(req.params.itemId); 
    const value = item.value;
    character.souls = parseInt(character.souls) + value;
    character.save();
    character.inventory.splice(thisIndex, 1);
    if (req.params.type === "Weapon") await Item.findByIdAndDelete(req.params.itemId); 
    if (req.params.type === "Armor")  await Item.findByIdAndDelete(req.params.itemId); 
    if (req.params.type === "Artefact")  await Item.findByIdAndDelete(req.params.itemId); 
    

    res.redirect("/user/characterProfile");
  } catch (error) {
    console.log("Error selling item: ", error);
  }
});


module.exports = router;