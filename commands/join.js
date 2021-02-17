module.exports = {
  name: "join",
  description: "Join a voice channel, or switch to another one",
  async execute(message, args) {
    message.delete();
    const sender_guild = message.member.guild.id;
    const sender_vc = message.member.voice.channel;
    if (!sender_vc) {
      console.error("User must be in a voice channel");
      return;
    }
    const bot_vc = message.client.voice.connections.get(sender_guild);

    // Check if bot is in a voice channel
    const bot_vc_id = bot_vc?.channel.id;
    const sender_vc_id = sender_vc?.id;
    if (bot_vc_id != sender_vc_id || !bot_vc_id) {
      await sender_vc.join();
    }
  },
};
