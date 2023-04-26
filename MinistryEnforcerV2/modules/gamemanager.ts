import { Embed } from "@discordjs/builders"
import { ActionRowBuilder, Client, ColorResolvable, EmbedBuilder, SelectMenuOptionBuilder, StringSelectMenuBuilder, TextChannel } from "discord.js"
type triviaData = {
    data: {
        category: string
        id: string
        correctAnswer: string
        incorrectAnswers: string[]
        question: string
        tags: string[]
        type: string
        difficulty: string
    }[]
}
let axios = require('axios')
let dataManager = require('./datamanager')
const easyVM = { "*": .1, "-": .3, "+": 0.3 }
const medVM = { "*": .3, "-": .3, "+": 0.3 }
const hardVM = { "*": .5, "-": .3, "+": 0.3 }
let valueMap = { "+": 10, "-": 20, "*": 30, "/": 40 }
const chanceMap = { "*": .2, "-": .3, "+": 0.3 }
let currentValues: { guildId: string, currentValue: string, reward: number, type: number }[] = []
let client: Client
exports.setup = function (bot: Client) {
    client = bot
    client.guilds.fetch().then(guilds => {
        client.guilds.cache.forEach(guild => {
            startGame(guild.id, true)
        })
    })
}
function generateEquation(vm: any) {
    let termCount = random(3, 6)
    let terms: any[] = []
    let tAvg = 0
    let signValue = 0
    for (let i = 0; i < termCount; i++) {
        let term = random(3, 50)
        terms.push(term)
        tAvg = tAvg + term
    }
    tAvg = Math.round(tAvg / termCount)
    if (random(0, 1) == 1) {
        let tindex = random(0, terms.length - 1)
        let term: any = terms[tindex]
        let multipleArray = multiples(term)
        if (multipleArray.length > 1) {
            let multiple = 0
            while (multiple == term || multiple == 0) {
                multiple = multipleArray[random(0, multipleArray.length - 1)]
            }
            term = `(${term} / ${multiple})`
            terms[tindex] = term
        }
        signValue = 40
    }
    for (let i = 0; i < 3; i++) {
        let randTerm = random(0, terms.length - 1)
        if (typeof terms[randTerm] == 'number' || (typeof terms[randTerm] == 'string' && !(terms[randTerm] as string).includes('^'))) {
            let term: number = typeof terms[randTerm] == 'string' ? eval(terms[randTerm]) : terms[randTerm]
            if (isSqrt(term)) {
                terms[randTerm] = `${terms[randTerm]}^0.5`
                signValue = signValue + 30
            } else if (term <= 10) {
                terms[randTerm] = `${terms[randTerm]}^2`
                signValue = signValue + 30
            }
        } else {
            i--
        }
    }
    let equation: string = ''
    for (let i = 0; i < terms.length - 1; i++) {
        const term = terms[i]
        let values = getSign(vm)
        signValue = signValue + (values[1] as number)
        equation = equation + `${term} ${values[0]} `
    }
    equation = equation + terms[terms.length - 1]
    let value = signValue + tAvg + Math.abs(eval(equation.replace('^', '**')) * (random(1, 4) / 10))
    return [equation, (value > 300) ? 300 : value]
}
function getSign(vm: any) {
    let value = undefined
    while (value == undefined) {
        if (Math.random() < vm["+"]) {
            value = ['+', valueMap["+"]]
        } else if (Math.random() < vm["-"]) {
            value = ['-', valueMap["-"]]
        } else if (Math.random() < vm["*"]) {
            value = ['*', valueMap["*"]]
        }
    }
    return value
}
function multiples(num: number) {
    let multiples: any[] = []
    for (let i = 0; i < num; i++) {
        const result = num / i
        if ((result - Math.floor(result) == 0)) {
            multiples.push(result)
        }
    }
    return multiples
}
function random(min: number, max: number) {
    return Math.round(Math.random() * (max - min)) + min
}
function randomizeWord(word: string) {
    while (true) {
        let array = word.split('')
        let b = ''
        for (let i = 0; i < array.length; i++) {
            const element = array[random(0, array.length - 1)];
            console.log(element)
            array.splice(array.indexOf(element), 1)
            b = b + element
            i--
        }
        if (b != word) {
            return b
        }
    }
}
function isSqrt(value: number) {
    return ((value ** 0.5) == Math.floor(value ** 0.5) ? true : false)
}
async function startGame(serverID: string, repeat: boolean) {
    let guild = client.guilds.cache.get(serverID)
    let enabled = dataManager.getSetting(serverID, '.games.enabled')
    let channelID = dataManager.getSetting(serverID, '.games.channel')
    if (enabled && channelID && serverID) {
        let channel = guild?.channels.cache.get(channelID)
        if (channel && channel instanceof TextChannel) {
            let game = random(1, 3)
            switch (game) {
                case 1: {
                    let equation
                    switch (random(1, 3)) {
                        case 1:
                            equation = generateEquation(easyVM)
                            break;
                        case 2:
                            equation = generateEquation(medVM)
                            break
                        case 3:
                            equation = generateEquation(hardVM)
                            break;
                        default:
                            equation = generateEquation(hardVM)
                            break
                    }
                    let value = currentValues.find(guild => guild.guildId == serverID)
                    if (value) {
                        value.currentValue = (eval((equation[0] as string).replace('^', '**')) as number).toString()
                        value.reward = equation[1] as number
                        value.type = 1
                    } else {
                        currentValues.push({ guildId: serverID, currentValue: eval((equation[0] as string).replace('^', '**')), reward: equation[1] as number, type: 1 })
                    }
                }
                    break;
                case 2: {
                    let words: string[] = require('./scramble.json')
                    let word = words[random(0, words.length - 1)]
                    let value = currentValues.find(guild => guild.guildId == serverID)
                    if (value) {
                        value.currentValue = word
                        value.reward = 50 + (word.length - 4) * 10
                    } else {
                        currentValues.push({ guildId: serverID, currentValue: word, reward: 50 + (word.length - 4) * 10, type: 2 })
                        value = { guildId: serverID, currentValue: word, reward: 50 + (word.length - 4) * 10, type: 2 }
                    }
                    let color: ColorResolvable = 'Green'
                    if (word.length > 7) {
                        color = 'Red'
                    } else if (word.length > 5) {
                        color = 'Yellow'
                    } else {
                        color = 'Green'
                    }
                    let embed = new EmbedBuilder()
                        .setTitle('Unscramble the Word')
                        .setDescription(randomizeWord(word))
                        .setColor(color)
                        .setFooter({ text: `Solve for ${value.reward} xp || Ends in 2 hours` })
                    await channel.send({ embeds: [embed] })
                }
                    break;
                case 3: {
                    let difficulty
                    let value = 0
                    let color: ColorResolvable = 'Green'
                    switch (random(1, 3)) {
                        case 1:
                            difficulty = 'hard'
                            color = 'Red'
                            value = 150
                            break;
                        case 2:
                            difficulty = 'medium'
                            color = 'Yellow'
                            value = 100
                            break;
                        case 3:
                            difficulty = 'easy'
                            color = 'Green'
                            value = 50
                            break;
                    }
                    let trivia: triviaData["data"][0]
                    try {
                        trivia = (await axios.get(`https://the-trivia-api.com/api/questions?limit=1&difficulty=${difficulty}`)).data[0]
                    } catch (error) {
                        return console.log(error)
                    }
                    let array = trivia.incorrectAnswers
                    array.push(trivia.correctAnswer)
                    let answers: string[] = []
                    for (let i = 0; i < array.length; i++) {
                        const element = array[random(0, array.length - 1)];
                        console.log(element)
                        array.splice(array.indexOf(element), 1)
                        answers.push(element)
                        i--
                    }
                    let embed = new EmbedBuilder()
                        .setColor('LuminousVividPink')
                        .setTitle(trivia.category)
                        .setDescription(trivia.question)
                        .addFields([{ value: answers[0], name: 'A.' }, { value: answers[1], name: 'B.' }, { value: answers[2], name: 'C.' }, { value: answers[3], name: 'D.' }])
                        .setFooter({ text: `Choose the correct answer for ${value}` });
                    let row = new ActionRowBuilder<StringSelectMenuBuilder>()
                        .addComponents(new StringSelectMenuBuilder()
                            .setOptions(
                                new SelectMenuOptionBuilder()
                                    .setLabel(answers[0])
                                    .setDescription('0')
                                    .setValue('0'),
                                new SelectMenuOptionBuilder()
                                    .setLabel(answers[1])
                                    .setDescription('1')
                                    .setValue('1'),
                                new SelectMenuOptionBuilder()
                                    .setLabel(answers[2])
                                    .setDescription('2')
                                    .setValue('2'),
                                new SelectMenuOptionBuilder()
                                    .setLabel(answers[3])
                                    .setDescription('3')
                                    .setValue('3')
                            )
                        )
                    await channel.send({ embeds: [embed], components: [row] })
                    let answer = currentValues.find(guild => guild.guildId == serverID)
                    if (answer) {
                        answer.currentValue = answers.indexOf(trivia.correctAnswer).toString()
                        answer.reward = value
                        answer.type = 3
                    } else {
                        currentValues.push({ guildId: serverID, currentValue: answers.indexOf(trivia.correctAnswer).toString(), reward: value, type: 3 })
                    }
                }
                    break;
                default:
                    break;
            }
        }
    }
}
exports.getAnswer = function (guildId:string) {
    return currentValues.find(value => value.guildId = guildId)
}
//startGame('0000000',false)
console.log(dataManager.getSetting('758884271795994634', 'games.enabled'))