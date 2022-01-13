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

import choochoo from './commands/choochoo.js';
import avatar from './commands/avatar.js';
import meme from './commands/meme.js';
import music from './commands/music.js';
import gif from './commands/gif.js';

const commands = { choochoo, avatar, meme, music, gif }; // functions inside some sort of list/array/whatever is also known as a jump table technique,

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
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
    case 'gif': {
      await commands[command](message, args);
      break;
    }

    default: {
      message.reply('Please Enter a Valid Command!');
    }
  }
});

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token
