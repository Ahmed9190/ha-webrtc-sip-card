import type { CallInfo } from "./sip-manager";
import { SipManager } from "./sip-manager";
import { formatDuration, playRingtone, stopRingtone, getContactByExtension } from "./utils";
import type { SIPContact } from "./types";

export interface CallState {
  active: boolean;
  incoming: boolean;
  outgoing: boolean;
  onHold: boolean;
  muted: boolean;
  remoteVideoEnabled: boolean;
  localVideoTransmitting: boolean;
  callerId?: string;
  callerName?: string;
  duration: number;
  status: "idle" | "connecting" | "ringing" | "answered" | "held" | "ended" | "error";
}

export class CallManager extends EventTarget {
  private sipManager: SipManager;
  private callState: CallState;
  private ringtone: HTMLAudioElement | null = null;
  private ringTimeout: number | null = null;
  private contacts: SIPContact[] = [];
  private isAnsweringCall = false; // Flag to prevent multiple simultaneous answer calls

  constructor(sipManager: SipManager, contacts: SIPContact[] = []) {
    super();
    this.sipManager = sipManager;
    this.contacts = contacts;
    this.callState = this.getInitialState();
    this.setupSipEventHandlers();
  }

  public updateContacts(contacts: SIPContact[]): void {
    this.contacts = contacts;
  }

  private getInitialState(): CallState {
    return {
      active: false,
      incoming: false,
      outgoing: false,
      onHold: false,
      muted: false,
      remoteVideoEnabled: false,
      localVideoTransmitting: false,
      duration: 0,
      status: "idle",
    };
  }

  private setupSipEventHandlers(): void {
    this.sipManager.addEventListener("incomingCall", this.handleIncomingCall.bind(this) as EventListener);
    this.sipManager.addEventListener("callStarted", this.handleCallStarted.bind(this) as EventListener);
    this.sipManager.addEventListener("callAnswered", this.handleCallAnswered.bind(this) as EventListener);
    this.sipManager.addEventListener("callEnded", this.handleCallEnded.bind(this) as EventListener);
    this.sipManager.addEventListener("callFailed", this.handleCallFailed.bind(this) as EventListener);
    this.sipManager.addEventListener("localVideoChanged", this.handleLocalVideoChanged.bind(this) as EventListener);
    this.sipManager.addEventListener("remoteVideoChanged", this.handleRemoteVideoChanged.bind(this) as EventListener);
    this.sipManager.addEventListener("callTimer", this.handleCallTimer.bind(this) as EventListener);
    this.sipManager.addEventListener("callHold", this.handleCallHold.bind(this) as EventListener);
  }

  private cleanExtension(rawExtension: string): string {
    if (!rawExtension || rawExtension === "unknown") return rawExtension;

    let cleaned = rawExtension.replace(/^Extension\s+/i, "");
    cleaned = cleaned.replace(/-screen$|-web$|-mobile$|-phone$/i, "");

    const numericMatch = cleaned.match(/(\d+)/);
    if (numericMatch) {
      return numericMatch[1];
    }

    return cleaned;
  }

  private cleanDisplayName(displayName: string, extension: string): string {
    if (!displayName || displayName === "unknown" || displayName === "Unknown Caller") {
      return extension;
    }

    let cleaned = displayName.replace(/^Extension\s+/i, "");
    cleaned = cleaned.replace(new RegExp(`\\b${extension}\\b`, "g"), "").trim();

    if (!cleaned || cleaned === extension) {
      return extension;
    }

    return cleaned;
  }

  private handleIncomingCall(event: CustomEvent): void {
    const { from, displayName, callInfo } = event.detail;

    const cleanedExtension = this.cleanExtension(from);
    const cleanedDisplayName = this.cleanDisplayName(displayName, cleanedExtension);
    const contact = this.contacts ? getContactByExtension(this.contacts, cleanedExtension) : null;
    const finalCallerName = contact ? contact.name : cleanedDisplayName;

    this.callState = {
      ...this.callState,
      active: true,
      incoming: true,
      outgoing: false,
      callerId: cleanedExtension,
      callerName: finalCallerName,
      status: "ringing",
      duration: 0,
    };

    this.ringtone = playRingtone();

    this.ringTimeout = window.setTimeout(() => {
      if (this.callState.status === "ringing" && this.callState.incoming) {
        this.rejectCall().catch((error) => {
          console.error("Auto-reject failed:", error);
          this.forceCallCleanup();
        });
      }
    }, 30000);

    this.dispatchCallStateUpdate();
  }

  private forceCallCleanup(): void {
    this.stopRinging();
    this.clearRingTimeout();

    // Ensure media tracks are stopped when force cleaning up
    try {
      // The SIP manager should handle this, but we'll make sure
      console.log("Force call cleanup, ensuring media tracks are stopped");
    } catch (error) {
      console.error("Error during force call cleanup:", error);
    }

    this.callState = this.getInitialState();
    this.callState.status = "ended";

    this.dispatchCallStateUpdate();

    setTimeout(() => {
      this.callState.status = "idle";
      this.dispatchCallStateUpdate();
    }, 1000);
  }

  private handleCallStarted(event: CustomEvent): void {
    const { target } = event.detail;

    const cleanedExtension = this.cleanExtension(target);
    const contact = this.contacts ? getContactByExtension(this.contacts, cleanedExtension) : null;
    const finalCallerName = contact ? contact.name : cleanedExtension;

    this.callState = {
      ...this.callState,
      active: true,
      incoming: false,
      outgoing: true,
      callerId: cleanedExtension,
      callerName: finalCallerName,
      status: "connecting",
      duration: 0,
    };

    this.dispatchCallStateUpdate();
  }

  private handleCallAnswered(_event: CustomEvent): void {
    this.stopRinging();
    this.clearRingTimeout();

    this.callState = {
      ...this.callState,
      status: "answered",
      incoming: false,
      outgoing: false,
      duration: 0,
    };

    // FIXED: Update local video state immediately
    const videoState = this.sipManager.getLocalVideoState();
    this.callState.localVideoTransmitting = videoState.transmitting;

    // Check if remote video is available
    setTimeout(() => {
      const remoteVideo = this.sipManager.getRemoteVideo();
      if (remoteVideo && remoteVideo.srcObject) {
        const stream = remoteVideo.srcObject as MediaStream;
        const videoTracks = stream.getVideoTracks();
        this.callState.remoteVideoEnabled = videoTracks.length > 0 && videoTracks.some((track) => track.enabled);
        console.log("Remote video detected in call answered:", {
          videoTracks: videoTracks.length,
          enabled: this.callState.remoteVideoEnabled,
        });
        this.dispatchCallStateUpdate();
      }
    }, 500);

    this.dispatchCallStateUpdate();
  }

  private handleCallEnded(_event: CustomEvent): void {
    this.stopRinging();
    this.clearRingTimeout();

    this.callState = this.getInitialState();
    this.callState.status = "ended";

    this.dispatchCallStateUpdate();

    setTimeout(() => {
      this.callState.status = "idle";
      this.dispatchCallStateUpdate();
    }, 2000);
  }

  private handleCallFailed(_event: CustomEvent): void {
    this.stopRinging();
    this.clearRingTimeout();

    // Ensure media tracks are stopped
    try {
      // The SIP manager should handle this, but we'll make sure
      console.log("Call failed, ensuring media tracks are stopped");
    } catch (error) {
      console.error("Error during call failure cleanup:", error);
    }

    this.callState = this.getInitialState();
    this.callState.status = "error";

    this.dispatchCallStateUpdate();
  }

  private handleCallTimer(event: CustomEvent): void {
    const { duration } = event.detail;
    this.callState.duration = duration;
    this.dispatchCallStateUpdate();
    
    // Dispatch formatted duration for UI updates
    this.dispatchEvent(
      new CustomEvent("callTimerUpdate", {
        detail: { 
          duration,
          formattedDuration: formatDuration(duration)
        }
      })
    );
  }

  private handleCallHold(event: CustomEvent): void {
    const { held } = event.detail;
    this.callState.onHold = held;
    this.callState.status = held ? "held" : "answered";
    this.dispatchCallStateUpdate();
  }

  private handleLocalVideoChanged(event: CustomEvent): void {
    const { transmitting } = event.detail;
    this.callState.localVideoTransmitting = transmitting;
    this.dispatchCallStateUpdate();
  }

  private handleRemoteVideoChanged(event: CustomEvent): void {
    const { enabled } = event.detail;
    this.callState.remoteVideoEnabled = enabled;
    this.dispatchCallStateUpdate();
  }

  public async toggleVideo(): Promise<boolean> {
    try {
      const enabled = await this.sipManager.toggleVideo();
      return enabled;
    } catch (error) {
      console.error("Failed to toggle video:", error);
      throw error;
    }
  }

  public async enableVideo(): Promise<void> {
    try {
      await this.sipManager.enableVideo();
      console.log("Video enabled successfully");
    } catch (error) {
      console.error("Failed to enable video:", error);
      throw error;
    }
  }

  public async disableVideo(): Promise<void> {
    try {
      await this.sipManager.disableVideo();
    } catch (error) {
      console.error("Failed to disable video:", error);
      throw error;
    }
  }

  private stopRinging(): void {
    if (this.ringtone) {
      stopRingtone(this.ringtone);
      this.ringtone = null;
    }
  }

  private clearRingTimeout(): void {
    if (this.ringTimeout) {
      clearTimeout(this.ringTimeout);
      this.ringTimeout = null;
    }
  }

  private dispatchCallStateUpdate(): void {
    this.dispatchEvent(
      new CustomEvent("callStateChanged", {
        detail: { callState: { ...this.callState } },
      })
    );
  }

  async makeCall(target: string, includeVideo?: boolean): Promise<void> {
    try {
      await this.sipManager.makeCall(target, includeVideo);
    } catch (error) {
      this.callState.status = "error";
      this.dispatchCallStateUpdate();
      throw error;
    }
  }

  // FIXED: Enhanced answerCall to properly handle video
  async answerCall(withVideo = false): Promise<void> {
    // Prevent multiple simultaneous answer calls
    if (this.isAnsweringCall) {
      console.warn("Call is already being answered, ignoring duplicate request");
      return;
    }

    try {
      this.isAnsweringCall = true;
      
      if (withVideo) {
        console.log("Answering with video - enabling video first");
        await this.sipManager.enableVideo();
      }

      await this.sipManager.answerCall();
      console.log(`Call answered ${withVideo ? "with" : "without"} video`);
    } catch (error) {
      console.error("Failed to answer call:", error);
      this.callState.status = "error";
      this.dispatchCallStateUpdate();
      throw error;
    } finally {
      this.isAnsweringCall = false;
    }
  }

  async rejectCall(): Promise<void> {
    this.stopRinging();
    this.clearRingTimeout();

    try {
      if (this.sipManager && (this.callState.status === "ringing" || this.callState.incoming)) {
        await this.sipManager.rejectCall();
      } else {
        console.warn("Cannot reject call - invalid state:", this.callState.status);
        this.forceCallCleanup();
        return;
      }
    } catch (error) {
      console.error("Reject call failed:", error);
      this.forceCallCleanup();
      throw error;
    }
  }

  async hangupCall(): Promise<void> {
    try {
      await this.sipManager.hangup();
    } catch (error) {
      this.callState = this.getInitialState();
      this.dispatchCallStateUpdate();
      throw error;
    }
  }

  async toggleMute(): Promise<boolean> {
    try {
      if (this.callState.muted) {
        await this.sipManager.unmute();
        this.callState.muted = false;
      } else {
        await this.sipManager.mute();
        this.callState.muted = true;
      }

      this.dispatchCallStateUpdate();
      return this.callState.muted;
    } catch (error) {
      throw error;
    }
  }

  sendDTMF(tone: string): void {
    if (this.callState.active && this.callState.status === "answered") {
      this.sipManager.sendDTMF(tone);
    }
  }

  getCallState(): CallState {
    return { ...this.callState };
  }

  getRemoteVideo(): HTMLVideoElement | null {
    return this.sipManager.getRemoteVideo();
  }

  getCurrentCall(): CallInfo | null {
    return this.sipManager.getCurrentCall();
  }

  getFormattedDuration(): string {
    return formatDuration(this.callState.duration);
  }
}
