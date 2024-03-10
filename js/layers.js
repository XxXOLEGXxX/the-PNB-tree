addLayer("st", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        plots: new Decimal(0),
        marionetteMeter: new Decimal(15),
        bestMarionette: new Decimal(0),
        impatience: new Decimal(0.01),
        impatienceTimer: new Decimal(8),
        excessiveboredom: new Decimal(0),
        boredom: new Decimal(1),
    }},
    update(diff){
        if(hasUpgrade("idk",13)) player.st.plots = player.st.plots.add(tmp.st.plotGenerate.mul(diff))
        if(inChallenge("st",11)) player.st.marionetteMeter = player.st.marionetteMeter.sub(diff).max(0)
        if(inChallenge("st",21) && player.st.plots.gte(30)) player.str.canYouSeeMe = true
        if(player.st.marionetteMeter.eq(0)) {
            document.getElementById("idAudio1").pause()
			document.getElementById("idAudio1").currentTime = 0
            document.getElementById("idAudio2").play()
        }
        if(hasMilestone("st",1)) {
            player.st.impatience = player.st.impatience.add(impatienceUpgrades().mul(diff/100*3))
        }
        if(inChallenge("st",12)){
            player.st.impatience = player.st.impatience.mul(100).root(new Decimal(1).add(diff)).div(100).max(0.01)
            player.st.impatienceTimer = player.st.impatienceTimer.sub(diff)
        }
    },
    milestones: {
        0: {
			requirementDescription: "x2 Unpredicted Boredom effect",
			effectDescription(){return "Triple Unpredicted Boredom gain."},
            unlocked(){return hasChallenge("st",12)},
			done() { return player.st.impatience.gte(2) }
        },
        1: {
			requirementDescription: "x10 Unpredicted Boredom effect",
			effectDescription(){return "You passively gain one click worth of Unpredicted Boredom per second for each bought Impatience upgrade."},
            unlocked(){return hasChallenge("st",12)},
			done() { return player.st.impatience.gte(10) }
        },
        3: {
			requirementDescription: "x80 Unpredicted Boredom effect",
			effectDescription(){return "Plot gain is x60 better."},
            unlocked(){return hasChallenge("st",12)},
			done() { return player.st.impatience.gte(80) }
        },
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
			unlocked(){return inChallenge("st",11)}
		},
		impatience: {
			title(){return `Unpredicted Boredom.`},
			display() {return `"Aha, there's the problem!" You decide that by predicting said UBs, you may be able to partially restore your plot gain by clicking on this forbidden buyable.<br>Currently: x${format(player.st.impatience)}`},
			canAfford() { return true },
			buy() {
                if(player.st.excessiveboredom.gte(100)) player.st.boredom = player.st.boredom.div(1.01)
				player.st.impatience = player.st.impatience.add(hasMilestone("st",0)?0.03:0.01)
                if(player.st.impatienceTimer.gt(0)) player.st.impatienceTimer = new Decimal(8)
                if(inChallenge("st",12)) player.st.excessiveboredom = player.st.excessiveboredom.add(1)
			},
			style(){return{'background-color':'gray'}},
			unlocked(){return true}
		},
		boredom: {
			title(){return `Excessive Boredom.`},
			display() {return `"OLEG I'LL THROW YOU OFF THE CLI-" Suddenly, predicted boredoms are now clogging up your plot gain. Better start getting rid of those before it's too late...<br>Currently: ^${format(player.st.boredom)}`},
			canAfford() { return true },
			buy() {
                player.st.boredom = player.st.boredom.mul(1.05).min(1)
                if(player.st.impatienceTimer.gt(0)) player.st.impatienceTimer = new Decimal(8)
			},
			style(){return{'background-color':'darkred'}},
			unlocked(){return player.st.excessiveboredom.gte(100) && inChallenge("st",12)}
		},
        respecThis: {
			title(){return `Respec Impatience Upgrades.`},
			display() {return `(You'll keep your Shenanigans upgrades upon respec.)`},
			canAfford() { return true },
			buy() {
                player.st.upgrades = [11,12,13,21,22,23,24,31,32,33]
                player.st.points = new Decimal(0)
                player.st.plots = new Decimal(0)
                player.points = new Decimal(0)
                player.st.impatience = new Decimal(0.01)
			},
			style(){return{'background-color':'white','border-radius':'50%','width':'200px','height':'100px'}},
			unlocked(){return hasChallenge("st",12)}
            
        }
	},
    resetDescription: "Obliterate your plots for ",
    nodeStyle(){
       return {
                'width':'80px',
                'height':'80px',
                "background-origin": "border-box",
                animation: 'orbit 8.120116994196762s infinite linear', // Rotation animation
                position: "absolute",
                top: "40%",
                left: "45.6%",
            }  
    },
    plotGenerate(){
        let gain = new Decimal(1/60)
        if(hasUpgrade("idk",21)) gain = gain.add(1/60)
        if(hasUpgrade("idk",22)) gain = gain.add(1/60)
        if(hasUpgrade("idk",23)) gain = gain.add(1/60)
        if(hasUpgrade("st",11)) gain = gain.mul(upgradeEffect("st",11))
        if(hasUpgrade("st",12)) gain = gain.mul(upgradeEffect("st",12))
        if(hasUpgrade("st",23)) gain = gain.mul(tmp.st.upgrades[23].effect2)
        if(hasUpgrade("st",31)) gain = gain.mul(tmp.st.upgrades[31].effect2)
        if(hasMilestone("st",2)) gain = gain.mul(60)
        
        if(inChallenge("st",11)) gain = gain.pow(new Decimal(0.5).root(new Decimal(7).sub(player.st.marionetteMeter).max(1))).pow(new Decimal(0.5).root(new Decimal(7).sub(player.st.marionetteMeter).max(1)))
        if(inChallenge("st",12)||hasChallenge("st",12)) gain = gain.mul(player.st.impatience).pow(inChallenge("st",12)?player.st.boredom:1)
        if(inChallenge("st",21)) gain = gain.pow(0.000000000000000000000000000000000000000001).pow(0.000000000000000000000000000000000000000001)
        return gain
    },
    impatiencePoints(){
        return player.st.plots.mul(player.st.impatience).root(player.points.max(1000000).add(1).log(10).add(1))
    },
    tabFormat: {
        Shenanigans: {
            content: [["display-text", function(){return `You have <h2 style="color: #791C29; text-shadow: #791C29 0px 0px 10px;">${formatWhole(player.st.points)}</h2> shenanigans`}],"blank","prestige-button",["display-text", function(){return `You have ${formatWhole(player.st.plots)} plots<br>You are generating ${format(tmp.st.plotGenerate)} plots`}],"blank",["buyable", "musicBox"],"blank","upgrades","blank","blank","challenges"],
            unlocked(){return inChallenge("st",12) || hasChallenge("st",12)}
        },
        Impatience: {
            content: [["display-text",function(){return hasChallenge("st",12)?`You have <h2 style="color: red; text-shadow: red 0px 0px 10px;">${format(tmp.st.impatiencePoints)}</h2> convoluted points, which are based on your plots, Unpredicted Boredom's effect and points`:``}],["display-text",function(){return inChallenge("st",12)?player.st.impatienceTimer.lte(0)?`<h2 style="text-shadow: white 0px 0px 10px;">mimmimimimimir...`:` <h2 style="text-shadow: white 0px 0px 10px;">${format(player.st.impatienceTimer)}</h2> seconds left...<h5>(you can reset the timer by clicking on buyable`+(player.st.excessiveboredom.gte(100)?`s`:``)+`)`:``}],"blank",["row", [["buyable", "impatience"],"blank",["buyable", "boredom"]]],"blank","milestones","blank",["row",[["upgrade","impatience11"],["upgrade","impatience12"],["upgrade","impatience13"],["upgrade","impatience14"]]],["row",[["upgrade","impatience21"],["upgrade","impatience22"],["upgrade","impatience23"],["upgrade","impatience24"]]],"blank",["buyable", "respecThis"]],
            buttonStyle(){return{"border-color":"red","color":"red"}},
            unlocked(){return inChallenge("st",12) || hasChallenge("st",12)}
        }
    },
    upgrades: {
        11: {
            title: "Obligatory funny number reference.",
            effect(){
                let gain = new Decimal(1.69).add(hasUpgrade("st","impatience12")?0.69:0).mul(hasUpgrade("st",24)?upgradeEffect("st",24):1)
                if(hasUpgrade("st",32)) gain = gain.pow(hasUpgrade("st",21)&&hasUpgrade("st",13)?upgradeEffect("st",21):1).pow(upgradeEffect("st",32)).tetrate(upgradeEffect("st",32))
                return gain
            },
            description(){return `Boosts point and plot gain by x${format(this.effect())}.`},
            cost: new Decimal(1),
        },
        12: {
            title(){return `EVERY<br><p style='position: absolute; left: -${format(hasUpgrade("st",22)?13:23)}%; top: 15%; transform: scale(${format(hasUpgrade("st",22)?0.75:0.6)}, 1)'>player.x.points.add(1).root(2)</p><br>EVER.`},
            description: "Boosts plot gain based on shenangains.",
            effect(){return player.st.points.add(1).root(2).pow(hasUpgrade("st",21)?upgradeEffect("st",21):1).mul(hasUpgrade("st",24)?upgradeEffect("st",24):1).mul(hasUpgrade("st","impatience21")?2:1)},
            effectDisplay(){return format(this.effect())+"x"},
            cost: new Decimal(2),
            unlocked(){return hasUpgrade("st",11)}
        },
        13: {
            title: "Superscript Path",
            description: "3rd Shenanigans upgrade affects 1st Shenanigans upgrade",
            cost(){return player.st.upgrades.length>=9?new Decimal(424):player.st.upgrades.length>=8?new Decimal(268):new Decimal(164)},
            unlocked(){return hasChallenge("st",11)}
        },
        21: {
            title: "Finally. A good exponent upgrade.",
            description(){return "Exponents 2nd Shenanigans upgrade's effect based on bought upgrades"+(hasChallenge("st",12)?" in this tab":"")+"."},
            effect(){return new Decimal(1).add(Decimal.mul(0.05, boughtUpgrades("st",3,4).mul(hasUpgrade("st","impatience11")?2:1))).mul(hasUpgrade("st",24)?upgradeEffect("st",24):1)},
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
            effect(){return player.st.plots.add(1).root(6).mul(hasUpgrade("st",24)?upgradeEffect("st",24):1).add(hasUpgrade("st","impatience13")?1:0).mul(hasUpgrade("st","impatience13")?2:1).sub(hasUpgrade("st","impatience13")?1:0)},
            effect2(){return player.points.add(1).root(9).mul(hasUpgrade("st",24)?upgradeEffect("st",24):1).add(hasUpgrade("st","impatience13")?1:0).mul(hasUpgrade("st","impatience13")?2:1).sub(hasUpgrade("st","impatience13")?1:0)},
            effectDisplay(){return`Point: x${format(this.effect())}<br>Plots: x${format(this.effect2())}`},
            cost: new Decimal(9),
            unlocked(){return hasUpgrade("st",22) || hasUpgrade("st",12)}
        },
        24: {
            title: "Mid Path",
            effect(){return new Decimal(1.075).add(hasUpgrade("st","impatience14")?0.075:0)},
            description(){return "All upgrades around Hexagon-inator are x"+format(this.effect())+" stronger."},
            cost(){return player.st.upgrades.length>=9?new Decimal(424):player.st.upgrades.length>=8?new Decimal(268):new Decimal(164)},
            unlocked(){return hasChallenge("st",11)}
        },
        31: {
            title: "Peanut Jelly Time!",
            description(){return (hasAchievement("a",12)?"Ps":"")+" boosts shenanigans and plot gain."},
            effect(){return player.idk.points.add(1).root(60).mul(hasUpgrade("st",24)?upgradeEffect("st",24):1).mul(hasUpgrade("st","impatience22")?2:1)},
            effect2(){return player.idk.points.add(1).root(10).mul(hasUpgrade("st",24)?upgradeEffect("st",24):1).mul(hasUpgrade("st","impatience22")?2:1)},
            effectDisplay(){return`Shenanigans: x${format(this.effect())}<br>Plots: x${format(this.effect2())}`},
            cost: new Decimal(15),
            unlocked(){return hasUpgrade("st",21) || hasUpgrade("st",22) || hasUpgrade("st",32)}
        },
        32: {
            title: "Get funny.",
            effect(){return new Decimal(1.42).add(hasUpgrade("st","impatience24")?0.042:0).mul(hasUpgrade("st",24)?upgradeEffect("st",24):1)},
            description(){return "1st Shenanigans upgrade is raised and tetrated to the power of "+format(this.effect())+"."},
            cost: new Decimal(22),
            unlocked(){return hasUpgrade("st",22) || hasUpgrade("st",23) || hasUpgrade("st",31)}
        },
        33: {
            title: "Depth Path",
            description: "You gain more shenanigans based on your best plot gain in 1st Challenge upon exiting.",
            effect(){return player.st.bestMarionette.max(1).ln().max(1).mul(hasUpgrade("st","impatience23")?2:1)},
            effectDisplay(){return "x"+format(this.effect())},
            cost(){return player.st.upgrades.length>=9?new Decimal(424):player.st.upgrades.length>=8?new Decimal(268):new Decimal(164)},
            unlocked(){return hasChallenge("st",11)}
        },
        impatience11: { //3
            fullDisplay(){return "<h3>You.</h3><br>Each.<br><br>Cost: "+formatWhole((player.st.upgrades.length-9)*10)+" convoluted points"},
            canAfford(){return tmp.st.impatiencePoints.gte((player.st.upgrades.length-9)*10)},
            onPurchase(){
                player.st.plots = new Decimal(0)
                player.points = new Decimal(0)
                player.st.impatience = new Decimal(0.01)
            },
            style(){return {'background-color':(this.canAfford()&&!hasUpgrade("st",this.id)?'red':'')}},
            unlocked(){return hasChallenge("st",12)}
        },
        impatience12: { //1
            fullDisplay(){return "<h3>Really.</h3><br>Upgrade.<br><br>Cost: "+formatWhole((player.st.upgrades.length-9)*10)+" convoluted points"},
            canAfford(){return tmp.st.impatiencePoints.gte((player.st.upgrades.length-9)*10)},
            onPurchase(){
                player.st.plots = new Decimal(0)
                player.points = new Decimal(0)
                player.st.impatience = new Decimal(0.01)
            },
            style(){return {'background-color':(this.canAfford()&&!hasUpgrade("st",this.id)?'red':'')}},
            unlocked(){return hasChallenge("st",12)}
        },
        impatience13: { //4
            fullDisplay(){return "<h3>Are.</h3><br>Boosts.<br><br>Cost: "+formatWhole((player.st.upgrades.length-9)*10)+" convoluted points"},
            canAfford(){return tmp.st.impatiencePoints.gte((player.st.upgrades.length-9)*10)},
            onPurchase(){
                player.st.plots = new Decimal(0)
                player.points = new Decimal(0)
                player.st.impatience = new Decimal(0.01)
            },
            style(){return {'background-color':(this.canAfford()&&!hasUpgrade("st",this.id)?'red':'')}},
            unlocked(){return hasChallenge("st",12)}
        },
        impatience14: { //5
            fullDisplay(){return "<h3>A.</h3><br>Certain.<br><br>Cost: "+formatWhole((player.st.upgrades.length-9)*10)+" convoluted points"},
            canAfford(){return tmp.st.impatiencePoints.gte((player.st.upgrades.length-9)*10)},
            onPurchase(){
                player.st.plots = new Decimal(0)
                player.points = new Decimal(0)
                player.st.impatience = new Decimal(0.01)
            },
            style(){return {'background-color':(this.canAfford()&&!hasUpgrade("st",this.id)?'red':'')}},
            unlocked(){return hasChallenge("st",12)}
        },
        impatience21: { //2
            fullDisplay(){return "<h3>Persistent.</h3><br>Shenanigans.<br><br>Cost: "+formatWhole((player.st.upgrades.length-9)*10)+" convoluted points"},
            canAfford(){return tmp.st.impatiencePoints.gte((player.st.upgrades.length-9)*10)},
            onPurchase(){
                player.st.plots = new Decimal(0)
                player.points = new Decimal(0)
                player.st.impatience = new Decimal(0.01)
            },
            style(){return {'background-color':(this.canAfford()&&!hasUpgrade("st",this.id)?'red':'')}},
            unlocked(){return hasChallenge("st",12)}
        },
        impatience22: { //6
            fullDisplay(){return "<h3>Prick.</h3><br>Upgrade.<br><br>Cost: "+formatWhole((player.st.upgrades.length-9)*10)+" convoluted points"},
            canAfford(){return tmp.st.impatiencePoints.gte((player.st.upgrades.length-9)*10)},
            onPurchase(){
                player.st.plots = new Decimal(0)
                player.points = new Decimal(0)
                player.st.impatience = new Decimal(0.01)
            },
            style(){return {'background-color':(this.canAfford()&&!hasUpgrade("st",this.id)?'red':'')}},
            unlocked(){return hasChallenge("st",12)}
        },
        impatience23: { //8
            fullDisplay(){return "<h3>Aren't.</h3><br>Good.<br><br>Cost: "+formatWhole((player.st.upgrades.length-9)*10)+" convoluted points"},
            canAfford(){return tmp.st.impatiencePoints.gte((player.st.upgrades.length-9)*10)},
            onPurchase(){
                player.st.plots = new Decimal(0)
                player.points = new Decimal(0)
                player.st.impatience = new Decimal(0.01)
            },
            style(){return {'background-color':(this.canAfford()&&!hasUpgrade("st",this.id)?'red':'')}},
            unlocked(){return hasChallenge("st",12)}
        },
        impatience24: { //7
            fullDisplay(){return "<h3>Cha.</h3><br>Luck.<br><br>Cost: "+formatWhole((player.st.upgrades.length-9)*10)+" convoluted points"},
            canAfford(){return tmp.st.impatiencePoints.gte((player.st.upgrades.length-9)*10)},
            onPurchase(){
                player.st.plots = new Decimal(0)
                player.points = new Decimal(0)
                player.st.impatience = new Decimal(0.01)
            },
            style(){return {'background-color':(this.canAfford()&&!hasUpgrade("st",this.id)?'red':'')}},
            unlocked(){return hasChallenge("st",12)}
        },
    },
    color: "#791C29",
    tooltip(){return `<h2>Shenanigans</h2><br><h3>(Shenanigans Tree)</h3><h4>${format(player.st.points)} shenanigans<br>${format(player.st.plots)} plots<h5>(${format(tmp.st.plotGenerate)}/sec)`},
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "shenanigans", // Name of prestige currency
    baseResource: "plots", // Name of resource prestige is based on
    baseAmount() {return player.st.plots}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade("st",31)) mult = mult.mul(tmp.st.upgrades[31].effect)
        if(hasUpgrade("st",33)) mult = mult.mul(upgradeEffect("st",33))
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
			challengeDescription(){return "Your plot gain is (bruteforcefully) tetrated by 0.5 initially and there's a music box you need to wind up. Tetration gets nerfed the less winded up music box is (starting from 6 seconds left), but it gets harder to wind it back up."},
			canComplete: function() {return player.st.plots.gte(250) && player.st.marionetteMeter.gt(0)},
            onEnter(){
                player.st.marionetteMeter = new Decimal(15)
                document.getElementById("idAudio1").play()
            },
            onExit(){
                if(player.st.marionetteMeter.gt(0)) player.st.bestMarionette = player.st.bestMarionette.max(tmp.st.plotGenerate)
                player.st.marionetteMeter = new Decimal(15)
                document.getElementById("idAudio1").pause()
                document.getElementById("idAudio1").currentTime = 0
                document.getElementById("idAudio2").pause()
                document.getElementById("idAudio2").currentTime = 0
            },
			goalDescription(){return "250 plots"},
            rewardDescription(){return "Unlocks three Shenanigans upgrades"},
			fullDisplay(){return `${this.challengeDescription()}<br>Goal: ${this.goalDescription()}<br>Reward: ${this.rewardDescription()}`},
            style(){return{"background-color":player.st.marionetteMeter.eq(0)?"#993333":""}},
            unlocked(){return hasUpgrade("st",22)}
		},
		12: {
			name: "Predictable Pattern",
			challengeDescription(){return "You are getting quite bored watching the numbers up... until they no longer do. Apparently, your boredom has accumulated overtime and hinder your plot gain. ALOT."},
			canComplete: function() {return player.st.plots.gte(10600) && player.st.impatienceTimer.gt(0)},
            onEnter(){
                if(!hasChallenge("st",12)) player.st.impatience = new Decimal(0.01)
                player.st.excessiveboredom = new Decimal(0)
                player.st.boredom = new Decimal(1)
                player.st.impatienceTimer = new Decimal(8)
            },
            onExit(){
                if(!hasChallenge("st",12)) player.st.impatience = new Decimal(0.01)
                player.st.excessiveboredom = new Decimal(0)
                player.st.boredom = new Decimal(1)
                player.st.impatienceTimer = new Decimal(8)
            },
			goalDescription(){return "10,600 plots"},
            rewardDescription(){return "You keep the Impatience tab with several changes."},
			fullDisplay(){return `${this.challengeDescription()}<br>Goal: ${this.goalDescription()}<br>Reward: ${this.rewardDescription()}`},
            style(){return{"background-color":player.st.impatienceTimer.lte(0)?"#993333":""}},
            unlocked(){return hasAchievement("a",14)}
		},
		21: {
			name: "The Endgamer",
			challengeDescription(){return "Your plot gain is (bruteforcefully) tetrated by tredecillionth. And no, there are no extras to assist you."},
			canComplete: function() {return player.st.plots.gte(435147746400000000)},
			goalDescription(){return "4.35e17 plots"},
            rewardDescription(){return "[ENDGAME]"},
			fullDisplay(){return `${this.challengeDescription()}<br>Goal: ${this.goalDescription()}<br>Reward: ${this.rewardDescription()}`},
            unlocked(){return hasUpgrade("idk",23)}
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
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
        canYouSeeMe: false,
		points: new Decimal(0),
    }},
    tabFormat: [],
    tooltipLocked: "TO BE CONTINUED",
    nodeStyle(){
       return {
                'width':'80px',
                'height':'80px',
                "background-origin": "border-box",
                animation: 'orbat 22.07276647028654s infinite linear', // Rotation animation
                position: "absolute",
                top: "40%",
                left: "45.6%",
            }  
    },
    componentClasses:{
        "upgrade"(){return{"hexagon":false}}
    },
    color: "black",
    requires: new Decimal("1e4000"), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return tmp.st.impatiencePoints}, // Get the current amount of baseResource
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
    layerShown(){return player.str.canYouSeeMe},
    doReset(resettingLayer){
        if(tmp[resettingLayer].layer=="str"){
            player.st.plots = new Decimal(0)
        }
    },
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
    passiveGeneration(){return hasUpgrade("idk",22)?player.idk.upgrades.length/100:0},
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
        },
        21: {
            fullDisplay(){return "<h3>F-FOUR?!</h3><br><h1>(</h1><h1 style='text-shadow: -2px 0px 5px black, 2px 0px 5px black;'>4</h1><h1>)</h1><br>Increases base point generation by 4 and base plot generation by one-sixtieth.<br><br>Cost: 100 "+tmp.idk.resource+" and 100 Shenanigans"},
            canAfford(){return player.st.points.gte(100) && player.idk.points.gte(100)},
            onPurchase(){
                player.idk.points = player.idk.points.sub(100)
                player.st.points = player.st.points.sub(100)
            },
            unlocked(){return hasAchievement("a",13)}
        },
        22: {
            fullDisplay(){return "<h3>About the damn time.</h3><br>Increases base point generation by 4, base plot generation by one-sixtieth and you passively gain "+formatWhole(player.idk.upgrades.length)+"% of "+tmp.idk.resource.replace("s","")+" based on bought upgrades.<br><br>Cost: 400 "+tmp.idk.resource+" and 100,000 Shenanigans"},
            canAfford(){return player.st.points.gte(100000) && player.idk.points.gte(400)},
            onPurchase(){
                player.idk.points = player.idk.points.sub(400)
                player.st.points = player.st.points.sub(100000)
            },
            unlocked(){return hasAchievement("a",13)}
        },
        23: {
            fullDisplay(){return "<h3>The Endgame Is Coming</h3><br><h1>(</h1><h1 style='text-shadow: -2px 0px 5px black, 2px 0px 5px black;'>4</h1><h1>)</h1><br>Increases base point generation by 4, plot generation by 1 and unlocks 3rd Shenanigans Tree challenge.<br><br>Cost: 16,000 "+tmp.idk.resource+" and 1e40 Shenanigans"},
            canAfford(){return player.st.points.gte("1e40") && player.idk.points.gte(16000)},
            onPurchase(){
                player.idk.points = player.idk.points.sub(16000)
                player.st.points = player.st.points.sub("1e40")
            },
            unlocked(){return hasAchievement("a",13)}
        },
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
        },
        14: {
            name: "Dexagon Expresso",
            tooltip(){return "Purchase 10 Shenanigans upgrades.<br>Reward: Unlocks yet another challenge."},
            done(){return player.st.upgrades.length>=10},
            unlocked(){return hasChallenge("st",11)}
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
