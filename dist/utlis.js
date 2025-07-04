"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Random = Random;
function Random(no) {
    const code = "duhqwulweiuqchrioewrchociew;clsdkfmciewifewoiweo";
    let ans = "";
    for (let i = 0; i <= no; i++) {
        ans += code[Math.floor((Math.random() * code.length))];
    }
    return ans;
}
