let MediaPlayer = require('./mediaPlayer')
let videoID = require('./videoID.json')
const NewAnime  = class {
    constructor(bot, chat_id, title, photo, description){
        this.title = title
        this.description = description
        this.photo = photo
        this.chat_id = chat_id
        this.bot = bot
    }
    sendAnime(){
        var titleRegex = /^(.*?)(?=\/)/
        function generateUniqueId() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
              var r = Math.random() * 16 | 0,
                  v = c === 'x' ? r : (r & 0x3 | 0x8);
              return v.toString(16);
            });
          }
        var unqID = generateUniqueId()
        const callback_id =  `${unqID}`
        this.bot.sendPhoto(this.chat_id,
            this.photo,
            {caption: `*Название*: ${this.title}\n${this.description}`, 
            reply_markup: {
            inline_keyboard: [[{text: 'Смотреть',callback_data: `${callback_id}`},]]},
            parse_mode: 'Markdown'})
            this.bot.on('callback_query', query =>{
                const callback = query.data 
                if(callback === callback_id){
                    for(var i = 0;i <= videoID.anime.length - 1; i++ ){
                        if(titleRegex.exec(videoID.anime[i].name)[0] === this.title){
                            var video = videoID.anime[i].vol[0].id
                        }
                    }
                    new MediaPlayer(this.bot, this.chat_id, video , this.title).send() 
                }
            })
    }
}




module.exports = NewAnime