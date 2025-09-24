import type { LovelaceCardConfig } from "custom-card-helpers";
export interface HomeAssistant {
    states: {
        [entity_id: string]: any;
    };
    config: any;
    themes: any;
    panels: any;
    services: any;
    user?: any;
    callService(domain: string, service: string, serviceData?: any): Promise<any>;
}
export interface SIPCardConfig extends LovelaceCardConfig {
    type: string;
    title?: string;
    server_url: string;
    username: string;
    password: string;
    domain?: string;
    display_name?: string;
    stun_servers?: string[];
    turn_servers?: TURNServer[];
    auto_answer?: boolean;
    video_enabled?: boolean;
    dtmf_enabled?: boolean;
    call_history_enabled?: boolean;
    theme?: "auto" | "light" | "dark";
    contacts: SIPContact[];
    hide_keypad?: boolean;
    websocket_port?: number;
    [key: string]: unknown;
    hide_video_controls?: boolean;
    ring_timeout?: number;
    debug?: boolean;
}
export interface TURNServer {
    urls: string[];
    username: string;
    credential: string;
}
export interface SIPContact {
    name: string;
    extension: string;
    id?: string;
    icon?: string;
    video_enabled?: boolean;
}
export interface CallState {
    active: boolean;
    incoming: boolean;
    outgoing: boolean;
    onHold: boolean;
    muted: boolean;
    videoEnabled: boolean;
    remoteVideoEnabled: boolean;
    localVideoTransmitting: boolean;
    callerId?: string;
    callerName?: string;
    duration: number;
    status: "idle" | "connecting" | "ringing" | "answered" | "held" | "ended" | "error";
}
export interface ConnectionState {
    registered: boolean;
    connecting: boolean;
    error?: string;
    lastConnected?: Date;
    registrationExpires?: Date;
}
//# sourceMappingURL=types.d.ts.map