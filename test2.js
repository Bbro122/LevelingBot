let array1 = ["a","b","c","d","e"]
function randomizeArray(array) {
    let a = array.slice()
    let b = []
    for (let i = 0; i < array.length; i++) {
      console.log(a.length)
      const randomElement = a[Math.floor(Math.random() * a.length)]
      a.splice(a.indexOf(randomElement),1)
      b.push(randomElement)
    }
    return b
}
console.log(randomizeArray(array1))
console.log(array1)