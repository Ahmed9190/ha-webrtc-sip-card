export declare const CARD_VERSION = "1.0.0";
export declare const CARD_NAME = "ha-webrtc-sip-card";
export declare const DEFAULT_CONFIG: {
    type: string;
    title: string;
    server_url: string;
    username: string;
    password: string;
    domain: string;
    display_name: string;
    stun_servers: string[];
    turn_servers: never[];
    auto_answer: boolean;
    video_enabled: boolean;
    dtmf_enabled: boolean;
    call_history_enabled: boolean;
    theme: "auto";
    contacts: never[];
    hide_keypad: boolean;
    hide_video_controls: boolean;
    ring_timeout: number;
    debug: boolean;
};
export declare const SIP_EVENTS: {
    readonly REGISTERED: "registered";
    readonly UNREGISTERED: "unregistered";
    readonly REGISTRATION_FAILED: "registrationFailed";
    readonly INVITE: "invite";
    readonly PROGRESS: "progress";
    readonly ACCEPTED: "accepted";
    readonly REJECTED: "rejected";
    readonly CANCEL: "cancel";
    readonly BYE: "bye";
    readonly FAILED: "failed";
    readonly MUTED: "muted";
    readonly UNMUTED: "unmuted";
};
export declare const CALL_STATUS: {
    readonly IDLE: "idle";
    readonly CONNECTING: "connecting";
    readonly RINGING: "ringing";
    readonly ANSWERED: "answered";
    readonly HELD: "held";
    readonly ENDED: "ended";
    readonly ERROR: "error";
};
export declare const DTMF_KEYS: readonly [readonly ["1", "2", "3"], readonly ["4", "5", "6"], readonly ["7", "8", "9"], readonly ["*", "0", "#"]];
export declare const VIDEO_CONSTRAINTS: {
    video: {
        width: {
            ideal: number;
        };
        height: {
            ideal: number;
        };
        frameRate: {
            ideal: number;
            max: number;
        };
    };
    audio: {
        echoCancellation: boolean;
        noiseSuppression: boolean;
        autoGainControl: boolean;
    };
};
//# sourceMappingURL=constants.d.ts.map