# Configuration Guide

This guide will help you configure the WebRTC SIP Card for Home Assistant.

## Basic Configuration

The WebRTC SIP Card can be configured either through the visual editor in Home Assistant or manually using YAML configuration.

### Required Settings

At minimum, you need to provide these settings:

- `type`: Must be `custom:ha-webrtc-sip-card`
- `server_url`: The WebSocket URL of your SIP server (e.g., `wss://your-sip-server.com:8089/ws`)
- `username`: Your SIP account username
- `password`: Your SIP account password

### Optional Settings

- `title`: Card title (default: "WebRTC SIP Phone")
- `domain`: SIP domain (defaults to server hostname)
- `display_name`: Display name for outgoing calls
- `websocket_port`: WebSocket port (default: 443 for wss, 80 for ws)
- `use_secure`: Use secure WebSocket connection (default: true if server_url starts with wss://)
- `debug`: Enable debug logging (default: false)
- `hide_keypad`: Hide the DTMF keypad (default: false)
- `contacts`: Array of contact objects

## Contact Configuration

Each contact object should have:

- `name`: Contact display name
- `extension`: Contact extension to dial
- `icon`: Contact icon (Material Design icon, default: "mdi:account")

## Examples

### Basic Configuration

```yaml
type: custom:ha-webrtc-sip-card
server_url: wss://sip.example.com:8089/ws
username: homeassistant
password: yourpassword
```

### Full Configuration with Contacts

```yaml
type: custom:ha-webrtc-sip-card
title: Office Phone
server_url: wss://sip.example.com:8089/ws
username: homeassistant
password: yourpassword
domain: sip.example.com
display_name: Home Assistant Phone
websocket_port: 8089
use_secure: true
contacts:
  - name: Front Door
    extension: "1001"
    icon: mdi:door
  - name: Kitchen
    extension: "1002"
    icon: mdi:silverware
  - name: Office
    extension: "1003"
    icon: mdi:desk
debug: false
hide_keypad: false
```

### Audio-Only Configuration

For audio-only calls without video:

```yaml
type: custom:ha-webrtc-sip-card
server_url: wss://sip.example.com:8089/ws
username: homeassistant
password: yourpassword
contacts:
  - name: Reception
    extension: "1000"
    icon: mdi:reception-4
```

## Visual Editor

The easiest way to configure this card is through the visual editor in the Home Assistant dashboard UI:

1. Add the WebRTC SIP Card to your dashboard
2. Click on the "Configure" tab in the card editor
3. Fill in the required fields: server URL, username, password
4. Optionally set the title, domain, display name, and other settings
5. Add contacts using the "Add Contact" button
6. Save the configuration

## SIP Server Configuration Tips

### Asterisk
- Enable WebSocket connections in `sip.conf` or `pjsip.conf`
- Configure WSS (secure WebSocket) for production
- Set appropriate STUN/TURN servers for NAT traversal

### FreeSWITCH
- Enable the `mod_verto` or WebSocket module
- Configure the appropriate port and SSL certificates
- Ensure firewall allows WebSocket connections

### General SIP Server Settings
- Use secure WebSocket (wss://) for production
- Configure STUN/TURN servers for NAT traversal
- Ensure proper authentication mechanisms
- Configure appropriate codecs (OPUS, PCMU, PCMA for audio; VP8, H.264 for video)