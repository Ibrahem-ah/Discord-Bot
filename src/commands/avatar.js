export default function (msg, args, client) {
  if (args[0]) {
    const user = getUserFromMention(args[0]);
    if (!user) {
      return msg.reply(
        'Please use a proper mention if you want to see someone elses avatar.'
      );
    }
    return msg.channel.send(
      `${user.username}'s avatar: ${msg.member.user.displayAvatarURL({
        dynamic: true,
      })}`
    );
  }

  return msg.channel.send(
    `${msg.author.username}, your avatar: ${msg.author.displayAvatarURL({
      dynamic: true,
    })}`
  );

  function getUserFromMention(mention) {
    if (!mention) return;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
      mention = mention.slice(2, -1);

      if (mention.startsWith('!')) {
        mention = mention.slice(1);
      }
      return client.users.cache.get(mention);
    }
  }
}