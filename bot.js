const TelegramApi = require('node-telegram-bot-api')
var NewAnime = require('./modules/newAnime')
var commands = require('./modules/commands')
let videoID = require('./modules/videoID.json');
var addVideo = require('./modules/videoad')
const token = '5814757867:AAG1OCCXqJ3HXalkb4sJlnOIknG2VTRJtG0';
var serv = require('./modules/bg');
const keep_alive = require('./modules/bg');
const videoAdd = require('./modules/videoad');
const list = require('./modules/list')
keep_alive()
const bot = new TelegramApi(token,{polling: true});



function search_in_tags(tag){
  for(var i of videoID.anime){
    i.categories.forEach(item => {
      if(tag === item){
        console.log(item)
      }
    })
  }
}

bot.onText(/\/start/, async msg => {
  const chat_id = msg.chat.id;
  bot.sendMessage(chat_id, "Добро пожаловать в бота со старыми аним! Для поиска используйте /menu или /search")
  
})

bot.setMyCommands(commands)

function getAnimeNames(){
  var mas = []
  for(var item of videoID.anime){
    mas.push(item.name)
  }
  return mas
} 
function generateUniqueId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
var unqID = generateUniqueId()
function menu_keyboard(){
  const opt = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{text: 'Искать по Алафавиту', callback_data: `global`+`${unqID}`}],
        [{text: 'Искать по году выпуска', callback_data: `global`+`${unqID}`}],
        [{text: 'Ультранасилие', callback_data: `ultraviolence` +`${unqID}`}],
        [{text: 'Психологическое', callback_data: `psycho` +`${unqID}`}],
        [{text: 'Меха', callback_data: `meh` +`${unqID}`}]
      ]
    })
  }
  return opt
}

function search(text, mas) {
  var all_titles = "";
  
  if (text.length === 1) {
    text = new RegExp('^' + text, "i");
    
    mas.forEach(item => {
      if (text.test(item) === true) {
        all_titles += item + '\n';
      }
    });
    
    if (all_titles === "") {
      all_titles = "Значение не найдено";
    }
    
    return all_titles;
  } else if (text.length >= 2) {
    text = new RegExp(text, "i");
    
    mas.forEach(item => {
      if (text.test(item) === true) {
        all_titles += item + '\n';
        return all_titles;
      }
    });
    
    if (all_titles === "") {
      all_titles = `По запросу "${text}" ничего не найдено`;
    }
  }
  
  return all_titles;
}


var isSearchActive = false


var handler = (search_mes) => {
    isSearchActive = false
    var ness = search(search_mes.text, getAnimeNames())
    bot.sendMessage(search_mes.chat.id , ness, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Евангелион', callback_data: `eva ` },
            { text: 'Ковбой Бибоп', callback_data: 'bibop' }
          ]
        ]
      }
    })
    bot.removeListener("message", handler)
  // }
}


bot.on('message', async msg => {
  // console.log("Name:  " + msg.video.file_name + "\nid:  " + msg.video.file_id)
    const text = msg.text;
    const chat_id = msg.chat.id;
    var isMember = await bot.getChatMember('@anime_80_2000s_chanale', chat_id)
    if(isMember.status === 'left' || isMember.status === 'creator'){
      await bot.sendMessage(chat_id, 'Пожалуйста, подпишитесь на канал @anime_80_2000s_chanale');
    }
    else if(isMember.status === 'member'){
      var allAnimesDesciption = ["",[]]
      if(text === "/menu" && isSearchActive === false){
        for(let i = 0; i < videoID.anime.length; i++){
          allAnimesDesciption[1].push(videoID.anime[i])
          allAnimesDesciption[0] = allAnimesDesciption[0].concat(`*${i+1}.Название:* ${videoID.anime[i].name}\n*Год выхода:* ${videoID.anime[i].year}\n*Cерии:* ${videoID.anime[i].vol.length}\n${videoID.anime[i].description}\n\n`)
      }
      await bot.sendMessage(chat_id, allAnimesDesciption[0], {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Евангелион', callback_data: 'eva' },
              { text: 'Ковбой Бибоп', callback_data: 'bibop' }
            ]
          ]
        }
      });
      }
      if(text === "/search"){
        isSearchActive = true
        await bot.sendMessage(chat_id, "Напишите название тайтла \n /evangelion")
        if(isSearchActive === true){
          bot.on('message', handler);
        }
      }
      
    }
    
})

bot.on('message', async msg =>{
  msg.video? console.log(videoAdd(msg.video.file_name, msg.video.file_id)) : console.log("Not_A_Video")
  console.log(msg)
})





bot.on('callback_query', async msg => {
  const chat_id = msg.message.chat.id
  const callback = msg.data 
  var titleRegex = /^(.*?)(?=\/)/
  if(callback === "eva"){
    var eva = new NewAnime(bot, chat_id, titleRegex.exec(videoID.anime[0].name)[0], videoID.anime[0].photo, videoID.anime[0].description).sendAnime()
  }
  if(callback === "bibop"){
    var bibop = new NewAnime(bot, chat_id, titleRegex.exec(videoID.anime[1].name)[0], videoID.anime[1].photo, videoID.anime[1].description).sendAnime()
  }
});




bot.on("polling_error", console.log);

