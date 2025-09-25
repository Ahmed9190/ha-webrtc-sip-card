export const CARD_VERSION = "1.0.2";
export const CARD_NAME = "ha-webrtc-sip-card";

import type { SIPCardConfig } from "./types";

export const DEFAULT_CONFIG: SIPCardConfig = {
  type: "custom:ha-webrtc-sip-card",
  title: "WebRTC SIP Phone",
  server_url: "",
  username: "",
  password: "",
  auto_answer: false,
  stun_servers: ["stun:stun.l.google.com:19302"],
  turn_servers: [],
  call_history_enabled: true,
  contacts: [],
  hide_video_controls: false,
  ring_timeout: 30000,
  debug: false,
  theme: "auto",
};

export const SIP_EVENTS = {
  REGISTERED: "registered",
  UNREGISTERED: "unregistered",
  REGISTRATION_FAILED: "registrationFailed",
  INVITE: "invite",
  PROGRESS: "progress",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  CANCEL: "cancel",
  BYE: "bye",
  FAILED: "failed",
  MUTED: "muted",
  UNMUTED: "unmuted",
} as const;

export const CALL_STATUS = {
  IDLE: "idle",
  CONNECTING: "connecting",
  RINGING: "ringing",
  ANSWERED: "answered",
  HELD: "held",
  ENDED: "ended",
  ERROR: "error",
} as const;

export const DTMF_KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["*", "0", "#"],
] as const;

export const VIDEO_CONSTRAINTS = {
  video: {
    width: { ideal: 320 },
    height: { ideal: 240 },
    frameRate: { ideal: 15, max: 30 },
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
};
