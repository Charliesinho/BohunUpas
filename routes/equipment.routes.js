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
  let randomName1 = ["Bad ", "Broken ", "Shady ", "Illegal ", "Probably ", "Weird "]
  let randomName2 = ["Cool ", "Chill ", "Nice ", "Charming "]
  let randomName3 = ["Insane ", "Awesome ", "Brutal ", "Scary "]

  if (randomNum >= 0 && randomNum <= 40) {
    const newItem = {
      name: randomName1[namePosition] + `Wooden Wand`,
      image: "../images/Weapons/woodenWand.png",
      type: "Weapon",
      subtype: "Wand",
      modifier: Math.floor(Math.random() * (6 - 1) + 1),
      value: 2,
      equipped: false,
    }
    return newItem;
  } else if (randomNum >= 41 && randomNum <= 70) {
    const newItem = {
      name: randomName1[namePosition] + `Old Armor`,
      image: "../images/Armor/peasantArmor.png",
      type: "Armor",
      subtype: "Light",
      modifier: Math.floor(Math.random() * (6 - 1) + 1),
      value: 3,
      equipped: false,
    }
    return newItem;
  } else if (randomNum >= 91 && randomNum <= 99) {
    const newItem = {
      name: randomName1[namePosition] + `Bronze Armor`,
      image: "../images/Armor/bronzeArmor.png",
      type: "Armor",
      subtype: "Medium",
      modifier: Math.floor(Math.random() * (8 - 3) + 3),
      value: 4,
      equipped: false,
    }
    return newItem;
  } else if (randomNum >= 71 && randomNum <= 90) {
    const newItem = {
      name: randomName1[namePosition] + `Rusty Sword`,
      image: "../images/Weapons/rustySword.png",
      type: "Weapon",
      subtype: "Sword",
      modifier: Math.floor(Math.random() * (8 - 3) + 3),
      value: 4,
      equipped: false,
    }
    return newItem;
  }
  
}

function generateItemRare() {
  let randomNum = Math.floor(Math.random() * 100);
  console.log(randomNum)
  let namePosition = Math.floor(Math.random() * 4)
  let randomName1 = ["Bad ", "Broken ", "Shady ", "Illegal ", "Probably ", "Weird "]
  let randomName2 = ["Cool ", "Chill ", "Nice ", "Charming "]
  let randomName3 = ["Insane ", "Awesome ", "Brutal ", "Scary "]

  if (randomNum >= 0 && randomNum <= 20) {
    const newItem = {
      name: randomName2[namePosition] + `Heavy Sword`,
      image: "../images/Weapons/heavySword.png",
      type: "Weapon",
      subtype: "Sword",
      modifier: Math.floor(Math.random() * (20 - 5) + 5),
      value: 10,
      equipped: false,
    }
    return newItem;
  } else if (randomNum >= 41 && randomNum <= 90) {
    const newItem = {
      name: randomName2[namePosition] + `Lancer`,
      image: "../images/Weapons/Lancer.png",
      type: "Weapon",
      subtype: "Sword",
      modifier: Math.floor(Math.random() * (15 - 5) + 5),
      value: 12,
      equipped: false,
    }
    return newItem;
  } else if (randomNum >= 91 && randomNum <= 99) {
    const newItem = {
      name: randomName2[namePosition] + `Leather Armor`,
      image: "../images/Armor/leatherArmor.png",
      type: "Armor",
      subtype: "Medium",
      modifier: Math.floor(Math.random() * (10 - 3) + 3),
      value: 15,
      equipped: false,
    }
    return newItem;
  } else if (randomNum >= 21 && randomNum <= 40) {
    const newItem = {
      name: randomName2[namePosition] + `Iron Armor`,
      image: "../images/Armor/ironArmor.png",
      type: "Armor",
      subtype: "Heavy",
      modifier: Math.floor(Math.random() * (12 - 5) + 5),
      value: 12,
      equipped: false,
    }
    return newItem;
  }
  
}

function generateItemLegendary() {
  let randomNum = Math.floor(Math.random() * 100);
  console.log(randomNum)
  let namePosition = Math.floor(Math.random() * 4)
  let randomName1 = ["Bad ", "Broken ", "Shady ", "Illegal ", "Probably ", "Weird "]
  let randomName2 = ["Cool ", "Chill ", "Nice ", "Charming "]
  let randomName3 = ["Epic ", "Wise ", "Brutal ", "Scary "]

  if (randomNum >= 0 && randomNum <= 49) {
    const newItem = {
      name: randomName3[namePosition] + `Moonlair`,
      image: "../images/Weapons/moonSword.png",
      type: "Weapon",
      subtype: "Sword",
      modifier: Math.floor(Math.random() * (50 - 35) + 35),
      value: Math.floor(Math.random() * (150 - 50) + 50),
      equipped: false,
    }
    return newItem;
  } else if (randomNum >= 50 && randomNum <= 99) {
    const newItem = {
      name: randomName3[namePosition] + `Guardian Armor`,
      image: "../images/Armor/guardianArmor.png",
      type: "Armor",
      subtype: "Heavy",
      modifier: Math.floor(Math.random() * (41 - 25) + 25),
      value: Math.floor(Math.random() * (150 - 50) + 50),
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
      const rendering = "soulkeeper"
      const profile = await User.findOne({username: req.session.user.username}).populate('character');
      const sessionName= req.session.user.username;
      const sessionRace = await User.find({username: sessionName});
      const character = await Character.findById(req.params.charId).populate("inventory");
      const availableSouls = character.souls;
      const price = parseInt(req.body.price)

      if (price <= availableSouls) { // ENOUGH SOULS CHECK
          if (character.inventory.length < 6) { // INVENTORY CHECK
            // Check next free inventory slot
           let newItem;
            if (req.body.name === "Standard Pack")  {
               newItem = generateItemCommon(); 
            }
            if (req.body.name === "Medium Pack")  {
              newItem = generateItemRare(); 
           }
           if (req.body.name === "Legendary Pack")  {
            newItem = generateItemLegendary(); 
         }
           
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
            res.render("user/soulkeeper", {session: loginCheck, profile: profile, sessionRace: sessionRace[0].character, character: character,  rendering: rendering, session: loginCheck, errorMessage: ""});
          } else { // INVENTORY FULL
            res.render("user/soulkeeper", {session: loginCheck, profile: profile, sessionRace: sessionRace[0].character, character: character, session: loginCheck,  rendering: rendering, errorMessage: "Your inventory is full!"});
          }
      } else { // CAN'T AFFORD
        console.log("TOO EXPENSIVE!")
        res.render("user/soulkeeper", {session: loginCheck, profile: profile, sessionRace: sessionRace[0].character, character: character,  rendering: rendering, session: loginCheck, errorMessage: "You cannot afford this pack!"});
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
    console.log("TRYING TO SELL")
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
    

    res.redirect(`/user/soulkeeper/${req.params.charId}/sold`);
  } catch (error) {
    console.log("Error selling item: ", error);
  }
});



module.exports = router;