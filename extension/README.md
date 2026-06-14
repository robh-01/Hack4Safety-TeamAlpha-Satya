# satya Firefox Extension

A Firefox extension that scans images while browsing to detect AI-generated content and deepfakes using your Team-Alpha server.

## Features

- **Automatic Image Detection**: Scans all images on web pages and adds a scan button near each one
- **One-Click Analysis**: Click the purple scan icon to analyze any image
- **Real-time Results**: Shows deepfake/AI-generation scores with visual indicators
- **Color-Coded Indicators**:
  - 🟢 Green: Likely authentic
  - 🟡 Yellow: Uncertain - May be AI-generated
  - 🔴 Red: Likely AI-generated or deepfake
- **Detailed Results**: View comprehensive analysis data from the detection service
- **Dynamic Content Support**: Automatically detects images added to pages after loading

## Installation

### Prerequisites

- Firefox browser (version 48+)
- Team-Alpha server running locally or remotely
- Server credentials configured (SIGHT_ENGINE_API_USER/SECRET or HIVE_API_KEY)

### Steps

1. **Clone or download this extension** from the Team-Alpha repository

   ```bash
   cd /home/santosh/dev/Team-Alpha/extension
   ```

2. **Configure the server URL**
   - Open `background.js` in an editor
   - Find the line: `const SERVER_URL = 'http://localhost:3000';`
   - Update the URL to match your server's address (e.g., `http://192.168.1.100:3000`)
   - Save the file

3. **Load the extension in Firefox**
   - Open Firefox and go to `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Navigate to the `extension` folder and select `manifest.json`
   - The extension is now loaded!

## Usage

### Scanning Images

1. Navigate to any website with images
2. Hover over an image to reveal the purple scan button
3. Click the scan button
4. Wait for analysis (usually 2-10 seconds depending on image size)
5. View results in the popup that appears
6. The image border will also change color based on the result:
   - **Green border**: Safe image
   - **Yellow border**: Uncertain
   - **Red border**: Likely deepfake

### Reading Results

The popup shows:

- **Analysis Source**: Which service analyzed the image (SightEngine or Hive AI)
- **Deepfake Score**: Percentage confidence (0% = safe, 100% = likely deepfake)
- **Assessment**: Human-readable verdict
- **Detailed Results**: Full JSON response from the server (click to expand)

## Configuration

### Server URL

Edit `background.js` and change:

```javascript
const SERVER_URL = "http://localhost:3000";
```

Common configurations:

- Local development: `http://localhost:3000`
- Remote server: `http://your-server.com:3000`
- Network machine: `http://192.168.1.100:3000`

### Supported Analysis Services

The extension works with both SightEngine and Hive AI:

- **Images**: Can use either SightEngine or Hive AI
- **Videos**: Requires Hive AI
- **Deepfakes**: Both services detect deepfakes

## Architecture

### Files

- **manifest.json**: Extension configuration and permissions
- **content.js**: Injects scan buttons on web pages, handles image detection
- **background.js**: Manages communication with server, analyzes images
- **popup.html/css/js**: Displays analysis results to user
- **icons/**: Extension icon files

### Flow

1. **Content Script** (`content.js`)
   - Scans page for images
   - Adds purple scan button to each image
   - Watches for dynamically added images
   - Handles click events on scan buttons

2. **Background Script** (`background.js`)
   - Receives scan requests from content script
   - Converts image URL to base64
   - Sends to Team-Alpha server (`POST /api/detect`)
   - Parses NDJSON response
   - Returns results to content script

3. **Popup** (`popup.js`)
   - Displays analysis results
   - Shows deepfake score with visual bar
   - Highlights assessment (safe/uncertain/deepfake)
   - Shows detailed raw data from server

## Troubleshooting

### Extension doesn't load

- Check Firefox console for errors: Press `Ctrl+Shift+K`
- Verify manifest.json is valid JSON (use a JSON validator)
- Ensure all referenced files exist

### Scan button doesn't appear

- Wait a few seconds - extension scans on page load and after 1s/3s delays
- Try reloading the page
- Check console for errors

### Error: "Failed to fetch image"

- The image may have CORS restrictions
- Try scanning on a different website
- Check network tab in Firefox DevTools

### Error: "Server error"

- Verify Team-Alpha server is running (`npm start` in server folder)
- Check server is accessible at the configured URL
- Verify server API credentials are set (SIGHT_ENGINE_API_USER/SECRET or HIVE_API_KEY)
- Check server logs for errors

### Analysis takes too long

- Large images take longer to analyze
- Server API may be slow
- Check internet connection
- Try a smaller image

### No results shown

- Check browser console for errors
- Verify server is responding correctly
- Try scanning a different image

## Development

### Modifying the Extension

1. Edit the relevant file (content.js, background.js, popup.js, etc.)
2. If you modified manifest.json, reload the extension:
   - Go to `about:debugging#/runtime/this-firefox`
   - Find "satya" and click the reload button
3. If you modified other files:
   - For content.js: Reload the web page in Firefox
   - For background.js: Reload the extension
   - For popup.js: Close and reopen the popup

### Testing

1. Open Firefox DevTools: `F12`
2. Go to the "Console" tab
3. Look for messages like "satya background script loaded"
4. Test scanning on sites like:
   - Google Images
   - Unsplash
   - Wikipedia (has many images)

## API Integration

The extension sends images to your Team-Alpha server's `/api/detect` endpoint:

### Request Format

```json
POST /api/detect
Content-Type: application/json

{
  "media": "base64_encoded_image_data",
  "filename": "image.jpg"
}
```

### Response Format (NDJSON)

```
{"type":"status","message":"Sending to SightEngine for image analysis..."}
{"type":"status","message":"Analysis complete"}
{"type":"result","data":{...analysis results...}}
```

## Permissions Explained

- **activeTab**: Access current tab for image scanning
- **scripting**: Inject content script to detect images
- **webRequest**: Monitor web requests (planned for future)
- **tabs**: Get tab information
- **\<all_urls\>**: Scan images on any website

## Privacy & Security

- Images are sent to your configured server
- No data is stored by the extension
- No tracking or analytics
- All processing is done by your server

## Future Enhancements

Potential improvements:

- [ ] Batch scan multiple images
- [ ] Save scan history
- [ ] Custom scan settings
- [ ] Video deepfake detection
- [ ] Browser storage for cached results
- [ ] Dark mode
- [ ] Keyboard shortcuts

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review browser console logs (F12 → Console)
3. Check server logs for API errors
4. Report issues at: https://github.com/anomalyco/opencode

## License

This extension is part of Team-Alpha project.
