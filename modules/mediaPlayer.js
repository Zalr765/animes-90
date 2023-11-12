let videoID = require('./videoID.json');
const MediaPlayer = class {

    constructor(bot, chat_id, video, title){
        this.chat_id = chat_id
        this.bot = bot
        this.video = video
        this.title = title
    }
    // Отправить видео
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
      var isRus = true
      var counter =1
      function anime_menu(num, title){
        const opt = {
          reply_markup: JSON.stringify({
            inline_keyboard: [
              [{text: '<<', callback_data: `${title}btn1${unqID}`},
              { text: `${num}/${video.vol.length}`, callback_data: `number`}, 
              { text: '>>', callback_data: `${title}btn2${unqID}` }],
              [{ text: `Сменить язык на ${isRus == true? "японский с субтитрами": "русский"}`, callback_data: `swap_language${unqID}`}]
            ]
          })
        }
        return opt
      }
      

      // Начальная клавиатура
      function startKeyboard(title) {
        const keyboard = {
          reply_markup:
          JSON.stringify({
            inline_keyboard: [
              [{ text: `1/${video.vol.length}`, callback_data: `number`}, 
              { text: '>>', callback_data: `${title}btn2${unqID}` }],[{ text: `Смотерть на ${isRus == true? "японском с субтирами": "русском"}`, callback_data: `swap_language${unqID}`}]
            ]})  
          }
          return keyboard
      }

      var mPlayer = await this.bot.sendVideo(this.chat_id, this.video, {
        caption: `*Название аниме: *${video.name}\n*Название серии: *${video.vol[0].name}`,
        parse_mode: 'Markdown',
        reply_markup: startKeyboard(this.title).reply_markup
      });



      //Обработка кнопок
      await this.bot.on('callback_query', async query => {
        const callback =  query.data 
        const message_id = query.message.message_id

        //Кнопка назад
        if(callback === `${this.title}btn1${unqID}`){
          if(counter > 1){
            counter--
            mPlayer = await this.bot.editMessageMedia({      
              type: 'video',
              media: isRus === true? video.vol[counter-1].id : video.vol[counter-1].jap_id,
              caption: `*Название аниме: *${video.name}\n*Название серии: *${video.vol[counter-1].name}`,
              parse_mode: 'Markdown'}, 
              {chat_id: this.chat_id, message_id: message_id, reply_markup: anime_menu(counter,this.title).reply_markup})
          }
          //Первая страница
          if(counter === 1){
            mPlayer = await this.bot.editMessageMedia({      
              type: 'video',
              media: this.video,
              caption: `*Название аниме: *${video.name}\n*Название серии: *${video.vol[0].name}`,
              parse_mode: 'Markdown'}, 
              {chat_id: this.chat_id, message_id: message_id, reply_markup: startKeyboard(this.title).reply_markup})
          }
        }




        //Смаена языка
        if(callback === `swap_language${unqID}`){
          isRus = !isRus;
          if(counter === 1){
            mPlayer = await this.bot.editMessageMedia({      
              type: 'video',
              media: await isRus === true? video.vol[0].id : video.vol[0].jap_id,
              caption: `*Название аниме: *${video.name}\n*Название серии: *${video.vol[0].name}\n`,
              parse_mode: 'Markdown'}, 
              {chat_id: this.chat_id, message_id: message_id, reply_markup: startKeyboard(this.title).reply_markup})
          }
          else if(counter === video.vol.length){
            mPlayer = await this.bot.editMessageMedia({      
              type: 'video',
              media: this.video,
              caption: `*Название аниме: *${video.name}\n*Название серии: *${video.vol[0].name}`,
              parse_mode: 'Markdown'}, 
              {chat_id: this.chat_id, message_id: message_id, reply_markup: 
                JSON.stringify({
                  inline_keyboard: [
                    [{text: '<<', callback_data: `${this.title}btn1${unqID}`},
                    { text: `${video.vol.length}/${video.vol.length}`, callback_data: `number`}],
                    [{ text: `Сменить язык на ${isRus == true? "японский с субтитрами": "русский"}`, callback_data: `swap_language${unqID}`}]
                ]})
              }
              )
          }
          else{
            mPlayer = await this.bot.editMessageMedia({      
              type: 'video',
              media: await isRus === true?  video.vol[counter-1].id : video.vol[counter-1].jap_id,
              caption: `*Название аниме: *${video.name}\n*Название серии: *${video.vol[counter-1].name}`,
              parse_mode: 'Markdown'}, 
              {chat_id: this.chat_id, message_id: message_id, reply_markup: anime_menu(counter,this.title).reply_markup})
          }
        }





        // Кнопка вперед
        if(callback === `${this.title}btn2${unqID}`){


          // Последняя страница
          counter++
          if(counter === video.vol.length){
            mPlayer = await this.bot.editMessageMedia({      
              type: 'video',
              media: this.video,
              caption: `*Название аниме: *${video.name}\n*Название серии: *${video.vol[0].name}`,
              parse_mode: 'Markdown'}, 
              {chat_id: this.chat_id, message_id: message_id, reply_markup: 
                JSON.stringify({
                  inline_keyboard: [
                    [{text: '<<', callback_data: `${this.title}btn1${unqID}`},
                    { text: `${video.vol.length}/${video.vol.length}`, callback_data: `number`}],
                    [{ text: `Сменить язык на ${isRus == true? "японский с субтитрами": "русский"}`, callback_data: `swap_language${unqID}`}]
                ]})
              }
              )
          }
          if(counter < video.vol.length){
            mPlayer = await this.bot.editMessageMedia({      
              type: 'video',
              media: await isRus === true ? video.vol[counter-1].id : video.vol[counter-1].jap_id,
              caption: `*Название аниме: *${video.name}\n*Название серии: *${video.vol[counter-1].name}`,
              parse_mode: 'Markdown'}, 
              {chat_id: this.chat_id, message_id: message_id, reply_markup: anime_menu(counter,this.title).reply_markup}) 
          }
          }
          //Выбор по серии
          if(callback === "number"){
            return
          }
        })
    }
}
 
module.exports = MediaPlayer