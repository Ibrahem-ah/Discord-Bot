const replies = ['🚂🌈💖', 'Choo choo!', 'Ding! 🛎', 'Never forget this dot!'];

export default (msg, args) => {
  const index = Math.floor(Math.random() * replies.length);
  msg.channel.send(replies[index]);
};
