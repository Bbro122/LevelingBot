const newDeck = ["g1","g2","g3","g4","g5","g6","g7","g8","g9","g1","g2","g3","g4","g5","g6","g7","g8","g9","g0","gs","gd","gr","gs","gd","gr","b1","b2","b3","b4","b5","b6","b7","b8","b9","b1","b2","b3","b4","b5","b6","b7","b8","b9","b0","bs","bd","br","bs","bd","br","y1","y2","y3","y4","y5","y6","y7","y8","y9","y1","y2","y3","y4","y5","y6","y7","y8","y9","y0","ys","yd","yr","ys","yd","yr","r1","r2","r3","r4","r5","r6","r7","r8","r9","r1","r2","r3","r4","r5","r6","r7","r8","r9","r0","rs","rd","rr","rs","rd","rr"]
let games = []
function newGame(guildId,msg,host) {
  return {id:guildId,chan:msg.channelId,msg:msg.id,"deck":newDeck,players:[newPlayer(host)],round:0,inLobby:true,timeouts:[]}
}
function findGame(guildId) {
  return games.find(game => game.id == guildId)
}
function newPlayer(id) {
 return {"id":id,"hand":[]}
}
function createButton(string,id,style,emoji) { // PRIMARY:Blue DANGER:Red SUCCESS:GREEN
  return {type: 'BUTTON',label: string,customId: id,style: style,emoji: emoji,url: null,disabled: false}
}
function row(array) {
  return {type: 'ACTION_ROW',components: array}
}
function startGame() {
  
}
exports.startNewGame = async function startNewGame(interaction) {
  let gameChan = await interaction.guild.channels.create("Test")
  let msg = gameChan.send({embeds:[{
    "type": "rich",
    "title": `<>'s Uno Match`,
    "description": `Click the join button below to participate in the match, as the host you can start or cancel the match.\n\n1/4 players have joined`,
    "color": 0xed0606,
    "thumbnail": {
      "url": `https://cdn.discordapp.com/attachments/758884272572071944/971648962505351198/logo.png`,
      "height": 700,
      "width": 450
    }}],components:[row([createButton("🎮 Join Match","join","SUCCESS",null),createButton("Start Match","start","SUCCESS","814199679704891423"),createButton("Cancel Match","cancel","DANGER","814199666778308638")])]})
  games.push(newGame(interaction.guild.id,msg,interaction.user.id))
  //interaction.reply(`[Unfinished] Game starting in <#${gameChan.id}>`)
}
exports.command = function(interaction) {
  //interaction.deferReply()
  if (interaction.customId=='join') {
    let game = findGame(interaction.guild.id)
    if (game) {
      if (game.players.find(plr => plr.id == interaction.user.id)) {} else {
    game.players.push(newPlayer(interaction.user.id))
    console.log(game)
      }
    }
  } else if (interaction.customId=='cancel') {
    if (findgame(interaction.guild.id)) {
      //interaction.channel.delete()
    }
  } else if (interaction.customId=='start') {
    let game = findgame(interaction.guild.id)
    if (game) {
      if (game.players.length>=1) {
        startGame()
      }
    }
  }
}
