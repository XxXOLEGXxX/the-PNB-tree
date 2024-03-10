let modInfo = {
	name: "The PNB Tree",
	id: "plotnothingbloontonium",
	author: "Oleg (fuckyousegabutdeezcord)",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "fuckyousegabutdeezcord",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.2",
	name: "Multitree Confirmed...?",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.2: Multitree Confirmed...?</h3><br>
		- Finished adding Shenanigans Tree's early game content, which includes:
		<h5>- Impatience tab.<br>
        - Two more challenges<br>
        - Cool upgrades</h5>
        - Polished the game itself.<br><br>
	<h3>v0.1: Literally plot</h3><br>
		- Added Shenanigans Tree's early game, partially.<br>
		- Added PNB layer.<br>
        - idk bro go play dynas tree instead.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

function boughtUpgrades(id,rows,cols){
    let total = new Decimal(0)
    for(let i=1;i<rows+1;i++){
        for(let v=1;v<cols+1;v++){
            if(player[id].upgrades.includes(i*10+v)) total=total.add(1)
        }
    }
    return total
}

function impatienceUpgrades(){
    let bozo = new Decimal(0)
        for(let i=1;i<3;i++){
            for(let v=1;v<5;v++){
                if(player.st.upgrades.includes("impatience"+(i*10+v))) bozo = bozo.add(1)
            }
        }
    return bozo
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(hasUpgrade("idk", 11)?1:0)
    if(hasUpgrade("idk",12)) gain = gain.add(1)
    if(hasUpgrade("idk",13)) gain = gain.add(1)
    if(hasUpgrade("idk",21)) gain = gain.add(4)
    if(hasUpgrade("idk",22)) gain = gain.add(4)
    if(hasUpgrade("idk",23)) gain = gain.add(4)
    if(hasUpgrade("st",11)) gain = gain.mul(upgradeEffect("st",11))
    if(hasUpgrade("st",23)) gain = gain.mul(tmp.st.upgrades[23].effect)
    if(hasAchievement("a",13)) gain = gain.mul(player.st.points.add(1).root(10).sub(1).add(player.st.plots.add(1).root(10).sub(1)).add(1))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}