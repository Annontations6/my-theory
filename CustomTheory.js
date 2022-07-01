import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "my_theory_id";
var name = "My Theory";
var description = "A basic theory.";
var authors = "Annontations6";
var version = 1;

var currency;

var init = () => {
    currency = theory.createCurrency();
    currency2 = theory.createCurrency();

    ///////////////////
    // Regular Upgrades

    // a1
    {
        let getDesc = (level) => "a_1=" + getA1(level).toString(0);
        a1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(150, Math.log2(2))));
        a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
        a1.getInfo = (amount) => Utils.getMathTo(getDesc(a1.level), getDesc(a1.level + amount));
    }

    // a2
    {
        let getDesc = (level) => "a_2=" + getA2(level).toString(0);
        a2 = theory.createUpgrade(1, currency2, new FirstFreeCost(new ExponentialCost(100, Math.log2(3))));
        a2.getDescription = (_) => Utils.getMath(getDesc(a2.level));
        a2.getInfo = (amount) => Utils.getMathTo(getDesc(a2.level), getDesc(a2.level + amount));
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e10);
    theory.createBuyAllUpgrade(1, currency, 1e13);
    theory.createAutoBuyerUpgrade(2, currency, 1e30);

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(10, 8));
    
    /////////////////
    //// Achievements
    let achievement_category1 = theory.createAchievementCategory(0, "Time")
    achievement1 = theory.createAchievement(0, achievement_category1, "You Played!", "i think now.", () => true);

    ///////////////////
    //// Story chapters
    
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    currency2.value += dt * getA1(a1.level).sqrt();
    currency.value += dt * bonus * getA1(a1.level) *
                                   BigNumber.TWO.sqrt();
}

var getPrimaryEquation = () => {
    let result = "\\dot{\\rho}_1 = a_1";

    result += "\\sqrt{2}";

    result += "a_2";

    return result;
}

var getTertiaryEquation = () => {
    let result = "\\dot{\\rho}_2 = \\sqrt{a_1}";

    return result;
}

var getSecondaryEquation = () => theory.latexSymbol + "=\\max\\rho";
var getPublicationMultiplier = (tau) => tau.pow(0.1) / BigNumber.FOUR;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.1}}{4}";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getA1 = (level) => Utils.getStepwisePowerSum(level, 2.5, 9, 0);
var getA2 = (level) => Utils.getStepwisePowerSum(level, 3, 20, 0);

init();
