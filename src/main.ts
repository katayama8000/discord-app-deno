import {
  createBot,
  type CreateSlashApplicationCommand,
  Intents,
  InteractionResponseTypes,
  startBot,
} from "https://deno.land/x/discordeno@17.1.0/mod.ts";

Deno.cron("Continuous Request", "*/2 * * * *", () => {
  console.log("running...");
});

console.log("Starting bot...");

const DISCORD_TOKEN = Deno.env.get("DISCORD_TOKEN");
const GUILD_ID = Deno.env.get("GUILD_ID");

if (!DISCORD_TOKEN || !GUILD_ID) {
  throw new Error("Missing DISCORD_TOKEN or GUILD_ID environment variables.");
}

// Define commands
const commands: CreateSlashApplicationCommand[] = [
  {
    name: "neko",
    description: "responds with meow",
  },
  {
    name: "japan",
    description: "responds with the current time in Japan",
  },
  {
    name: "florida(central)",
    description: "responds with the current time in Florida (Central Time)",
  },
  {
    name: "moufu",
    description: "responds with a picture of a moufu",
  },
  {
    name: "ikura",
    description: "responds with the current price of ikura",
  },
];

async function registerCommands(guildId: string) {
  for (const command of commands) {
    await bot.helpers.createGuildApplicationCommand(command, guildId);
  }
  await bot.helpers.upsertGuildApplicationCommands(guildId, commands);
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

//Handle text commands
bot.events.messageCreate = async (b, message) => {
  if (message.content === "!neko") {
    await b.helpers.sendMessage(message.channelId, { content: "meow" });
  } else {
    console.log("unhandled message", message.content);
  }
};

// Handle slash commands
bot.events.interactionCreate = async (b, interaction) => {
  const commandName = interaction.data?.name;
  if (commandName) {
    switch (commandName) {
      case "neko": {
        await b.helpers.sendInteractionResponse(
          interaction.id,
          interaction.token,
          {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
              content: "meow",
            },
          },
        );
        break;
      }
      case "japan": {
        await b.helpers.sendInteractionResponse(
          interaction.id,
          interaction.token,
          {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
              content: `The current time in Japan is: ${
                new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
              }`,
            },
          },
        );
        break;
      }
      case "florida(central)": {
        await b.helpers.sendInteractionResponse(
          interaction.id,
          interaction.token,
          {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
              content: `The current time in Florida is: ${
                new Date().toLocaleString(
                  "en-US",
                  { timeZone: "America/Chicago" },
                )
              }`,
            },
          },
        );
        break;
      }
      case "moufu": {
        await b.helpers.sendInteractionResponse(
          interaction.id,
          interaction.token,
          {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
              content: "https://gyazo.com/394c0fe3876bebb679ced189e0c4bc15",
            },
          },
        );
        break;
      }
      case "ikura": {
        await b.helpers.sendInteractionResponse(
          interaction.id,
          interaction.token,
          {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
              content: "https://gyazo.com/40d83420ad0240c53f30d2998b3d2b56",
            },
          },
        );
        break;
      }
      default: {
        break;
      }
    }
  }
};

// Start the bot
await registerCommands(GUILD_ID);
await startBot(bot);
