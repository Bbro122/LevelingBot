const {spawn} = require('child_process')
function sync() {
    spawn('git',['pull'])
    child.on('close', (code) => {
        console.log(`Exitted with code: ${code}`)
    });
    setTimeout(reSync(),150000)
}
function reSync() {
    sync()
}