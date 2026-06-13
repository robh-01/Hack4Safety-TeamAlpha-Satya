# 🚀 Quick Start Guide - DeepFake Detector Extension

## 5-Minute Setup

### Step 1: Start the Server
```bash
cd /home/santosh/dev/Team-Alpha/server
npm start
```

The server will run on `http://localhost:3000` by default.

**Note:** Make sure your server environment variables are set:
```bash
export SIGHT_ENGINE_API_USER=your_api_user
export SIGHT_ENGINE_API_SECRET=your_api_secret
# OR
export HIVE_API_KEY=your_hive_api_key
```

### Step 2: Load Extension in Firefox

1. Open Firefox
2. Type `about:debugging#/runtime/this-firefox` in the address bar
3. Click **"Load Temporary Add-on"**
4. Navigate to `/home/santosh/dev/Team-Alpha/extension`
5. Select **`manifest.json`**
6. ✅ Extension is now active!

### Step 3: Try It Out

1. Go to any website with images (e.g., google.com, unsplash.com)
2. Hover over any image
3. Click the purple **scan button** that appears
4. Wait for analysis (~2-10 seconds)
5. View results in the popup!

## Configuration

### If Your Server is NOT on localhost:3000

Edit `/home/santosh/dev/Team-Alpha/extension/background.js`:

Find line ~3:
```javascript
const SERVER_URL = 'http://localhost:3000';
```

Change to your server address:
```javascript
const SERVER_URL = 'http://your-server-ip:3000';
// Example: const SERVER_URL = 'http://192.168.1.100:3000';
```

Then reload the extension in Firefox.

## What Each File Does

| File | Purpose |
|------|---------|
| `manifest.json` | Extension configuration |
| `content.js` | Detects images, adds scan buttons |
| `background.js` | Sends images to server for analysis |
| `popup.html/css/js` | Shows results to user |
| `icons/` | Extension icons |

## Indicator Colors

- **🟢 Green border**: Likely authentic
- **🟡 Yellow border**: Uncertain - may be AI-generated
- **🔴 Red border**: Likely deepfake/AI-generated

## Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Scan button doesn't appear | Reload the webpage |
| "Failed to fetch image" | Image has CORS restrictions, try another image |
| "Server error" | Check server is running: `npm start` in server folder |
| No results after clicking | Check browser console (F12) for errors |
| Extension won't load | Verify all files exist in extension folder |

## Development/Testing

### View Console Logs
Press `F12` in Firefox → Go to "Console" tab

Look for:
- `DeepFake Detector background script loaded` ✅
- `DeepFake Detector content script loaded` (appears on web pages)

### Hot Reload

**For manifest.json changes:**
1. Go to `about:debugging#/runtime/this-firefox`
2. Find "DeepFake Detector"
3. Click the ⟳ reload button

**For code changes (content.js):**
- Simply reload the webpage (F5 or Ctrl+R)

**For background.js:**
- Reload the extension via about:debugging

## API Response Example

Server responds with NDJSON format:
```
{"type":"status","message":"Sending to SightEngine for image analysis..."}
{"type":"status","message":"Analysis complete"}
{"type":"result","data":{"nsfw":0.05,"nudity":{},"ai_generated":0.02}}
```

The extension parses this and shows:
- **Deepfake Score**: `0.02` → 2% (Green indicator - safe)
- **Service**: SightEngine

## Next Steps

- Read full docs in `README.md`
- Customize server URL for your setup
- Test with various images
- Check server logs for API calls

## Still Need Help?

1. Check Firefox console (F12)
2. Check server terminal output
3. Verify server is running
4. Ensure server credentials are set
5. Try a different image

Enjoy scanning! 🔍
