import fetch from 'node-fetch';

export default async function (msg, args) {
  if (!args.length)
    return msg.channel.send('You need to send a second argument!');

  const keywords = args.join(' ');

  let url = `https://g.tenor.com/v1/search?q=${keywords}&key=LIVDSRZULELA&limit=8`;

  // let url = `https://api.giphy.com/v1/gifs/ok&key=LIVDSRZULELA&limit=8`

  let response = await fetch(url);
  const data = await response.json();

  const index = Math.floor(Math.random() * data.results.length);
  msg.channel.send(data.results[index].url);
}
