import TelegramApi from 'node-telegram-bot-api';
import NewAnime from './modules/newAnime';
import commands from './modules/commands';
import videoID from './modules/videoID.json';
import addVideo from './modules/videoad';

// Токен вашего бота
const token = '5814757867:AAG1OCCXqJ3HXalkb4sJlnOIknG2VTRJtG0';
const bot = new TelegramApi(token);

function getAnimeNames() {
  return videoID.anime.map(item => item.name);
}

function search(text, mas) {
  let all_titles = '';
  const regex = new RegExp(text, 'i');

  mas.forEach(item => {
    if (regex.test(item)) {
      all_titles += item + '\n';
    }
  });

  return all_titles || `По запросу "${text}" ничего не найдено`;
}

// Обработчик команды /start
bot.onText(/\/start/, async (msg) => {
  const chat_id = msg.chat.id;
  bot.sendMessage(chat_id, "Добро пожаловать в бота со старыми аним! Для поиска используйте /menu или /search");
});

// Устанавливаем команды
bot.setMyCommands(commands);

// Обработчик сообщений для поиска
bot.on('message', async (msg) => {
  const chat_id = msg.chat.id;
  const text = msg.text;

  if (text === '/search') {
    bot.sendMessage(chat_id, 'Напишите название аниме для поиска...');
  } else if (text) {
    const searchResult = search(text, getAnimeNames());
    bot.sendMessage(chat_id, searchResult);
  }
});

// Обработчик callback-запросов
bot.on('callback_query', async (msg) => {
  const chat_id = msg.message.chat.id;
  const callback = msg.data;
  const titleRegex = /^(.*?)(?=\/)/;

  if (callback === 'eva') {
    const eva = new NewAnime(bot, chat_id, titleRegex.exec(videoID.anime[0].name)[0], videoID.anime[0].photo, videoID.anime[0].description);
    eva.sendAnime();
  } else if (callback === 'bibop') {
    const bibop = new NewAnime(bot, chat_id, titleRegex.exec(videoID.anime[1].name)[0], videoID.anime[1].photo, videoID.anime[1].description);
    bibop.sendAnime();
  }
});

// Обработчик ошибок
bot.on('polling_error', console.log);
