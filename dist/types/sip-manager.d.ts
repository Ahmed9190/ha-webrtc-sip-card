export interface SipConfig {
    server: string;
    username: string;
    password: string;
    domain: string;
    websocket_port: number;
    use_secure: boolean;
    display_name?: string;
    debug?: boolean;
}
export interface CallInfo {
    id: string;
    remoteIdentity: string;
    displayName: string;
    state: "incoming" | "outgoing" | "connected" | "ended";
    startTime?: Date;
    duration: number;
}
export declare class SipManager extends EventTarget {
    private simpleUser;
    private config;
    private isRegistered;
    private isConnected;
    private connectionTimer;
    private currentCall;
    private remoteAudio;
    private remoteVideo;
    private localVideo;
    private localStream;
    private videoEnabled;
    private isInitialized;
    private isInitializing;
    private lastVideoState;
    private isEnablingVideo;
    constructor();
    private setupMediaElements;
    private getUserMedia;
    enableVideo(): Promise<void>;
    disableVideo(): Promise<void>;
    private replaceMediaTracks;
    toggleVideo(): Promise<boolean>;
    getLocalVideoState(): {
        enabled: boolean;
        transmitting: boolean;
    };
    private setupRemoteStreamHandlers;
    private handleIceConnectionFailure;
    private handleConnectionFailure;
    private waitForSipLibrary;
    private ensureSipClient;
    setConfig(config: SipConfig): void;
    initialize(config: SipConfig): Promise<void>;
    private setupEventHandlers;
    private callTimer;
    private startCallTimer;
    private stopCallTimer;
    private startConnectionMonitoring;
    makeCall(target: string, includeVideo?: boolean): Promise<void>;
    private forceRemoteVideoCheck;
    answerCall(): Promise<void>;
    rejectCall(): Promise<void>;
    hangup(): Promise<void>;
    mute(): Promise<void>;
    unmute(): Promise<void>;
    sendDTMF(tone: string): void;
    getRemoteVideo(): HTMLVideoElement | null;
    getRemoteAudio(): HTMLAudioElement | null;
    getCurrentCall(): CallInfo | null;
    getConnectionStatus(): {
        connected: boolean;
        registered: boolean;
        initialized: boolean;
    };
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}
//# sourceMappingURL=sip-manager.d.ts.map