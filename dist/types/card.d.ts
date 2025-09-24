import { LitElement, type CSSResultGroup, type TemplateResult } from "lit";
import type { HomeAssistant, SIPCardConfig } from "./types";
export declare class WebRTCSipCard extends LitElement {
    hass: HomeAssistant;
    private config;
    private connected;
    private registered;
    private error;
    private callState;
    private showKeypad;
    private currentInput;
    private callDuration;
    private remoteVideoAvailable;
    private connectionAttempts;
    private isRetrying;
    private remoteVideoElement?;
    private sipManager;
    private callManager;
    private remoteVideoCheckInterval;
    private remoteVideoUpdateTimeout;
    private connectionRetryTimeout;
    private readonly MAX_RETRY_ATTEMPTS;
    private readonly RETRY_DELAYS;
    static getConfigElement(): import("./editor").WebRTCSipCardEditor;
    static getStubConfig(): SIPCardConfig;
    setConfig(config: SIPCardConfig): void;
    getCardSize(): number;
    private initializeSipClient;
    private attemptConnection;
    private setupEventHandlers;
    private scheduleReconnect;
    private debouncedUpdateRemoteVideo;
    private startRemoteVideoMonitoring;
    private stopRemoteVideoMonitoring;
    private updateRemoteVideo;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected render(): TemplateResult;
    private renderStatusBar;
    private renderError;
    private renderContent;
    private renderContacts;
    private renderContact;
    private renderManualDial;
    private renderKeypad;
    private renderActiveCall;
    private renderCallInfo;
    private renderVideoStatus;
    private renderVideoArea;
    private renderIncomingCallControls;
    private renderCallControls;
    private renderInCallKeypad;
    private renderIncomingCallModal;
    private getCallStatusText;
    private handleInputChange;
    private handleKeypadPress;
    private toggleKeypad;
    private clearInput;
    private manualRetry;
    private callContact;
    private makeVideoCall;
    private isAnsweringCall;
    private answerCall;
    private rejectCall;
    private hangupCall;
    private toggleMute;
    private sendDTMF;
    static get styles(): CSSResultGroup;
}
declare global {
    interface HTMLElementTagNameMap {
        "ha-webrtc-sip-card": WebRTCSipCard;
    }
}
//# sourceMappingURL=card.d.ts.map