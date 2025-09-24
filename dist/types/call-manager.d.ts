import type { CallInfo } from "./sip-manager";
import { SipManager } from "./sip-manager";
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
export declare class CallManager extends EventTarget {
    private sipManager;
    private callState;
    private ringtone;
    private ringTimeout;
    private contacts;
    private isAnsweringCall;
    constructor(sipManager: SipManager, contacts?: SIPContact[]);
    updateContacts(contacts: SIPContact[]): void;
    private getInitialState;
    private setupSipEventHandlers;
    private cleanExtension;
    private cleanDisplayName;
    private handleIncomingCall;
    private forceCallCleanup;
    private handleCallStarted;
    private handleCallAnswered;
    private handleCallEnded;
    private handleCallFailed;
    private handleCallTimer;
    private handleCallHold;
    private handleLocalVideoChanged;
    private handleRemoteVideoChanged;
    toggleVideo(): Promise<boolean>;
    enableVideo(): Promise<void>;
    disableVideo(): Promise<void>;
    private stopRinging;
    private clearRingTimeout;
    private dispatchCallStateUpdate;
    makeCall(target: string, includeVideo?: boolean): Promise<void>;
    answerCall(withVideo?: boolean): Promise<void>;
    rejectCall(): Promise<void>;
    hangupCall(): Promise<void>;
    toggleMute(): Promise<boolean>;
    sendDTMF(tone: string): void;
    getCallState(): CallState;
    getRemoteVideo(): HTMLVideoElement | null;
    getCurrentCall(): CallInfo | null;
    getFormattedDuration(): string;
}
//# sourceMappingURL=call-manager.d.ts.map