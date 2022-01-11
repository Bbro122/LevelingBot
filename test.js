let sorted = require('./userdata.json').users.sort((a,b) => {return b.xp - a.xp})
sorted.forEach((e) => {
    console.log(`${e.xp}`);
});