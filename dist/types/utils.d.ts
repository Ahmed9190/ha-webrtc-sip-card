import type { SIPCardConfig, SIPContact } from "./types";
export declare function mergeConfig(userConfig: Partial<SIPCardConfig>): SIPCardConfig;
export declare function validateConfig(config: SIPCardConfig): void;
export declare function formatDuration(seconds: number): string;
export declare function formatPhoneNumber(number: string): string;
export declare function playRingtone(): HTMLAudioElement | null;
export declare function stopRingtone(audio: HTMLAudioElement | null): void;
export declare function getContactByExtension(contacts: SIPContact[], extension: string): SIPContact | undefined;
export declare function sanitizeExtension(extension: string): string;
export declare function debugLog(debug: boolean, message: string, ...args: any[]): void;
export declare function errorLog(message: string, error?: any): void;
//# sourceMappingURL=utils.d.ts.map