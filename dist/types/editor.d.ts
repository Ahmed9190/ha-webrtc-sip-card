import { LitElement, TemplateResult } from "lit";
import type { HomeAssistant, SIPCardConfig } from "./types";
export declare class WebRTCSipCardEditor extends LitElement {
    hass: HomeAssistant;
    lovelace?: any;
    private _config;
    setConfig(config: SIPCardConfig): void;
    protected render(): TemplateResult;
    private _stunServersChanged;
    private _valueChanged;
    private _contactChanged;
    private _addContact;
    private _deleteContact;
    static styles: import("lit").CSSResult;
}
declare global {
    interface HTMLElementTagNameMap {
        "ha-webrtc-sip-card-editor": WebRTCSipCardEditor;
    }
}
//# sourceMappingURL=editor.d.ts.map