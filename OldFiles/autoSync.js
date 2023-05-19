const { spawn } =  require('child_process')
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function sync() {
    while (true) {
        await sleep(150000)
        spawn('git',['pull'])
    }
}
sync()