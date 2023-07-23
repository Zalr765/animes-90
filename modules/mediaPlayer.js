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
      var unqID = generateUniqueId()
      var counter =1
      function anime_menu(num, title){
        const opt = {
          reply_markup: JSON.stringify({
            inline_keyboard: [
              [{text: '<<', callback_data: `${title}btn1${unqID}`},
              { text: `${num}`, callback_data: `number`}, 
              { text: '>>', callback_data: `${title}btn2${unqID}` }]
            ]
          })
        }
        return opt
      }
      
      const staerKeyBoard = {
        reply_markup:
        JSON.stringify({
          inline_keyboard: [
            [{ text: `1`, callback_data: `number`}, 
            { text: '>>', callback_data: `${this.title}btn2${unqID}` }]
          ]}) 
      }

      var mPlayer = await this.bot.sendVideo(this.chat_id, this.video, staerKeyBoard)
      await this.bot.on('callback_query', async query => {
        const callback =  query.data 
        const message_id = query.message.message_id
        if(callback === `${this.title}btn1${unqID}`){
          if(counter > 1){
            counter--
            mPlayer = await this.bot.editMessageMedia({      
              type: 'video',
              media: this.video,
              caption: this.title}, 
              {chat_id: this.chat_id, message_id: message_id, reply_markup: anime_menu(counter,this.title).reply_markup})
          }
          if(counter ==+ 1){
            mPlayer = await this.bot.editMessageMedia({      
              type: 'video',
              media: this.video,
              caption: this.title}, 
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
            media: this.video,
            caption: this.title}, 
            {chat_id: this.chat_id, message_id: message_id, reply_markup: anime_menu(counter,this.title).reply_markup})
          }})
    }
}
 
module.exports = MediaPlayer