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

if (!DISCORD_TOKEN || !GUILD_ID) {
  console.error("Missing DISCORD_TOKEN or GUILD_ID environment variables.");
  Deno.exit(1);
}

// Define commands
const commands: CreateSlashApplicationCommand[] = [
  {
    name: "neko",
    description: "にゃーんと返します",
  },
  {
    name: "floridatime",
    description: "responds with the current time in Florida",
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

// Handle text commands
bot.events.messageCreate = async (b, message) => {
  if (message.content === "!neko") {
    await b.helpers.sendMessage(message.channelId, { content: "にゃーん" });
  } else if (message.content === "!floridatime") {
    const floridaTime = new Date().toLocaleString("en-US", {
      timeZone: "America/New_ York",
    });
    await b.helpers.sendMessage(message.channelId, {
      content: `The current time in Florida is: ${floridaTime}`,
    });
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
              content: "にゃーん！！",
            },
          },
        );
        break;
      }
      case "floridatime": {
        await b.helpers.sendInteractionResponse(
          interaction.id,
          interaction.token,
          {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
              content: `The current time in Florida is: ${
                new Date().toLocaleString(
                  "en-US",
                  { timeZone: "America/New_York" },
                )
              }`,
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
