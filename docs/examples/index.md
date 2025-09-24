# Examples

This section provides various examples of how to configure and use the WebRTC SIP Card.

## Basic Video Phone

```yaml
type: custom:ha-webrtc-sip-card
title: Home Video Phone
server_url: wss://sip.yourserver.com:8089/ws
username: homeassistant
password: yourpassword
domain: sip.yourserver.com
display_name: Home Assistant Phone
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
```

## Audio-Only Phone

```yaml
type: custom:ha-webrtc-sip-card
title: Audio Intercom
server_url: ws://internal-sip.local:8089/ws
username: intercom
password: secret
contacts:
  - name: Living Room
    extension: "2001"
    icon: mdi:sofa
  - name: Bedroom
    extension: "2002"
    icon: mdi:bed-king
  - name: Garage
    extension: "2003"
    icon: mdi:garage
hide_keypad: false
debug: false
```

## Emergency Communication System

```yaml
type: custom:ha-webrtc-sip-card
title: Emergency Communication
server_url: wss://emergency-sip.company.com:8089/ws
username: emergency-assistant
password: secure-password
display_name: Emergency Assistant
contacts:
  - name: Security Office
    extension: "911"
    icon: mdi:shield-home
  - name: Building Manager
    extension: "912"
    icon: mdi:account-hard-hat
  - name: Fire Department
    extension: "913"
    icon: mdi:fire
  - name: Medical Response
    extension: "914"
    icon: mdi:medical-bag
use_secure: true
debug: false
```

## Multi-Location Setup

```yaml
type: custom:ha-webrtc-sip-card
title: Multi-Location Phone
server_url: wss://sip.company.com:8089/ws
username: office-assistant
password: password123
domain: sip.company.com
display_name: Office Assistant
contacts:
  - name: New York Office
    extension: "3001"
    icon: mdi:city
  - name: London Office
    extension: "3002"
    icon: mdi:office-building
  - name: Tokyo Office
    extension: "3003"
    icon: mdi:office-building-marker
  - name: Video Conference Room
    extension: "3004"
    icon: mdi:video
  - name: Front Desk
    extension: "3005"
    icon: mdi:reception-4
websocket_port: 8089
use_secure: true
hide_keypad: false
debug: false
```

## Home Automation Integration

```yaml
type: custom:ha-webrtc-sip-card
title: Smart Home Phone
server_url: wss://sip.home.local:8089/ws
username: smart-home
password: home-password
display_name: Smart Home Assistant
contacts:
  - name: Living Room Camera
    extension: "4001"
    icon: mdi:cctv
  - name: Backyard Camera
    extension: "4002"
    icon: mdi:cctv
  - name: Doorbell Camera
    extension: "4003"
    icon: mdi:doorbell-video
  - name: Garage Camera
    extension: "4004"
    icon: mdi:garage
  - name: Alarm System
    extension: "4005"
    icon: mdi:shield-home
debug: false
```

## Troubleshooting Configuration

For debugging purposes, you can enable debug mode:

```yaml
type: custom:ha-webrtc-sip-card
server_url: wss://sip.debug.local:8089/ws
username: debug-user
password: debug-password
contacts:
  - name: Test Extension
    extension: "5001"
    icon: mdi:test-tube
debug: true
use_secure: false  # For testing without SSL
```