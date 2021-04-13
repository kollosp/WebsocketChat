const fs = require('fs')
const path = require('path')

let CONST = undefined

module.exports = function (activePath = __dirname) {
    if(CONST) return CONST

    const constJSON = path.join(activePath, 'const.json')
    const constJS = path.join(activePath, 'const.js')

    try {
        if(!fs.existsSync(constJSON)) throw new Error("file does not exists")

        const text = fs.readFileSync(constJSON).toString()
        CONST = JSON.parse(text);

    } catch (err) {

        if(!fs.existsSync(constJS)) {
            console.error(`Both const.json and const.js in the path ${activePath} do not exist!`)
            throw new Error(`Both const.json and const.js in the path ${activePath} do not exist!`)
        }

        //execute const.js script. Script exports JSON object
        CONST = require(constJS)

        //create new .json file
        fs.writeFileSync(constJSON, JSON.stringify(CONST, null, 4))
    }

    return CONST
}
