
# Telegram Audio Processor Bot

A Telegram bot that extracts background voice (instrumental) from audio files up to 500MB.

## Features
- Extracts background audio (simple vocal removal)
- Supports files up to 500MB (using MTProto)
- Logs activities to a configured Telegram channel and MongoDB
- Web dashboard for logs

## Prerequisites
- Node.js 20+
- FFmpeg installed on the system
- Telegram API ID and Hash (from my.telegram.org)
- Telegram Bot Token (from @BotFather)
- MongoDB URI (optional)

## Environment Variables
Create a `.env` file with:
```
DATABASE_URL=postgresql://...
API_ID=your_api_id
API_HASH=your_api_hash
BOT_TOKEN=your_bot_token
LOG_CHANNEL=your_log_channel_id
OWNER_ID=your_user_id
MONGO_URI=your_mongo_uri
```

## Deployment
1. **Heroku**:
   - Connect repository
   - Add `https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git` to buildpacks
   - Set environment variables
   - Deploy

2. **Replit**:
   - Import project
   - Set Secrets
   - Run

## Usage
1. Start the bot.
2. Send `/start`.
3. Send an audio file.
4. Wait for the processed file.
