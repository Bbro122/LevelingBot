module.exports.boolCheck = function boolCheck(bool) {
    if (typeof bool == 'boolean') {
        return bool;
    }
    else {
        return false;
    }
},
    module.exports.strCheck = function strCheck(str) {
        if (typeof str == 'string') {
            return str;
        }
        else {
            return '';
        }
    },
    module.exports.numCheck = function numCheck(num) {
        if (typeof num == 'number') {
            return num;
        }
        else {
            return 0;
        }
    };
