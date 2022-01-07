import dotenv from 'dotenv';
dotenv.config();

import { Client, Intents } from 'discord.js';
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
}); //create new client

client.once('ready', () => {
  console.log(`💘 ${client.user.tag} is logged in!`);
});

// client.on('messageCreate', commandHandler);

const prefix = '.';

import gif from './commands/gif.js';
import choochoo from './commands/choochoo.js';
import avatar from './commands/avatar.js';
import meme from './commands/meme.js';
import music from './commands/play.js';

const commands = { choochoo, avatar, meme, music }; // functions inside some sort of list/array/whatever is also known as a jump table technique,

client.on('messageCreate', async (message) => {
  if (
    !message.content.startsWith(prefix) ||
    message.author.bot ||
    message.channel.id !== '893197693713809529'
  )
    return;
  const args = message.content.slice(prefix.length).split(' '); //split a string into an array
  const command = args.shift().toLowerCase(); // removes the first element from an array and returns that removed element.

  switch (command) {
    case 'ping': {
      message.reply('PONG!!');
      break;
    }
    case 'choochoo': {
      await commands[command](message);
      break;
    }
    case 'avatar': {
      await commands[command](message, args, client);
      break;
    }
    case 'meme': {
      await commands[command](message, args);
      break;
    }
    case 'play':
    case 'skip':
    case 'stop': {
      await commands['music'](message, args, client, command);
      break;
    }

    default: {
      message.reply('Please Enter a Valid Command!');
    }
  }
});

// client.on('message', './commandHandler');

// client.on('messageCreate', async (msg) => {
//   switch (msg.content) {
//     case '!ping':
//       msg.reply('Pong!');
//       break;
//     //our meme command below
//     case '!meme':
//       msg.channel.send("Here's your meme!"); //Replies to user command
//       const img = await getMeme(); //fetches an URL from the API
//       msg.channel.send(img); //send the image URL
//       break;
//     case '!joke':
//       //   msg.channel.send("Here's your joke!"); //Replies to user command
//       const yourJoke = await getJoke(); //fetches an URL from the API
//       console.log(yourJoke);
//       console.log(yourJoke.value);
//       msg.reply(`Here's your joke \n\n ${yourJoke.value} `);
//       break;
//     case '!eye':
//       msg.channel.send('You are now subscribed to eye reminders.');
//       interval = setInterval(function () {
//         msg.channel.send('Please take an eye break now!').catch(console.error);
//       }, 1000); //every hour
//       break;
//     case '!stop':
//       msg.channel.send('You have stopped eye reminders.');
//       clearInterval(interval);
//       break;
//   }
// });

// async function getJoke() {
//   const res = await axios.get('https://api.chucknorris.io/jokes/random');
//   return res.data;
// }

// //add this function below client.on('message' ...
// async function getMeme() {
//   const res = await axios.get('https://memeapi.pythonanywhere.com/');
//   return res.data.memes[0].url;
// }

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token
