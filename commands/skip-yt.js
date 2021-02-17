module.exports = {
  name: "skip",
  description: "Skip a yt video!",
  execute(message, args) {
    message.delete();
    const sender_guild = message.member.guild.id;
    const sender_vc = message.member.voice.channel;
    if (!sender_vc) {
      console.error("User must be in a voice channel");
      return;
    }
    const bot_vc = message.client.voice.connections.get(sender_guild);
    if (bot_vc) {
      bot_vc.dispatcher.end();
    }
  },
};
