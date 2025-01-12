import {
  createBot,
  type CreateSlashApplicationCommand,
  Intents,
  InteractionResponseTypes,
  startBot,
} from "./deps.ts";
import { Secret } from "./secret.ts";

console.log("Starting bot...");
console.log("DISCORD_TOKEN:", Secret.DISCORD_TOKEN);
console.log("GUILD_ID:", Secret.GUILD_ID);

const bot = createBot({
  token: Secret.DISCORD_TOKEN,
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

await bot.helpers.createGuildApplicationCommand(nekoCommand, Secret.GUILD_ID);
await bot.helpers.upsertGuildApplicationCommands(Secret.GUILD_ID, [
  nekoCommand,
]);

await bot.helpers.createGuildApplicationCommand(
  getFloridaTimeCommand,
  Secret.GUILD_ID,
);
await bot.helpers.upsertGuildApplicationCommands(Secret.GUILD_ID, [
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
