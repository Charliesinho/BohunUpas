/* GET home page */
const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/route-guard');
const User = require('../models/User.model');
const Character = require('../models/Character.model');
const Item = require('../models/Item.model');
const Marketplace = require('../models/Marketplace.model');
let loginCheck = false;

function checkLogin(session) {
  if (session !== undefined) {
    loginCheck = true;
  } else {
    loginCheck = false;
  }
}

function getUserWithoutHash(user) {
    let userId, charId
    userId = JSON.stringify(user)
    userId = userId.split(":")[1].split(",")[0].replace(`"`, "").replace(`"`, "");
    charId = JSON.stringify(user.character[0]);
    charId = charId.split(":")[1].split(",")[0].replace(`"`, "").replace(`"`, "");
    return {
        id: userId,
        charId: charId,
        username: user.username,
        email: user.email,
        character: user.character
    }
}

// MARKETPLACE MAIN PAGE
router.get("/marketplace", isLoggedIn, async (req, res, next) => {
    checkLogin(req.session.user);
    const sessionName = req.session.user.username;
    const user = await User.find({username: sessionName}).populate("character");
    const currentUser = getUserWithoutHash(user[0]);
    const character = await Character.findById(currentUser.charId).populate("inventory").populate("weapon").populate("artefact").populate("armor");
    res.render("marketplace", {session: loginCheck, sessionRace: [currentUser], character: character, errorMessage: ""})
});


// GENERATE OFFER ROUTES
router.get("/marketplace/select-offer/", isLoggedIn, async (req, res, next) => {
    checkLogin(req.session.user);
    const sessionName = req.session.user.username;
    const user = await User.find({username: sessionName}).populate("character");
    const currentUser = getUserWithoutHash(user[0]);
    const character = await Character.findOne({_id: currentUser.charId}).populate("inventory").populate("weapon").populate("artefact").populate("armor");
    const rendering = "marketplace";
    res.render("marketplace/select-offer", {session: loginCheck, sessionRace: [currentUser], character: character, rendering: rendering, errorMessage: ""})
})

router.get("/marketplace/create-offer/:itemId", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);
  const sessionName = req.session.user.username;
  const user = await User.find({username: sessionName}).populate("character");
  const currentUser = getUserWithoutHash(user[0]);
  const character = await Character.findOne({_id: currentUser.charId}).populate("inventory").populate("weapon").populate("artefact").populate("armor");
  const item = await Item.findById(req.params.itemId);
  const rendering = "marketplace";
  res.render("marketplace/create-offer", {session: loginCheck, sessionRace: [currentUser], character: character, item: item, rendering: rendering, errorMessage: ""})
})

router.post("/marketplace/create-offer/:itemId", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);
  // Variables
  const sessionName = req.session.user.username;
  const user = await User.find({username: sessionName}).populate("character");
  const currentUser = getUserWithoutHash(user[0]);
  const character = await Character.findOne({_id: currentUser.charId}).populate("inventory").populate("weapon").populate("artefact").populate("armor");
  const item = await Item.findById(req.params.itemId);
  
  // Generate offer object
  const offer = {
    item: item,
    price: req.body.price,
    owner: character,
  }
  // Look for item position in inventory and remove
  for (let i = 0; i < character.inventory.length; i++) {
    if (JSON.stringify(character.inventory[i]._id) === `"${req.params.itemId}"`) {
      character.inventory.splice(i, 1);
      await character.save();
      break;
    }
  }
  // Create offer
  await Marketplace.create(offer);
  res.redirect("/marketplace/select-offer/");
})


// BROWSE / BUY OFFER ROUTES
router.get("/marketplace/browse-offers/", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);
  // Variables
  const sessionName = req.session.user.username;
  const user = await User.find({username: sessionName}).populate("character");
  const currentUser = getUserWithoutHash(user[0]);
  const character = await Character.findOne({_id: currentUser.charId}).populate("inventory").populate("weapon").populate("artefact").populate("armor");

  const item = await Marketplace.find().populate("item").populate("owner");
  console.log("FROM BEFORE CLICK: ", item);
  res.render("marketplace/browse-offers", {session: loginCheck, sessionRace: [currentUser], character: character, item: item, errorMessage: ""})
})

router.post("/marketplace/buy-item/:offerId/:itemId/:ownerId", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);
  // Variables
  const sessionName = req.session.user.username;
  const user = await User.find({username: sessionName}).populate("character");
  const currentUser = getUserWithoutHash(user[0]);
  const character = await Character.findOne({_id: currentUser.charId}).populate("inventory").populate("weapon").populate("artefact").populate("armor");
  const offer = await Marketplace.findById(req.params.offerId).populate("item").populate("owner")
  const offerList = await Marketplace.find().populate("item").populate("owner");
  try {
    // Inventory check
    if (character.inventory.length < 6) {
      // Souls check
      if (parseInt(character.souls) >= parseInt(offer.price)) {
        // Update Player
        const item = await Item.findById(req.params.itemId);
        const newPlayerSouls = parseInt(character.souls) - parseInt(offer.price);
        character.souls = newPlayerSouls;
        character.inventory.push(item);
        await character.save();
        // Update Seller
        const seller = await Character.findById(req.params.ownerId);
        const newSellerSouls = parseInt(seller.souls) + parseInt(offer.price);
        seller.souls = newSellerSouls;
        await seller.save();
        // Remove Offer
        await Marketplace.findByIdAndDelete(req.params.offerId);
        res.redirect("/marketplace/browse-offers");
      } else {
        res.render("marketplace/browse-offers", {session: loginCheck, sessionRace: [currentUser], character: character, item: offerList, errorMessage: "You can't afford this item!"})
      }
    } else {
      res.render("marketplace/browse-offers", {session: loginCheck, sessionRace: [currentUser], character: character, item: offerList, errorMessage: "Your inventory is full!"})
    }
  } catch (error) {
    console.log("Error: ", error);
    res.render("marketplace/browse-offers", {session: loginCheck, sessionRace: [currentUser], character: character, item: offerList, errorMessage: "Error buying the item, please try again!"})
  }
})

router.post("/marketplace/remove-offer/:offerId/:itemId", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);
  // Variables
  const sessionName = req.session.user.username;
  const user = await User.find({username: sessionName}).populate("character");
  const currentUser = getUserWithoutHash(user[0]);
  const character = await Character.findOne({_id: currentUser.charId}).populate("inventory").populate("weapon").populate("artefact").populate("armor");
  const offerList = await Marketplace.find().populate("item").populate("owner");
  // Inventory check
  if (character.inventory.length < 6) {
    // Retrieve item
    const offer = await Marketplace.findById(req.params.offerId).populate("item").populate("owner")
    const item = await Item.findById(req.params.itemId);
    // Character ID check
    if (JSON.stringify(offer.owner._id), " VS ", `"${character._id}"`) {
      // Return to inventory, delete offer and save character
      await Marketplace.findByIdAndDelete(req.params.offerId);
      character.inventory.push(item);
      await character.save();
      res.redirect("/marketplace/browse-offers");
    }
  } else {
    res.render("marketplace/browse-offers", {session: loginCheck, sessionRace: [currentUser], character: character, item: offerList, errorMessage: "Your inventory is full!"})
  }
})

module.exports = router;