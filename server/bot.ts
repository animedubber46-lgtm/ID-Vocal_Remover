
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { NewMessage } from "telegram/events";
import { storage } from "./storage";
import { processAudio } from "./ffmpeg";
import * as fs from "fs";
import * as path from "path";

// Configuration
const API_ID = parseInt(process.env.API_ID || "0");
const API_HASH = process.env.API_HASH || "";
const BOT_TOKEN = process.env.BOT_TOKEN || "";
const LOG_CHANNEL = process.env.LOG_CHANNEL || ""; // Channel ID or username
const OWNER_ID = process.env.OWNER_ID || "";
const WELCOME_IMAGE = "https://imageupscaler.com/wp-content/uploads/2024/11/image-before-using-upscale-anime-pfp-tool.jpg";

let client: TelegramClient;

export async function startBot() {
  if (!API_ID || !API_HASH || !BOT_TOKEN) {
    await storage.createLog({
      level: "error",
      message: "Missing Telegram credentials (API_ID, API_HASH, BOT_TOKEN)",
    });
    console.error("Missing Telegram credentials");
    return;
  }

  await storage.createLog({
    level: "info",
    message: "Starting Telegram Bot...",
  });

  client = new TelegramClient(new StringSession(""), API_ID, API_HASH, {
    connectionRetries: 5,
  });

  await client.start({
    botAuthToken: BOT_TOKEN,
  });

  await storage.createLog({
    level: "info",
    message: "Bot connected successfully!",
  });

  // Handle /start
  client.addEventHandler(async (event: any) => {
    const message = event.message;
    if (message.text === "/start") {
      await client.sendMessage(message.chatId, {
        message: "Welcome! Send me an audio file to extract the background voice.",
        file: WELCOME_IMAGE,
      });
    }
  }, new NewMessage({ pattern: "/start" }));

  // Handle Audio/Voice
  client.addEventHandler(async (event: any) => {
    const message = event.message;
    if (message.media && (message.media.document || message.media.audio || message.media.voice)) {
        // Check file size limit (simulated check, GramJS handles large files but we might want to limit)
        const fileSize = message.file?.size;
        if (fileSize && fileSize > 500 * 1024 * 1024) {
            await client.sendMessage(message.chatId, { message: "File too large. Limit is 500MB." });
            return;
        }

        const statusMessage = await client.sendMessage(message.chatId, { message: "Starting download..." });
        await storage.createLog({
            level: "info",
            message: `Processing file from ${message.chatId}`,
        });

        try {
            const buffer = await client.downloadMedia(message, {
                progressCallback: async (total, loaded) => {
                    const percentage = Math.round((loaded / total) * 100);
                    if (percentage % 20 === 0) { // Update every 20% to avoid flood
                        await client.editMessage(message.chatId, {
                            message: statusMessage.id,
                            text: `Downloading: ${percentage}%`
                        }).catch(() => {});
                    }
                }
            });

            if (buffer) {
                await client.editMessage(message.chatId, {
                    message: statusMessage.id,
                    text: "Processing audio (Background extraction)..."
                });

                // Save to temp file
                const inputPath = path.resolve("temp_input_" + Date.now() + ".mp3");
                const outputPath = path.resolve("temp_output_" + Date.now() + ".mp3");
                
                fs.writeFileSync(inputPath, buffer as Buffer);

                // Process
                await processAudio(inputPath, outputPath);

                await client.editMessage(message.chatId, {
                    message: statusMessage.id,
                    text: "Uploading processed audio..."
                });

                // Upload back
                await client.sendFile(message.chatId, {
                    file: outputPath,
                    caption: "Here is your processed audio (Background extracted).",
                    replyTo: message.id,
                    progressCallback: async (total, loaded) => {
                        const percentage = Math.round((loaded / total) * 100);
                        if (percentage % 20 === 0) {
                            await client.editMessage(message.chatId, {
                                message: statusMessage.id,
                                text: `Uploading: ${percentage}%`
                            }).catch(() => {});
                        }
                    }
                });

                await client.deleteMessages(message.chatId, [statusMessage.id], { revoke: true }).catch(() => {});
                
                // Send to log channel if configured
                if (LOG_CHANNEL) {
                    await client.sendFile(LOG_CHANNEL, {
                        file: outputPath,
                        caption: `Processed file for user ${message.chatId}`,
                    });
                }

                // Cleanup
                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
                
                await storage.createLog({
                    level: "info",
                    message: `Successfully processed file for ${message.chatId}`,
                });
            }
        } catch (error: any) {
            console.error(error);
            await client.sendMessage(message.chatId, { message: "Error processing audio: " + error.message });
            await storage.createLog({
                level: "error",
                message: `Error processing file: ${error.message}`,
            });
        }
    }
  }, new NewMessage({}));
}
