import { spawn } from 'child_process';
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
while (true) {
    await sleep(150000)
    spawn('git',['pull'])
}