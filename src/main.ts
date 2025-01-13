import {
  Bot,
  createBot,
  type CreateSlashApplicationCommand,
  Intents,
  Interaction,
  InteractionResponseTypes,
  startBot,
} from "https://deno.land/x/discordeno@17.1.0/mod.ts";

// Cron job for periodic tasks
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
  { name: "neko", description: "responds with meow" },
  { name: "japan", description: "responds with the current time in Japan" },
  {
    name: "florida",
    description: "responds with the current time in Florida (Central Time)",
  },
  { name: "moufu", description: "responds with a picture of a moufu" },
  { name: "ikura", description: "responds with the current price of ikura" },
];

// Register slash commands
const registerCommands = async (guildId: string): Promise<void> => {
  await bot.helpers.upsertGuildApplicationCommands(guildId, commands);
};

// Create the bot
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
bot.events.messageCreate = async (bot, message): Promise<void> => {
  if (message.content === "!neko") {
    await bot.helpers.sendMessage(message.channelId, { content: "meow" });
  } else {
    console.log("Unhandled message:", message.content);
  }
};

// Helper functions for slash command responses
const sendTimeResponse = async (
  bot: Bot,
  interaction: Interaction,
  timeZone: string,
  location: string,
): Promise<void> => {
  const time = new Date().toLocaleString("en-US", { timeZone });
  await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
    type: InteractionResponseTypes.ChannelMessageWithSource,
    data: { content: `The current time in ${location} is: ${time}` },
  });
};

const sendImageResponse = async (
  bot: Bot,
  interaction: Interaction,
  url: string,
): Promise<void> => {
  await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
    type: InteractionResponseTypes.ChannelMessageWithSource,
    data: { content: url },
  });
};

// Handle slash commands
bot.events.interactionCreate = async (bot, interaction): Promise<void> => {
  const commandName = interaction.data?.name;
  if (!commandName) return;

  switch (commandName) {
    case "neko":
      await bot.helpers.sendInteractionResponse(
        interaction.id,
        interaction.token,
        {
          type: InteractionResponseTypes.ChannelMessageWithSource,
          data: { content: "meow" },
        },
      );
      break;

    case "japan":
      await sendTimeResponse(bot, interaction, "Asia/Tokyo", "Japan");
      break;

    case "florida":
      await sendTimeResponse(bot, interaction, "America/Chicago", "Florida");
      break;

    case "moufu":
      await sendImageResponse(
        bot,
        interaction,
        "https://gyazo.com/394c0fe3876bebb679ced189e0c4bc15",
      );
      break;

    case "ikura":
      await sendImageResponse(
        bot,
        interaction,
        "https://gyazo.com/40d83420ad0240c53f30d2998b3d2b56",
      );
      break;

    default:
      console.log("Unhandled slash command:", commandName);
  }
};

// Start the bot
await registerCommands(GUILD_ID);
await startBot(bot);
