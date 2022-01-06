// import gif from './commands/gif.js';
import choochoo from './commands/choochoo.js';
// import meme from './commands/meme.js';

const commands = { choochoo };

export default async function (msg) {
  if (msg.channel.id == '893197693713809529') {
    let tokens = msg.content.split(' '); //split a string into an array
    let command = tokens.shift(); // removes the first element from an array and returns that removed element.
    if (command.charAt(0) === '!') {
      command = command.substring(1);
      const a = commands[command](msg, tokens);
      if (!a) {
      }
    }
  }
}
