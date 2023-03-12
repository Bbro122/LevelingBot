"use strict";
exports.levelRequirement = function levReq(lvl) {
    return (5 * (lvl ** 2) + (50 * lvl) + 100);
};
exports.getLevel = function getLevel(xp) {
    let level = 0;
    do {
        level++;
    } while (xp >= exports.levelRequirement(level));
    return level;
};
exports.addXP = function (id, xp) {
};
console.log(exports.getLevel(1000));
