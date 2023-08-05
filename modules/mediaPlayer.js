let videoID = require('./videoID.json');
const MediaPlayer = class {

    constructor(bot, chat_id, video, title){
        this.chat_id = chat_id
        this.bot = bot
        this.video = video
        this.title = title
    }
    async send(){
      function generateUniqueId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0,
              v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
      var titleRegex = /^(.*?)(?=\/)/
      for(var i = 0;i <= videoID.anime.length - 1; i++ ){
        if(titleRegex.exec(videoID.anime[i].name)[0] === this.title){
            var video = videoID.anime[i]
        }
    }
      var unqID = generateUniqueId()
      var counter =1
      function anime_menu(num, title){
        const opt = {
          reply_markup: JSON.stringify({
            inline_keyboard: [
              [{text: '<<', callback_data: `${title}btn1${unqID}`},
              { text: `${num}/${video.vol.length}`, callback_data: `number`}, 
              { text: '>>', callback_data: `${title}btn2${unqID}` }]
            ]
          })
        }
        return opt
      }
      
      const startKeyboard = {
        reply_markup:
        JSON.stringify({
          inline_keyboard: [
            [{ text: `1/${video.vol.length}`, callback_data: `number`}, 
            { text: '>>', callback_data: `${this.title}btn2${unqID}` }]
          ]}) 
      }

      var mPlayer = await this.bot.sendVideo(this.chat_id, this.video, {
        caption: `*Название аниме: *${this.title}\n*Название серии: *${video.vol[0].name}`,
        parse_mode: 'Markdown',
        reply_markup: startKeyboard.reply_markup
      });
      await this.bot.on('callback_query', async query => {
        const callback =  query.data 
        const message_id = query.message.message_id
        if(callback === "number"){
          return
        }
        if(callback === `${this.title}btn1${unqID}`){
          if(counter > 1){
            counter--
            mPlayer = await this.bot.editMessageMedia({      
              type: 'video',
              media: video.vol[counter-1].id,
              caption: `*Название аниме: *${this.title}\n*Название серии: *${video.vol[counter-1].name}`,
              parse_mode: 'Markdown'}, 
              {chat_id: this.chat_id, message_id: message_id, reply_markup: anime_menu(counter,this.title).reply_markup})
          }
          //Первая страница
          if(counter === 1){
            mPlayer = await this.bot.editMessageMedia({      
              type: 'video',
              media: this.video,
              caption: `*Название аниме: *${this.title}\n*Название серии: *${video.vol[0].name}`,
              parse_mode: 'Markdown'}, 
              {chat_id: this.chat_id, message_id: message_id, reply_markup:
                JSON.stringify({
                  inline_keyboard: [
                    [{ text: `1`, callback_data: `number`}, 
                    { text: '>>', callback_data: `${this.title}btn2${unqID}` }]
                  ]
                }) 
              })
          }


        }
        if(callback === `${this.title}btn2${unqID}`){
          counter++
          mPlayer = await this.bot.editMessageMedia({      
            type: 'video',
            media: video.vol[counter-1].id,
            caption: `*Название аниме: *${this.title}\n*Название серии: *${video.vol[counter-1].name}`,
            parse_mode: 'Markdown'}, 
            {chat_id: this.chat_id, message_id: message_id, reply_markup: anime_menu(counter,this.title).reply_markup})
          }})
    }
}
 
module.exports = MediaPlayer