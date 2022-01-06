import fetch from 'node-fetch';

export default async function (msg, args) {
  let keywords = '';
  if (args.length > 0) {
    keywords = args.join(' ');
  }

  let url = `https://api.tenor.com/v1/search?q=${keywords}&key=${process.env.TENORKEY}&contentfilter=high`;

  //   let url = `https://g.tenor.com/v1/registershare?id=8776030&key=LIVDSRZULELA&q=excited`;

  let response = await fetch(url);
  console.log(response.length);

  const index = Math.floor(Math.random() * response.length);
  msg.channel.send(response.data.results[index].url);
  //   console.log(object);
  msg.channel.send('GIF from Tenor: ' + keywords);
}
