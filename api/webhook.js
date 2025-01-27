import TelegramApi from 'node-telegram-bot-api';
import NewAnime from '../modules/newAnime';
import commands from '../modules/commands';
import videoID from '../modules/videoID.json';
import addVideo from '../modules/videoad';
import { json } from 'body-parser';

// Токен вашего бота
const token = '5814757867:AAG1OCCXqJ3HXalkb4sJlnOIknG2VTRJtG0';
const bot = new TelegramApi(token);

// Установка вебхука
const webhookURL = 'https://animes-90.vercel.app' + '/api/webhook';
bot.setWebHook(webhookURL);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const update = req.body;
        await bot.processUpdate(update);
        res.status(200).send('ok');
    } else {
        res.status(405).send('Method Not Allowed');
    }
}
