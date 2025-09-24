# Installation Guide

This guide will help you install the WebRTC SIP Card for Home Assistant.

## Prerequisites

- Home Assistant 2023.4.0 or later
- A SIP server that supports WebSocket connections (like Asterisk, FreeSWITCH, etc.)
- Browser that supports WebRTC and MediaStream API (Chrome, Firefox, Edge, Safari 15+)
- HTTPS for production environments (required for WebRTC functionality)

## Installation Methods

### HACS Installation (Recommended)

1. Open HACS in your Home Assistant instance
2. Click on "Frontend" in the bottom bar
3. Click on the 3-dots menu in the top right
4. Select "Custom repositories"
5. Add this repository URL: `https://github.com/Ahmed9190/ha-webrtc-sip-card`
6. Select "Lovelace" as category
7. Click "Install"
8. Restart Home Assistant
9. Go to your dashboard and add a new card
10. Select "WebRTC SIP Card" from the card picker

### Manual Installation

1. Download the latest `ha-webrtc-sip-card.js` from the [releases page](https://github.com/Ahmed9190/ha-webrtc-sip-card/releases)
2. Place the file in your `config/www/` folder
3. Add the resource to your dashboard:
   - Go to Settings → Dashboards
   - Click the three dots menu, then "Resources"
   - Click "Add Resource"
   - URL: `/local/ha-webrtc-sip-card.js`
   - Resource type: `JavaScript Module`
4. Restart Home Assistant
5. Go to your dashboard and add a new card
6. Select "WebRTC SIP Card" from the card picker

## Verification

After installation, you should see the "WebRTC SIP Card" option in your card picker when adding a new card to a dashboard. You can also verify that the resource is loaded by checking your browser's developer console for any errors.

## Troubleshooting

If the card doesn't appear in the card picker:

1. Check that the resource is added correctly in Settings → Dashboards → Resources
2. Verify that you're using the correct file name (`ha-webrtc-sip-card.js`)
3. Refresh your browser cache (Ctrl+F5 or Cmd+Shift+R)
4. Check your browser's developer console for any error messages
5. Make sure you have restarted Home Assistant after installation

If you encounter issues with the card functionality:

1. Enable debug mode in the card configuration to see detailed logs
2. Check that your SIP server is accessible and properly configured
3. Verify your browser supports WebRTC functionality