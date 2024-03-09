addLayer("st", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        plots: new Decimal(0),
        marionetteMeter: new Decimal(15),
    }},
    update(diff){
        if(hasUpgrade("idk",13)) player.st.plots = player.st.plots.add(tmp.st.plotGenerate.mul(diff))
        if(inChallenge("st",11)) player.st.marionetteMeter = player.st.marionetteMeter.sub(diff).max(0)
        if(player.st.marionetteMeter.eq(0)) {
            document.getElementById("idAudio1").pause()
			document.getElementById("idAudio1").currentTime = 0
            document.getElementById("idAudio2").play()
        }
    },
	buyables: {
		musicBox: {
			title(){return `<h1>${format(player.st.marionetteMeter)} / 15`},
			display() { return player.st.marionetteMeter.lt(4)? "<h1>DANGER!":"" },
			canAfford() { return player.st.marionetteMeter.gt(0) },
			buy() {
				player.st.marionetteMeter = player.st.marionetteMeter.add(player.st.marionetteMeter.div(10+(10/9*7)).add(0.1)).min(15)
			},
			style(){return{'height':'100px', 'width':'500px', "background":"linear-gradient(to right, rgba("+format(new Decimal(10).sub(player.st.marionetteMeter).max(0).pow(2.5).add(100))+","+format(new Decimal(10).sub(player.st.marionetteMeter).max(0).pow(1.85).add(50))+","+format(new Decimal(10).sub(player.st.marionetteMeter).max(0).pow(1.85).add(50))+",1), rgba("+format(new Decimal(10).sub(player.st.marionetteMeter).max(0).pow(2.5).add(100))+","+format(new Decimal(10).sub(player.st.marionetteMeter).max(0).pow(1.85).add(50))+","+format(new Decimal(10).sub(player.st.marionetteMeter).max(0).pow(1.85).add(50))+",1) "+format(player.st.marionetteMeter.mul(6.666666667))+"%, rgba(0,0,0,0) "+format(player.st.marionetteMeter.mul(6.666666667))+"%, rgba(0,0,0,0)"}},
			unlocked(){return true}
		},
	},
    resetDescription: "Obliterate your plots for ",
    nodeStyle(){
       return {
                "background-origin": "border-box",
                animation: 'orbit 8.120116994196762s infinite linear', // Rotation animation
                position: "absolute",
                top: "40%",
                left: "45.6%",
            }  
    },
    plotGenerate(){
        let gain = new Decimal(1/60)
        if(hasUpgrade("st",11)) gain = gain.mul(upgradeEffect("st",11))
        if(hasUpgrade("st",12)) gain = gain.mul(upgradeEffect("st",12))
        if(hasUpgrade("st",23)) gain = gain.mul(tmp.st.upgrades[23].effect2)
        if(hasUpgrade("st",31)) gain = gain.mul(tmp.st.upgrades[31].effect2)
        
        if(inChallenge("st",11)) gain = gain.tetrate(new Decimal(0.5).root(new Decimal(7).sub(player.st.marionetteMeter).max(1)))
        return gain
    },
    tabFormat: {
        Shenanigans: {
            content: [["display-text", function(){return `You have <h2 style="color: #791C29; text-shadow: #791C29 0px 0px 10px;">${formatWhole(player.st.points)}</h2> shenanigans`}],"blank","prestige-button",["display-text", function(){return `You have ${formatWhole(player.st.plots)} plots<br>You are generating ${format(tmp.st.plotGenerate)} plots`}],"blank",["buyable", "musicBox"],"blank","upgrades","blank","blank","challenges"],
            unlocked(){return false}
        },
        Impatience: {
            content: [["display-text", function(){return "no"}]],
            buttonStyle(){return{"border-color":"red","color":"red"}},
            unlocked(){return false}
        }
    },
    upgrades: {
        11: {
            title: "Obligatory funny number reference.",
            effect(){
                let gain = new Decimal(1.69)
                if(hasUpgrade("st",32)) gain = gain.pow(1.42).tetrate(1.42)
                return gain
            },
            description(){return `Boosts point and plot gain by x${format(this.effect())}.`},
            cost: new Decimal(1),
        },
        12: {
            title(){return `EVERY<br><p style='position: absolute; left: -${format(hasUpgrade("st",22)?13:23)}%; top: 15%; transform: scale(${format(hasUpgrade("st",22)?0.75:0.6)}, 1)'>player.x.points.add(1).root(2)</p><br>EVER.`},
            description: "Boosts plot gain based on shenangains.",
            effect(){return player.st.points.add(1).root(2).pow(hasUpgrade("st",21)?upgradeEffect("st",21):1)},
            effectDisplay(){return format(this.effect())+"x"},
            cost: new Decimal(2),
            unlocked(){return hasUpgrade("st",11)}
        },
        21: {
            title: "Finally. A good exponent upgrade.",
            description: "Exponents 2nd Shenanigans upgrade's effect based on bought upgrades.",
            effect(){return new Decimal(1).add(Decimal.mul(0.05, player.st.upgrades.length))},
            effectDisplay(){return "^"+format(this.effect())},
            cost: new Decimal(5),
            unlocked(){return hasUpgrade("st",11)}
        },
        22: {
            title: "Hexagon-inator. Literally.",
            description: "Turns every single upgrade in this tab into hexagons and unlocks a challenge.",
            cost: new Decimal(52),
            unlocked(){return hasUpgrade("st",11)} 
        },
        23: {
            title: "Convenient double P synergy.",
            description: "Points and plots boosts each other's gain.",
            effect(){return player.st.plots.add(1).root(6)},
            effect2(){return player.points.add(1).root(9)},
            effectDisplay(){return`Point: ${format(this.effect())}x<br>Plots: ${format(this.effect2())}x`},
            cost: new Decimal(9),
            unlocked(){return hasUpgrade("st",22) || hasUpgrade("st",12)}
        },
        31: {
            title: "Peanut Jelly Time!",
            description(){return (hasAchievement("a",12)?"Ps":"")+" boosts Shenanigans and plot gain."},
            effect(){return player.idk.points.add(1).root(60)},
            effect2(){return player.idk.points.add(1).root(10)},
            effectDisplay(){return`Shenanigans: ${format(this.effect())}x<br>Plots: ${format(this.effect2())}x`},
            cost: new Decimal(15),
            unlocked(){return hasUpgrade("st",21) || hasUpgrade("st",22)}
        },
        32: {
            title: "Get funny.",
            description: "1st Shenanigans upgrade is raised and tetrated to the power of 1.42.",
            cost: new Decimal(22),
            unlocked(){return hasUpgrade("st",22) || hasUpgrade("st",23) || hasUpgrade("st",31)}
        },
    },
    color: "#791C29",
    tooltip(){return `Shenanigans Tree<h5>${format(player.st.plots)} plots`},
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "shenanigans", // Name of prestige currency
    baseResource: "plots", // Name of resource prestige is based on
    baseAmount() {return player.st.plots}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade("st",31)) mult = mult.mul(tmp.st.upgrades[31].effect)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return hasUpgrade("idk",13)},
    doReset(resettingLayer){
        if(tmp[resettingLayer].layer=="st"){
            player.st.plots = new Decimal(0)
        }
    },
    challenges: {
		11: {
			name: "Typical Challenge...<h4>or is it?",
			challengeDescription(){return "Your plot gain is tetrated by 0.5 initially and there's a music box you need to wind up. Tetration gets nerfed the less winded up music box is (starting from 6 seconds left), but it gets harder to wind it back up."},
			canComplete: function() {return player.st.plots.gte(1000) && player.st.marionetteMeter.gt(0)},
            onEnter(){
                player.st.marionetteMeter = new Decimal(15)
                document.getElementById("idAudio1").play()
            },
            onExit(){
                player.st.marionetteMeter = new Decimal(15)
                document.getElementById("idAudio1").pause()
                document.getElementById("idAudio1").currentTime = 0
                document.getElementById("idAudio2").pause()
                document.getElementById("idAudio2").currentTime = 0
            },
			goalDescription(){return "1,000 plots"},
            rewardDescription(){return "Endgame (NO CONTENT?)"},
			fullDisplay(){return `${this.challengeDescription()}<br>Goal: ${this.goalDescription()}<br>Reward: ${this.rewardDescription()}`},
            style(){return{"background-color":player.st.marionetteMeter.eq(0)?"#993333":""}}
		},
    },
    componentClasses:{
        "upgrade"(){return{"hexagon":hasUpgrade("st",22)}}
    },
    componentStyles:{
        "upgrade"(){return{"width":hasUpgrade("st",22)?"140px":"120px","height":hasUpgrade("st",22)?"100px":"120px"}}
    },
})

addLayer("str", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S2", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    nodeStyle(){
       return {
                "background-origin": "border-box",
                animation: 'orbat 22.07276647028654s infinite linear', // Rotation animation
                position: "absolute",
                boxShadow: '0 0 10px 2px #ffffff',
                top: "40%",
                left: "45.6%",
            }  
    },
    componentClasses:{
        "upgrade"(){return{"hexagon":false}}
    },
    color: "#bbbbbb",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return false}
})

addLayer("stn", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S3", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    nodeStyle(){
       return {
                "background-origin": "border-box",
                animation: 'orbot 60s infinite linear', // Rotation animation
                position: "absolute",
                boxShadow: '0 0 10px 2px #ffffff',
                top: "40%",
                left: "45.6%",
            }  
    },
    componentClasses:{
        "upgrade"(){return{"hexagon":false}}
    },
    color: "#bbbbbb",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return false}
})

addLayer("idk", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol(){return hasAchievement("a",12)?"P":""}, // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    nodeStyle(){
       return {
                position: "absolute",
                top: "40%",
                left: "45.6%",
            }  
    },
    color: "#eeeeee",
    requires(){return player.idk.points.lt(1) && !hasUpgrade("idk",11) ? new Decimal(0) : new Decimal(10)}, // Can be a function that takes requirement increases into account
    resource(){return hasAchievement("a",12)?"Ps":""}, // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    canReset(){return player.points.gte(10) || (player.idk.points.lt(1) && !hasUpgrade("idk",11))},
    prestigeButtonText(){return player.idk.points.lt(1) && !hasUpgrade("idk",11) ? `Reset for +${formatWhole(getResetGain("idk"))} ${tmp.idk.resource}<br><br>You have ${formatWhole(new Decimal(60).sub(player.idk.points.mul(60)))} free resets left` : `Reset for +${formatWhole(getResetGain("idk"))} ${tmp.idk.resource}<br><br>Next at ${formatWhole(new Decimal(10).pow(getResetGain("idk").add(1)))} points`},
    type: "exponential", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    branches: ["st","str","stn"],
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    doReset(resettingLayer){
        if(tmp[resettingLayer].layer=="idk"){
            player.points = new Decimal(0)
        }
    },
    componentClasses:{
        "upgrade"(){return{"hexagon":false}}
    },
    upgrades: {
        11: {
            title: "Underrated Propostriously Graduating Rapidly Accelerating Detrimental Experiment",
            description: "or U.P.G.R.A.D.E. for short. Increases base point generation by 1.",
            cost: new Decimal(1),
            onPurchase(){player.idk.points = new Decimal(0)}
        },
        12: {
            title: "Slightly Upper-handy Prestigious Excitingly Remanining Boostage",
            description: "Superb choice. Increases base point generation by 1.",
            cost: new Decimal(3),
            unlocked(){return hasUpgrade("idk",11)}
        },
        13: {
            title: "Plot Armor",
            description: "There are no title shenanigans this time around. Increases base point generation by 1 and unlocks a new layer.",
            cost: new Decimal(6),
            unlocked(){return hasUpgrade("idk",12)}
        }
    },
})

addLayer("a", {
    name: "achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "yellow",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none",
    tooltip: "Achievements",
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    tabFormat: {
        Achievements: {
            content: ["blank","blank","blank","achievements"]
        }
    },
    achievements: {
        11: {
            name: "The beginning of the beginning... again.",
            tooltip: "Begin a point generation",
            done(){return hasUpgrade("idk",11)}
        },
        12: {
            name: "Is that a motherfucking-",
            tooltip: "Perform a Shenanigans reset.",
            done(){return player.st.points.gte(1)},
            unlocked(){return hasUpgrade("idk",13)}
        },
        13: {
            name: "Yo dawg. I heard you like every 60 seconds a minute passes memes.",
            tooltip(){return "Reach 60 plots.<br>Reward: You gain more points based on plots and shenanigans<h5>(check "+tmp.idk.resource.replace("s","")+" layer)<br>Currently: x"+format(player.st.points.add(1).root(10).sub(1).add(player.st.plots.add(1).root(10).sub(1)).add(1))},
            done(){return player.st.plots.gte(60)},
            unlocked(){return hasAchievement("a",12)}
        }
    },
})

const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
@keyframes orbit {
    0% {
        transform: rotate(0deg) translateX(120px) rotate(0deg);
      }
      100% {
        transform: rotate(360deg) translateX(120px) rotate(-360deg);
      }
  }
  
@keyframes orbat {
    0% {
        transform: rotate(120deg) translateX(241px) rotate(-120deg);
      }
      100% {
        transform: rotate(-240deg) translateX(241px) rotate(240deg);
      }
  }
  
@keyframes orbot {
    0% {
        transform: rotate(240deg) translateX(365px) rotate(-240deg);
      }
      100% {
        transform: rotate(-120deg) translateX(365px) rotate(120deg);
      }
  }
  `;
document.head.appendChild(styleSheet);
