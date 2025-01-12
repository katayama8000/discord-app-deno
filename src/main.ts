import {
  createBot,
  type CreateSlashApplicationCommand,
  Intents,
  InteractionResponseTypes,
  startBot,
} from "./deps.ts";

console.log("Starting bot...");

const DISCORD_TOKEN = Deno.env.get("DISCORD_TOKEN");
const GUILD_ID = Deno.env.get("GUILD_ID");

console.log("DISCORD_TOKEN:", DISCORD_TOKEN);
console.log("GUILD_ID:", GUILD_ID);

if (!DISCORD_TOKEN || !GUILD_ID) {
  console.error("Missing DISCORD_TOKEN or GUILD_ID environment variables.");
  Deno.exit(1);
}

const bot = createBot({
  token: DISCORD_TOKEN,
  intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,

  events: {
    ready: (_bot, payload) => {
      console.log(`${payload.user.username} is ready!`);
    },
  },
});

const nekoCommand: CreateSlashApplicationCommand = {
  name: "neko",
  description: "にゃーんと返します",
};

const getFloridaTimeCommand: CreateSlashApplicationCommand = {
  name: "floridatime",
  description: "responds with the current time in Florida",
};

await bot.helpers.createGuildApplicationCommand(
  nekoCommand,
  GUILD_ID,
);

await bot.helpers.upsertGuildApplicationCommands(GUILD_ID, [
  nekoCommand,
]);

await bot.helpers.createGuildApplicationCommand(
  getFloridaTimeCommand,
  GUILD_ID,
);

await bot.helpers.upsertGuildApplicationCommands(GUILD_ID, [
  getFloridaTimeCommand,
]);

bot.events.messageCreate = (b, message) => {
  if (message.content === "!neko") {
    b.helpers.sendMessage(message.channelId, {
      content: "にゃーん",
    });
  }
};

bot.events.messageCreate = (b, message) => {
  if (message.content === "!floridatime") {
    const floridaTime = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
    });

    b.helpers.sendMessage(message.channelId, {
      content: `The current time in Florida is: ${floridaTime}`,
    });
  }
};

bot.events.interactionCreate = (b, interaction) => {
  switch (interaction.data?.name) {
    case "neko": {
      b.helpers.sendInteractionResponse(interaction.id, interaction.token, {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: "にゃーん！！",
        },
      });

      break;
    }

    case "floridatime": {
      b.helpers.sendInteractionResponse(interaction.id, interaction.token, {
        type: InteractionResponseTypes.ChannelMessageWithSource,

        data: {
          content: `The current time in Florida is: ${
            new Date().toLocaleString(
              "en-US",
              { timeZone: "America/New_York" },
            )
          }`,
        },
      });

      break;
    }

    default: {
      break;
    }
  }
};

await startBot(bot);
