export function Random(no: number) {
    const code = "duhqwulweiuqchrioewrchociew;clsdkfmciewifewoiweo";
    let ans = "";
    for(let i=0; i<=no; i++){
        ans += code[Math.floor((Math.random() * code.length))]
    }
    return ans;
}