import fetch from 'node-fetch';

export default async function (msg) {
  msg.channel.send("Here's your meme!"); //Replies to user command
  const img = await getMeme(); //fetches an URL from the API
  msg.channel.send(img); //send the image URL
}

//add this function below client.on('message' ...
async function getMeme() {
  const response = await fetch('https://memeapi.pythonanywhere.com/');
  const data = await response.json();
  return data.memes[0].url;
}
