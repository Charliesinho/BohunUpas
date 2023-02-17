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
        character: user.character,
        _id: charId
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


// VIEW OWN OFFERS
router.get("/marketplace/view-own-offers/", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);
  // Variables
  const sessionName = req.session.user.username;
  const user = await User.find({username: sessionName}).populate("character");
  const currentUser = getUserWithoutHash(user[0]);
  const character = await Character.findOne({_id: currentUser.charId}).populate("inventory").populate("weapon").populate("artefact").populate("armor");
  const rendering = "marketplace-view-own-offers";
  const filter = req.query;
  // Get items and sort
  let item;
  if (JSON.stringify(filter).includes("SortPriceIncreasing")) {
    item = await Marketplace.find().populate("item").populate("owner").sort({price: 1});
  } else if (JSON.stringify(filter).includes("SortPriceDecreasing")) {
    item = await Marketplace.find().populate("item").populate("owner").sort({price: -1});
  } else {
    item = await Marketplace.find().populate("item").populate("owner");
  }

  let itemCounter = 0;
  if (item.length) {
    for (let i = 0; i < item.length; i++) {
      if (JSON.stringify(item[i].owner._id) === `"${currentUser.charId}"`) {
        itemCounter++;
      }
    }
  }
  // Filter browse items
  let filterResults = 0;
  for (let i = 0; i < item.length; i++) {
    if (filter.hasOwnProperty(item[i] .item.type)) filterResults++;
  }
  if (filterResults === 0) filterResults = item.length; 
  console.log("YOU ARE HERE")
  res.render("marketplace/view-own-offers", {session: loginCheck, sessionRace: [currentUser], character: character, item: item, filter: filter, itemCounter: itemCounter, filterResults: filterResults, errorMessage: ""})
})


// BROWSE / BUY OFFER ROUTES
router.get("/marketplace/browse-offers/", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);
  // Variables
  const sessionName = req.session.user.username;
  const user = await User.find({username: sessionName}).populate("character");
  const currentUser = getUserWithoutHash(user[0]);
  const character = await Character.findOne({_id: currentUser.charId}).populate("inventory").populate("weapon").populate("artefact").populate("armor");
  const filter = req.query;
  // Get items and sort
  let item;
  if (JSON.stringify(filter).includes("SortPriceIncreasing")) {
    item = await Marketplace.find().populate("item").populate("owner").sort({price: 1});
  } else if (JSON.stringify(filter).includes("SortPriceDecreasing")) {
    item = await Marketplace.find().populate("item").populate("owner").sort({price: -1});
  } else {
    item = await Marketplace.find().populate("item").populate("owner");
  }

  // Filter browse items
  let filterResults = 0;
  for (let i = 0; i < item.length; i++) {
    if (filter.hasOwnProperty(item[i] .item.type)) filterResults++;
  }
  if (filterResults === 0) filterResults = item.length; 

  res.render("marketplace/browse-offers", {session: loginCheck, sessionRace: [currentUser], character: character, item: item, filter: filter, filterResults: filterResults, errorMessage: ""})
})


router.get("/marketplace/browse-offers/:offerId/err", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);
  // Variables
  const sessionName = req.session.user.username;
  const user = await User.find({username: sessionName}).populate("character");
  const currentUser = getUserWithoutHash(user[0]);
  const character = await Character.findOne({_id: currentUser.charId}).populate("inventory").populate("weapon").populate("artefact").populate("armor");
  const filter = req.query;
  const offerList = await Marketplace.find().populate("item").populate("owner");
  const offer = await Marketplace.findById(req.params.offerId);

  let filterResults = 0;
  for (let i = 0; i < offerList.length; i++) {
    if (filter.hasOwnProperty(offerList[i] .item.type)) filterResults++;
  }
  if (filterResults === 0) filterResults = offerList.length; 

  try {
    if (character.inventory.length > 5) {
      res.render("marketplace/browse-offers", {session: loginCheck, sessionRace: [currentUser], character: character, item: offerList, filter: filter, filterResults: filterResults, errorMessage: "Your inventory is full!"})
    } else if (parseInt(character.souls) < parseInt(offer.price)) {
      res.render("marketplace/browse-offers", {session: loginCheck, sessionRace: [currentUser], character: character, item: offerList, filter: filter, filterResults: filterResults, errorMessage: "You can't afford this item!"})
    }
  } catch(error) {
    console.log("Error: ", error);
  }
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
  const filter = req.query;

  let filterResults = 0;
  for (let i = 0; i < offerList.length; i++) {
    if (filter.hasOwnProperty(offerList[i] .item.type)) filterResults++;
  }
  if (filterResults === 0) filterResults = offerList.length; 

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
        res.redirect("/marketplace/browse-offers/" + req.params.offerId + "/err");
      }
    } else {
      res.redirect("/marketplace/browse-offers/" + req.params.offerId + "/err");
    }
  } catch (error) {
    console.log("Error: ", error);
    res.render("marketplace/browse-offers", {session: loginCheck, sessionRace: [currentUser], character: character, item: offerList, filter: filter, filterResults: filterResults, errorMessage: "Error buying the item, please try again!"})
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
  const filter = req.query;
  console.log(req.params);

  let filterResults = 0;
  for (let i = 0; i < offerList.length; i++) {
    if (filter.hasOwnProperty(offerList[i] .item.type)) filterResults++;
  }
  if (filterResults === 0) filterResults = offerList.length; 
  // Inventory check
  if (character.inventory.length < 6) {
    // Retrieve item
    const offer = await Marketplace.findById(req.params.offerId).populate("item").populate("owner")
    const item = await Item.findById(req.params.itemId);
    // Character ID check
    if (JSON.stringify(offer.owner._id), " VS ", `"${character._id}"`) {
      // Return to inventory, delete offer and save character
      character.inventory.push(item._id);
      await character.save();
      await Marketplace.findByIdAndDelete(req.params.offerId);
      res.redirect("/marketplace/view-own-offers");
    }
  } else {
    res.render("marketplace/view-own-offers", {session: loginCheck, sessionRace: [currentUser], character: character, item: offerList, filter: filter, filterResults: filterResults, errorMessage: "Your inventory is full!"})
  }
})

module.exports = router;