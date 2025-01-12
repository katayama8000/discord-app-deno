import { dotenv } from "./deps.ts";

try {
  dotenv.configSync({
    export: true,
    path: "../.env.local",
  });
} catch {
  console.error("Failed to load .env.local");
}

export const Secret = {
  DISCORD_TOKEN: Deno.env.get("DISCORD_TOKEN")!,
  GUILD_ID: Deno.env.get("GUILD_ID")!,
} as const;
