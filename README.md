<div align="center">

# ![](img/hourglass.png) ~ ~ ~ BOHUN UPAS ~ ~ ~ ![](img/hourglass.png)

## ! IMPORTANT INFORMATION ! 
1 - After the game has started and you're in the first level, click anywhere on the game canvas so it functions properly.
<br>
2 - Best performance is on FireFox where the canvas sprite flickering is reduced to a minimum, however, at times enemy sprites do not load. If this is the case, change to a different full-screen window for 2 - 3 seconds (the game will pause) and switch back.

<br><br><br>

</div>


## What is this project?
This project was created by Charlie Fernandez Trestini and Maik Schmidt as the 2nd Project for the Ironhack Full-Stack Web Development - Remote Bootcamp JAN 2023 cohort.

# === The Website ===

## Landing Page:
See news about upcoming features, events and more. Click on "Play Now" to be presented with the sign-up page.

## Auth Pages:
- "Enter Username" page: If the Username entered is recognized as registered, you are redirected to the login page, otherwise you will be presented with the sign-up page.
- Sign-up page: Create an account with unique username and email address, enter your password twice to ensure correct input
- Login page: Enter as a registered user
- Logout: Post-route only removing the session

## Other pages and features:
Character Profile page:
- Manage your inventory and equipped items
- See your character level and level up if enough experience obtained
- See beautiful, rotating 3D model of your current race designed by Charlie

Soulkeeper page:
- Sell items from your inventory
- Buy one of three different item packs for souls that grant different items based on randomized drop chances for armor and weapons
- (Choose while looking at fantastic 3D models with animation on hovering)

Marketplace page:
- Create an offer: Determine an amount of souls to offer the item for. Post it to the marketplace for other players to see and buy
- View your offers: Get an overview over all the items you currently have on the marketplace
- Browse offers: See all items currently available on the marketplace posted by yourself and other players, filter for item type and sort by increasing / decreasing soul price

Friends page:
- Search for friends by username. Find a unique result and request to add them to your friends list
- Accept friend requests to add each other to your friends lists
- Once added friends, send messages between each other
- Messages may or may not include attachments which are items from your inventory, so items can be swapped this way

Settings page:
- Get an overview over your Character and a quick link to access the Character Profile page
- Get a quick link to your Friends page
- Update account details (username, email and password)

<br><br><br>

# === The Game ===

## === Story ===
You join the world as one of three different races: Dino, Undead or Human. A dead farmer's soul cannot find peace as his personal task in the family heritage obligations has not been completed: A magical seed needs to be planted by each member of the family's bloodline to preserve the earth. This farmer's task is to find the magical seed of "Bohun Upas" which his ancestors appear to have hidden in the dangerous volcanic mountains to end the bloodline, considering this sacred obligation a curse. It is up to you to ensure this farmer's soul finds peace. 

#### Controls:
- W             | Move Up
- A             | Move Left
- S             | Move Down
- D             | Move Right
- Arrow Up      | Shoot Up
- Arrow Left    | Shoot Left
- Arrow Down    | Shoot Down
- Arrow Right   | Shoot Right
- (Combine directional arrows to shoot diagonally)

<br><br>

## === Gameplay ===
Defeat enemies: 
- Collect experience to level up in the Character menu to become stronger
- Gather souls to purchase items in the Soulkeeper shop
Progress:
- Make a decision on whether or not you want to go on and risk losing XP and souls gathered in your current run
- If so, risk losing it (Health bar at the bottom of the canvas)
- If not, return to town through the portal to save your progress 

## === The Game Canvas ===
See your equipped weapon and armor, your souls and experience and a rotating 3D map of the current area you're in. All models and in-game graphics are hand-crafted.

<br><br>

## === Character ===
Level up:
- Gain more HP
- Gain more Strength

Equipment:
- Equip weapons with different unique behaviors to deal more damage
- Equip armor to receive less damage

<br><br>


_________________________________________________________________________________________________

<br><br>

## === Game and Website Structure in VS Project ===
(Created with Ironlauncher WITHOUT auths)

### Folder Organization (apart from standards with template)
middleware: Contains the isLoggedIn and isLoggedOut middleware included in all route paths
<br>
models: Contains the different models / schemas:
- Character Model: contains information about the race, souls, inventory (array of Object IDs), equipped weapon, armor and artefact, achievements, character level and experience. Always attached to User model
- Item Model: contains information about the different item types and their values
- Marketplace Model: takes care of all the offered and purchased items between players on marketplace
- Message Model: delivers instantaneous messages to player with or without attachment
- User Model: main user profile with session cookies and has Character model attached to it
<br>
partials: includes repeated code for inventory, items and the nav bar to be called wherever needed
<br>
public: contains all game elements and connects canvas with ejs
<br>
routes: contains all the routes and takes care of all the elements

### ...