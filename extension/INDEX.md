# 🔍 DeepFake Detector - Firefox Extension

## Overview

This Firefox extension integrates with your Team-Alpha server to detect AI-generated images and deepfakes while browsing the web. Simply click a scan button on any image to get instant deepfake detection results.

## 📁 What's Included

### Core Files
- **manifest.json** - Extension configuration (Manifest V3)
- **content.js** - Runs on web pages, detects images and adds scan buttons
- **background.js** - Handles server communication and image analysis
- **popup.html/css/js** - Beautiful UI for displaying results

### Assets
- **icons/** - Extension icons in multiple sizes (16×16, 48×48, 96×96px)
- **icons/scan.svg** - Scan button icon displayed on images

### Documentation
- **QUICKSTART.md** - Get started in 5 minutes ⭐ START HERE
- **README.md** - Complete guide with features, troubleshooting, API info
- **SETUP_SUMMARY.md** - Overview of features and capabilities
- **config.example.js** - Configuration template for customization
- **install.sh** - Installation helper script

## 🚀 Quick Start (Choose Your Path)

### Path 1: Fastest (2 minutes)
```bash
# 1. In terminal 1 - Start server
cd /home/santosh/dev/Team-Alpha/server
npm start

# 2. In Firefox - Load extension
# Go to: about:debugging#/runtime/this-firefox
# Click: Load Temporary Add-on
# Select: /extension/manifest.json

# 3. Test it!
# Go to google.com, hover image, click purple button
```

### Path 2: Documented (5 minutes)
Read: `QUICKSTART.md` - Step-by-step with explanations

### Path 3: Comprehensive (15 minutes)
Read: `README.md` - Full documentation with all features

## 🎯 What It Does

### Before Installation
- Browse websites normally
- No deepfake detection

### After Installation
- 🎨 Purple scan buttons appear on all images
- 🖱️ Click any button to analyze that image
- 📊 See deepfake confidence score (0-100%)
- 🎨 Images get colored borders:
  - Green: Safe
  - Yellow: Uncertain
  - Red: Deepfake/AI-generated
- 📈 View detailed analysis results

## ⚙️ Configuration

### Default Server
```
http://localhost:3000
```

### Change Server Address
Edit `background.js` line 3:
```javascript
const SERVER_URL = 'http://your-server:3000';
```

Examples:
- Local: `http://localhost:3000`
- Network: `http://192.168.1.100:3000`
- Cloud: `https://api.example.com`

## 🔧 Customization

### Change Indicator Colors
Edit `popup.css`:
- Look for `:root` section
- Change `--success`, `--warning`, `--danger` variables

### Adjust Score Thresholds
Edit `popup.js`:
- Find threshold values in `displayResult()` function
- Change when to show "Safe" vs "Uncertain" vs "Deepfake"

### Modify Button Style
Edit `content.js`:
- Look for `createScanButton()` function
- Adjust button size, colors, animations

## 📊 How It Works

```
1. User visits website
   ↓
2. Extension scans page for <img> tags
   ↓
3. Adds purple scan button to each image
   ↓
4. User clicks button
   ↓
5. Image converted to base64
   ↓
6. Sent to Team-Alpha server (/api/detect)
   ↓
7. Server analyzes with SightEngine or Hive AI
   ↓
8. Results returned to extension
   ↓
9. Popup shows results
   ↓
10. Image highlighted with colored border
```

## 📖 File Guide

| File | Purpose | Modify When |
|------|---------|-------------|
| manifest.json | Extension config | Changing permissions or metadata |
| content.js | Image detection | Changing button behavior or scan timing |
| background.js | Server communication | Changing server URL or API handling |
| popup.js | Result display | Changing result format or thresholds |
| popup.css | UI styling | Changing colors or layout |
| README.md | Documentation | Need help or more info |
| QUICKSTART.md | Quick setup | First time setup |

## 🔒 Privacy & Security

✅ **Secure by Default**
- Images only sent to your configured server
- No external APIs or tracking
- No data storage in extension
- Works with private/local networks
- No analytics or telemetry

## 🆘 Troubleshooting

### Scan button not appearing
- Reload the webpage
- Wait a few seconds (extension scans after 1s and 3s)
- Check browser console (F12) for errors

### "Failed to fetch image" error
- Image has CORS restrictions
- Try another image from different site
- Check image URL is accessible

### "Server error" message
- Verify server is running: `npm start`
- Check server URL in background.js
- Verify API credentials set in server environment
- Check server logs for errors

### Extension won't load
- Verify all files exist in extension folder
- Check manifest.json is valid JSON
- Try `about:debugging#/runtime/this-firefox`

### No results after scanning
- Check Firefox console (F12)
- Verify server is responding
- Try a different image
- Check server logs

## 💡 Tips & Tricks

1. **Test Websites**
   - google.com (Google Images)
   - unsplash.com (free stock photos)
   - wikipedia.org (lots of images)

2. **Debug Mode**
   - Press F12 to open Firefox Developer Tools
   - Go to "Console" tab
   - Look for "DeepFake Detector" messages

3. **Hot Reload**
   - Go to `about:debugging#/runtime/this-firefox`
   - Find "DeepFake Detector"
   - Click ⟳ to reload

4. **Check Server Logs**
   - Watch server terminal for `/api/detect` requests
   - See if images are being analyzed

## 🎓 Learning Resources

- [Mozilla WebExtensions Guide](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- Team-Alpha Server API Documentation
- Firefox Developer Tools (F12)

## 📝 Common Questions

**Q: Do I need to run my own server?**
A: Yes, the extension communicates with Team-Alpha server running on your machine or network.

**Q: Can I use this with a remote server?**
A: Yes! Change SERVER_URL in background.js to any accessible server.

**Q: Does this work on mobile?**
A: Firefox for Android supports extensions, but requires sideloading.

**Q: Can I scan videos?**
A: Currently images only. Video support planned.

**Q: How long does scanning take?**
A: Usually 2-10 seconds depending on image size and server response time.

**Q: Is my data shared?**
A: Only with your configured server. No external sharing.

## 🚀 Next Steps

1. Read `QUICKSTART.md` (5 min)
2. Start Team-Alpha server
3. Load extension in Firefox
4. Test on a website
5. Customize as needed
6. Share with your team!

## 📞 Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Review browser console (F12)
3. Check server logs
4. Read the full README.md
5. Report on GitHub

---

**Status**: ✅ Ready to Use
**Created**: June 13, 2026
**Browser**: Firefox (any recent version)
**Server**: Team-Alpha /api/detect endpoint

Happy scanning! 🔍
