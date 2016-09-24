'use strict';
function fromString(str) {
    try {
        const modVersionSplit = str.split('-');
        return {
            minecraftVersion: modVersionSplit[0],
            modBuild: modVersionSplit[1]
        };
    } catch (err) {
        return {
            modBuild: 1
        };
    }
}

function toString(obj) {
    try {
        return obj.minecraftVersion + '-' + obj.modBuild;
    } catch (err) {
        return '1.9.4-1';
    }
}

module.exports = {
    fromString: fromString,
    toString: toString
};
