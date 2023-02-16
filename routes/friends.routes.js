const express = require('express');
const { isLoggedIn } = require('../middleware/route-guard');
const Character = require('../models/Character.model');
const Item = require('../models/Item.model');
const Message = require('../models/Message.model');
const router = express.Router();
const User = require('../models/User.model');

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
        friends: user.friends,
        messages: user.messages,
        _id: charId
    }
}

function generateFriendRequestMessage(recipient, sender) {
  const subject = `Friend Request From ${sender.username}`;
  const textBody = `Hi there, ${recipient.username}! ${sender.username} wants to add you to their friends list. Do you accept?`;
  const messageType = "friendrequest";
  return {
    recipient: recipient._id,
    sender: sender.id,
    subject: subject,
    textBody: textBody,
    messageType: messageType
  }
}

function generateNewMessage(recipient, sender, subject, body, attachment) {
  return {
    recipient: recipient._id,
    sender: sender.id,
    subject: subject,
    textBody: body,
    attachment: attachment,
    messageType: "message",
  }
}

// MAIN PAGE
router.get("/friends", isLoggedIn, async (req, res, next) => {
    checkLogin(req.session.user);
    const sessionName = req.session.user.username;
    const user = await User.find({username: sessionName}).populate("character")
    .populate({
      path: "messages",
      populate: {
        path: "sender",
        model: "User"
      },
      populate: {
        path: "attachment",
        model: "Item"
      }
    })
    .populate({
      path: "friends",
      populate: {
        path: "character",
        model: "Character"
      }
    });
    console.log("FRIEND: ", user)

    const currentUser = getUserWithoutHash(user[0]);
    const character = await Character.findById(currentUser.charId).populate("inventory");
    const searchTerm = "";
    
    res.render("friends", {session: loginCheck, sessionRace: [currentUser], currentUser: currentUser, character: character, searchResult: "", searchTerm: searchTerm, errorMessage: ""});
}); 

// FIND FRIEND
router.post("/friends/find", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);
  const sessionName = req.session.user.username;
  const user = await User.find({username: sessionName}).populate("character").populate("friends");
  const currentUser = getUserWithoutHash(user[0]);
  const character = await Character.findById(currentUser.charId).populate("inventory");
  const searchTerm = req.body.searchTerm;
  const searchResult = await User.findOne({username: searchTerm});

  let inFriendsList = false;
  // Check if user is already in friends list
  if (searchResult !== null) {
    for (let i = 0; i < user[0].friends.length; i++) {
      if (JSON.stringify(currentUser.friends[i]._id) === `"${searchResult._id}"`) {
        inFriendsList = true;
        break;
      }
    }
  }

  if (searchTerm !== "" || searchResult === null) {
    res.render("friends", {session: loginCheck, sessionRace: [currentUser], currentUser: currentUser, character: character, searchTerm: searchTerm, searchResult: searchResult, inFriendsList: inFriendsList, errorMessage: ""});
  } else {
    res.render("friends", {session: loginCheck, sessionRace: [currentUser], currentUser: currentUser, character: character, searchTerm: searchTerm, searchResult: searchResult, inFriendsList: inFriendsList, errorMessage: "Please enter a username."});
  }
});

router.post("/friends/addRequest/:userId", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);
  const sessionName = req.session.user.username;
  const user = await User.find({username: sessionName}).populate("character").populate("friends");
  const currentUser = getUserWithoutHash(user[0]);
  const character = await Character.findById(currentUser.charId).populate("inventory");
  const searchTerm = "";

  try {
    // Send friend request
    const recipient = await User.findById(req.params.userId);
    const friendRequest = generateFriendRequestMessage(recipient, currentUser);
    const newFriendRequest = await Message.create(friendRequest);
    recipient.messages.unshift(newFriendRequest);
    await recipient.save();
    res.render("friends", {session: loginCheck, sessionRace: [currentUser], currentUser: currentUser, character: character, searchResult: searchResult, searchTerm: searchTerm, errorMessage: ""});
  } catch (error) {
    console.log("Error sending friends request: ", error)
    res.redirect("/friends")
  }
}); 




// ACCEPT
router.post("/friends/acceptRequest/:messageId/:senderId", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);
  const sessionName = req.session.user.username;
  const user = await User.find({username: sessionName}).populate("character").populate("friends");
  const currentUser = getUserWithoutHash(user[0]);
  const character = await Character.findById(currentUser.charId).populate("inventory");
  const searchTerm = "";

  try { 
    // Accept request
    const friendRequest = await Message.findById(req.params.messageId);
    const newFriend = await User.findById(req.params.senderId);

    // Update friends lists
    newFriend.friends.push(user[0]._id);
    user[0].friends.push(newFriend._id);

    // Find friend request message index
    let msgIndex = 0;
    for (let i = 0; i < user[0].messages.length; i++) {
      if (JSON.stringify(friendRequest._id) === `"${req.params.messageId}"`) {
        msgIndex = i;
        break;
      }
    }
    
    // Remove friend request from array
    user[0].messages.splice(msgIndex, 1);

    // Save 
    await newFriend.save();
    await user[0].save();
    await Message.findByIdAndDelete(req.params.messageId);

    res.redirect("/friends");
  } catch (error) {
    console.log("Error sending friends request: ", error);
    res.redirect("/friends");
  }
}); 


// REJECT FRIEND REQUEST
router.post("/friends/rejectRequest/:messageId", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);
  const sessionName = req.session.user.username;
  const user = await User.find({username: sessionName}).populate("character").populate("friends");

  try {
    // Find friend request message index
    let msgIndex = 0;
    const friendRequest = await Message.findById(req.params.messageId);
    for (let i = 0; i < user[0].messages.length; i++) {
      if (JSON.stringify(friendRequest._id) === `"${req.params.messageId}"`) {
        msgIndex = i;
        break;
      }
    }
    user[0].messages.splice(msgIndex, 1);
    await user[0].save();
    // Delete message
    await Message.findByIdAndDelete(req.params.messageId);
    res.redirect("/friends");
  } catch (error) {
    console.log("Error rejecting request: ", error);
    res.redirect("/friends");
  }
}); 


// SEND NEW MESSAGE
router.get("/friends/newMessage/:friendId", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);
  const sessionName = req.session.user.username;
  const user = await User.find({username: sessionName}).populate("character").populate("friends");
  const currentUser = getUserWithoutHash(user[0]);
  const character = await Character.findById(currentUser.charId).populate("inventory");
  const friend = await User.findById(req.params.friendId);
  const att = false;
  const content = {
    subject: req.body.subject,
    body: req.body.textBody,
  }
  const rendering = "newmessage";

  try { 
    res.render("friends/new-message", {session: loginCheck, sessionRace: [currentUser], currentUser: currentUser, character: character, friend: friend, content: content, item: null, attachment: att, rendering: rendering, errorMessage: ""});
  } catch (error) {
    console.log("Error creating new message: ", error);
    res.redirect("/friends");
  }
}); 

// SEND NEW MESSAGE ATTACHMENT
router.post("/friends/newMessage/:friendId/att/", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);
  console.log("CONTENT AFTER HIT: ", req.body);
  const sessionName = req.session.user.username;
  const user = await User.find({username: sessionName}).populate("character").populate("friends");
  const currentUser = getUserWithoutHash(user[0]);
  const character = await Character.findById(currentUser.charId).populate("inventory");
  const friend = await User.findById(req.params.friendId);
  const content = {
    subject: req.body.subject,
    body: req.body.textBody,
  }
  const rendering = "newmessage";

  try {
    let attachedItem;
    if (Object.keys(req.body).includes("attachmentBtn")) {
      console.log("ARRIVED HERE 1");
      attachedItem = null;
      res.render("friends/new-message", {session: loginCheck, sessionRace: [currentUser], currentUser: currentUser, character: character, friend: friend, content: content, attachedItem: null, attachment: true, item: attachedItem, rendering: rendering, errorMessage: ""});
    }
    // ATTACH ITEM
    let itemId = "";

    if (Object.keys(req.body).includes("attachItemBtn")) {
      console.log("ARRIVED HERE 2", req.body);
      itemId = req.body.attachItemBtn;
      attachedItem = await Item.findById(itemId);
      res.render("friends/new-message", {session: loginCheck, sessionRace: [currentUser], currentUser: currentUser, character: character, friend: friend, content: content, attachment: true, item: attachedItem, rendering: rendering, errorMessage: ""});
    }
    // REMOVE ATTACHMENT
    if (Object.keys(req.body).includes("removeAttachedItemBtn")) {
      console.log("ARRIVED HERE 3", req.body);
      attachedItem = null;
      res.render("friends/new-message", {session: loginCheck, sessionRace: [currentUser], currentUser: currentUser, character: character, friend: friend, content: content, attachment: true, item: attachedItem, rendering: rendering, errorMessage: ""});
    }
    // SEND MESSAGE
    if (Object.keys(req.body).includes("sendBtn")) {
      console.log("ARRIVED HERE 4", req.body.attachedItem);
      const friend = await User.findById(req.params.friendId);
      // Remove item if attachment
      if (Object.keys(req.body).includes("attachmentcheck")) { // WITH ATTACHMENT PATH
        // Find Item in inventory
        let itemIndex = 0;
        for (let i = 0; i < character.inventory.length; i++) {
          if (JSON.stringify(character.inventory[i]._id) === `"${req.body.attachedItem._id}"`) {
            itemIndex = i;
            break;
          }
        }
        // Remove item from inventory
        character.inventory.splice(itemIndex, 1);
        await character.save();
        // Send message
        const message = generateNewMessage(friend, currentUser, req.body.subject, req.body.textBody, req.body.attachedItem);
        const newMessage = await Message.create(message);
        friend.messages.unshift(newMessage._id);
        await friend.save();
      } else { // WITHOUT ATTACHMENT PATH
        const message = generateNewMessage(friend, currentUser, req.body.subject, req.body.textBody);
        const newMessage = await Message.create(message);
        friend.messages.unshift(newMessage._id);
        await friend.save();
      }
      res.redirect("/friends");
    }
  } catch (error) {
    console.log("Error sending message: ", error);
    res.redirect("/friends")
  }
}); 

// CLAIM ATTACHMENT
router.post("/friends/claim-attachment/:messageId", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);
  const sessionName = req.session.user.username;
  const user = await User.find({username: sessionName}).populate("character").populate("friends");
  const currentUser = getUserWithoutHash(user[0]);
  const character = await Character.findById(currentUser.charId).populate("inventory");

  try { 
    // Get message and attachment
    const message = await Message.findById(req.params.messageId).populate("attachment");
    // Inventory check
    if (character.inventory.length < 6) {
      const attachment = message.attachment.pop();
      character.inventory.push(attachment._id);
      await message.save();
      await character.save();
      res.redirect("/friends");
    } else {
      res.render("friends", {session: loginCheck, sessionRace: [currentUser], currentUser: currentUser, character: character, searchResult: "", searchTerm: searchTerm, errorMessage: "Not enough space in your inventory!"});
    }
  } catch (error) {
    console.log("Error receiving attachment: ", error);
    res.redirect("/friends");
  }
}); 

module.exports = router;
