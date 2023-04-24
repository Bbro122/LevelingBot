function random(min, max) {
    return Math.round(Math.random() * (max - min)) + min
}
function randomizeWord(word) {
    while (true) {
        let array = word.split('')
        let b = ''
        for (let i = 0; i < array.length; i++) {
            const element = array[random(0,array.length-1)];
            console.log(element)
            array.splice(array.indexOf(element),1)
            b = b + element
            i--
        }
        if (b!=word) {
            return b
        }
    }
}