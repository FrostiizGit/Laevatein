const ytdl = require("ytdl-core");

const playlist_queue = [];

const prepare_embed_msg = (details, message, yt_url) => {
  const { title, viewCount: view_count, publishDate: publish_date } = details;
  const { url: thumbnail_url } = details.thumbnails[0];

  const embed = {
    color: 0xff0000,
    title: `<a:rainbowPls:543741686598205442> ${title}`,
    url: `${yt_url}`,
    description: `Views: ${view_count} | Published: ${publish_date}`,
    thumbnail: {
      url: `${thumbnail_url}`,
    },
    footer: {
      text: `Added by ${message.author.username}. (Queue ${
        message.client.yt_playlists.length - 1
      })`,
      icon_url: message.author.avatarURL(),
    },
  };
  return embed;
};

const add_to_queue = (link, message) => {
  if (message.length > 9) {
    message.channel.send("Queue is full, a maximum of 10 requests at a time.");
    message.delete();
    return false;
  } else {
    message.client.yt_playlists.push(link);
    return true;
  }
};

const remove_from_queue = (message) => {
  message.client.yt_playlists.shift();
};

const play_video = async (message) => {
  const sender_guild = message.member.guild.id;
  const voice_connection = message.client.voice.connections.get(sender_guild);
  const playlist = message.client.yt_playlists;
  try {
    const stream = ytdl(playlist[0], {
      filter: "audioonly",
    });

    const dispatcher = voice_connection.play(stream);
    dispatcher.on("finish", () => {
      console.log("Dispatcher on finish");
      if (playlist.length === 0) chan.leave();
      else {
        remove_from_queue(message);
        play_video(message);
      }
    });
    dispatcher.on("destroy", () => {
      console.log("destroy");
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  name: "yt",
  description: "Read youtube videos!",
  async execute(message, args) {
    message.delete();
    const sender_guild = message.member.guild.id;
    const sender_vc = message.member.voice.channel;
    if (!sender_vc) {
      console.error("User must be in a voice channel");
      return;
    }

    // - if bot no voice then join user vc if exist
    const queue_status = add_to_queue(args[0], message);
    if (!queue_status) return;

    // Check if bot is in a voice channel
    const bot_vc = message.client.voice.connections.get(sender_guild)?.channel
      .id;
    if (!bot_vc) {
      // Join voice channel
      await sender_vc.join();
    }

    ytdl
      .getInfo(args[0])
      .then((res, err) => {
        const embed = prepare_embed_msg(res.videoDetails, message, args[0]);

        message.channel.send({ embed });
      })
      .catch((err) => {
        console.error(err);
        remove_from_queue();
      });

    if (message.client.yt_playlists.length === 1) {
      play_video(message);
    }
  },
};
