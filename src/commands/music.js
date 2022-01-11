import ytdl from 'ytdl-core';
import ytSearch from 'yt-search';

import {
  joinVoiceChannel,
  generateDependencyReport,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  getVoiceConnection,
} from '@discordjs/voice';

generateDependencyReport();

const queue = new Map();

export default async (msg, args, client, cmd) => {
  const voiceChannel = msg.member.voice.channel;
  if (!voiceChannel)
    return msg.channel.send(
      'You need to be in a voice channel to execute this command!'
    );

  console.log('In a channel');
  const permissions = voiceChannel.permissionsFor(msg.client.user);

  if (!permissions.has('CONNECT'))
    return msg.channel.send('You dont have the correct permissoin!');
  if (!permissions.has('SPEAK'))
    return msg.channel.send('You dont have the correct permission');

  const serverQueue = queue.get(msg.guild.id);
  console.log(serverQueue);

  if (cmd === 'play') {
    if (!args.length)
      return msg.channel.send('You need to send second argument!');

    let song = {};

    if (ytdl.validateURL(args[0])) {
      const song_info = await ytdl.getInfo(args[0]);
      song = {
        title: song_info.videoDetails.title,
        url: song_info.videoDetails.video_url,
      };
    } else {
      const findVideo = async (query) => {
        const videoResult = await ytSearch(query);
        return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
      };
      const video = await findVideo(args.join(' '));
      if (video) {
        song = {
          title: video.title,
          url: video.url,
        };
      } else {
        msg.channel.send('Error finding your Video');
      }
    }

    if (!serverQueue) {
      const queue_constructor = {
        voiceChannel: voiceChannel,
        text_channel: msg.channel,
        connection: null,
        songs: [],
      };

      queue.set(msg.guild.id, queue_constructor);
      queue_constructor.songs.push(song);

      try {
        //await added here for debugging
        const connection = await joinVoiceChannel({
          channelId: msg.member.voice.channel.id,
          guildId: msg.guild.id,
          adapterCreator: msg.guild.voiceAdapterCreator,
        });

        queue_constructor.connection = connection;
        video_player(msg.guild, queue_constructor.songs[0]);
      } catch (err) {
        queue.delete(msg.guild.id);
        msg.channel.send('There was an error connecting!');
        throw err;
      }
    } else {
      serverQueue.songs.push(song);
      return msg.channel.send(`👍 **${song.title}** added to queue!`);
    }
  } else if (cmd === 'skip') skip_song(msg, serverQueue);
  else if (cmd === 'stop') stop_song(msg, serverQueue);
};

const video_player = async (guild, song) => {
  const song_queue = queue.get(guild.id);

  //If no song is left in the server queue. Leave the voice channel and delete the key and value pair from the global queue.
  if (!song) {
    song_queue.voice_channel.leave();
    queue.delete(guild.id);
    return;
  }
  const stream = ytdl(song.url, { filter: 'audioonly' });

  const player = await createAudioPlayer(); //////////////////////////////////////////////////
  const resource = await createAudioResource(stream); /////////////////////////////////////////////
  await song_queue.connection.subscribe(player); ////////////////////////////////////////////////////////////

  player.play(resource, { seek: 0, volume: 0 });

  player.on(AudioPlayerStatus.Idle, () => {
    song_queue.songs.shift();
    video_player(guild, song_queue.songs[0]);
  });

  await song_queue.text_channel.send(`🎶 Now playing **${song.title}**`);
};

const skip_song = (msg, server_queue) => {
  if (!msg.member.voice.channel)
    return msg.channel.send(
      'You need to be in a channel to execute this command!'
    );
  if (!server_queue) {
    return msg.channel.send(`There are no songs in queue 😔`);
  }
  server_queue.connection.dispatcher.end();
};

const stop_song = (msg, server_queue) => {
  if (!msg.member.voice.channel)
    return msg.channel.send(
      'You need to be in a channel to execute this command!'
    );
  // player.stop();
  const connection = getVoiceConnection(msg.guild.id);
  connection.destroy();
  queue.clear();

  // server_queue.songs = [];
  // console.log(server_queue.length);
  // server_queue.connection.dispatcher.end();
};
