import fetch from 'node-fetch';

export default async function (msg, args) {
  if (!args.length)
    return msg.channel.send('You need to send a second argument!');

  const keywords = args.join(' ');

  let url = `https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=${keywords}`;

  let response = await fetch(url);
  const data = await response.json();
  
  if (data.data.length) {
    const index = Math.floor(Math.random() * data.data.length);
    return msg.channel.send(data.data[index].url);
  } else {
    return msg.channel.send("can't find a gif 😥");
  }
}
