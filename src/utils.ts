import type { SIPCardConfig, SIPContact } from "./types";
import { DEFAULT_CONFIG } from "./constants";

export function mergeConfig(userConfig: Partial<SIPCardConfig>): SIPCardConfig {
  return {
    ...DEFAULT_CONFIG,
    ...userConfig,
    contacts: userConfig.contacts || DEFAULT_CONFIG.contacts,
    stun_servers: userConfig.stun_servers || DEFAULT_CONFIG.stun_servers,
    turn_servers: userConfig.turn_servers || DEFAULT_CONFIG.turn_servers,
  };
}

export function validateConfig(config: SIPCardConfig): void {
  if (!config.server_url) {
    throw new Error("server_url is required");
  }
  if (!config.username) {
    throw new Error("username is required");
  }
  if (!config.password) {
    throw new Error("password is required");
  }

  // Validate WebSocket URL
  try {
    const url = new URL(config.server_url);
    if (!["ws:", "wss:"].includes(url.protocol)) {
      throw new Error("server_url must use ws:// or wss:// protocol");
    }
  } catch (error) {
    throw new Error("Invalid server_url format");
  }
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function formatPhoneNumber(number: string): string {
  // Simple formatting - can be enhanced based on requirements
  const cleaned = number.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return number;
}

export function playRingtone(): HTMLAudioElement | null {
  try {
    const audio = new Audio();
    audio.src =
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBQ==";
    audio.loop = true;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Ignore autoplay policy errors
      });
    }
    return audio;
  } catch (error) {
    console.warn("Failed to play ringtone:", error);
    return null;
  }
}

export function stopRingtone(audio: HTMLAudioElement | null): void {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}

export function getContactByExtension(contacts: SIPContact[], extension: string): SIPContact | undefined {
  return contacts.find((contact) => contact.extension === extension);
}

export function sanitizeExtension(extension: string): string {
  return extension.replace(/[^\d*#+]/g, "");
}

export function debugLog(debug: boolean, message: string, ...args: any[]): void {
  if (debug) {
    console.log(`[WebRTC SIP Card] ${message}`, ...args);
  }
}

export function errorLog(message: string, error?: any): void {
  console.error(`[WebRTC SIP Card] ${message}`, error);
}
