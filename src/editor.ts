import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant, SIPCardConfig } from "./types";
import { DEFAULT_CONFIG } from "./constants";

@customElement("ha-webrtc-sip-card-editor")
export class WebRTCSipCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public lovelace?: any;

  @state() private _config!: SIPCardConfig;

  public setConfig(config: SIPCardConfig): void {
    this._config = { ...DEFAULT_CONFIG, ...config };
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) {
      return html``;
    }

    return html`
      <div class="card-config">
        <ha-textfield label="Title" .value="${this._config.title || ""}" .configValue="${"title"}" @input="${this._valueChanged}"></ha-textfield>

        <ha-textfield label="Server URL" .value="${this._config.server_url}" .configValue="${"server_url"}" @input="${this._valueChanged}"></ha-textfield>

        <ha-textfield label="Username" .value="${this._config.username}" .configValue="${"username"}" @input="${this._valueChanged}"></ha-textfield>

        <ha-textfield
          label="Password"
          type="password"
          .value="${this._config.password}"
          .configValue="${"password"}"
          @input="${this._valueChanged}"
        ></ha-textfield>

        <ha-textfield
          label="Display Name"
          .value="${this._config.display_name || ""}"
          .configValue="${"display_name"}"
          @input="${this._valueChanged}"
        ></ha-textfield>

        <ha-textfield
          label="STUN Servers (comma-separated)"
          .value="${this._config.stun_servers ? this._config.stun_servers.join(",") : (DEFAULT_CONFIG.stun_servers || []).join(",")}"
          .configValue="${"stun_servers"}"
          @input="${this._stunServersChanged}"
        ></ha-textfield>
        <div class="switch-container">
          <label class="switch-label">Use Secure Connection</label>
          <ha-switch .checked="${this._config.use_secure !== false}" .configValue="${"use_secure"}" @change="${this._valueChanged}"></ha-switch>
        </div>

        <div class="switch-container">
          <label class="switch-label">Debug Mode</label>
          <ha-switch .checked="${this._config.debug === true}" .configValue="${"debug"}" @change="${this._valueChanged}"></ha-switch>
        </div>

        <h3>Contacts</h3>
        ${this._config.contacts.map(
          (contact, index) => html`
            <div class="contact-row">
              <ha-textfield
                label="Name"
                .value="${contact.name}"
                .contactIndex="${index}"
                .contactField="${"name"}"
                @input="${this._contactChanged}"
              ></ha-textfield>

              <ha-textfield
                label="Extension"
                .value="${contact.extension}"
                .contactIndex="${index}"
                .contactField="${"extension"}"
                @input="${this._contactChanged}"
              ></ha-textfield>

              <ha-textfield
                label="Icon"
                .value="${contact.icon || ""}"
                .contactIndex="${index}"
                .contactField="${"icon"}"
                @input="${this._contactChanged}"
              ></ha-textfield>

              <ha-icon-button .label="Delete" .contactIndex="${index}" @click="${this._deleteContact}"><ha-icon icon="mdi:delete"></ha-icon></ha-icon-button>
            </div>
          `
        )}

        <ha-button @click="${this._addContact}"> Add Contact </ha-button>
      </div>
    `;
  }

  private _stunServersChanged(ev: Event): void {
    if (!this._config || !this.hass) {
      return;
    }

    const target = ev.target as any;
    const value = target.value;
    const configValue = target.configValue;

    // Convert comma-separated string to array
    const stunServers = value
      ? value
          .split(",")
          .map((url: string) => url.trim())
          .filter((url: string) => url)
      : [];

    this._config = {
      ...this._config,
      [configValue]: stunServers,
    };

    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _valueChanged(ev: Event): void {
    if (!this._config || !this.hass) {
      return;
    }

    const target = ev.target as any;
    let value = target.value;
    const configValue = target.configValue;

    // Handle boolean values for switches
    if (target.tagName === "HA-SWITCH") {
      value = target.checked;
    }
    // Handle ha-select elements - use the value directly from the target for change event
    else if (target.tagName === "HA-SELECT") {
      value = target.value;
    }
    // Handle mwc-list-item selections
    else if (target.tagName === "MWC-LIST-ITEM") {
      value = target.value || target.selected;
    }

    // Type assertion to prevent TypeScript error
    const currentValue = (this as any)[`_${configValue}`];
    if (currentValue === value) {
      return;
    }

    this._config = {
      ...this._config,
      [configValue]: value,
    };

    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _contactChanged(ev: Event): void {
    if (!this._config || !this.hass) {
      return;
    }

    const target = ev.target as any;
    const value = target.value;
    const contactIndex = target.contactIndex;
    const contactField = target.contactField;

    const contacts = [...this._config.contacts];
    contacts[contactIndex] = {
      ...contacts[contactIndex],
      [contactField]: value,
    };

    this._config = {
      ...this._config,
      contacts,
    };

    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _addContact(): void {
    if (!this._config || !this.hass) {
      return;
    }

    const contacts = [...this._config.contacts];
    contacts.push({
      name: "",
      extension: "",
      icon: "mdi:account",
    });

    this._config = {
      ...this._config,
      contacts,
    };

    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _deleteContact(ev: Event): void {
    if (!this._config || !this.hass) {
      return;
    }

    const target = ev.target as any;
    const contactIndex = target.contactIndex;

    const contacts = [...this._config.contacts];
    contacts.splice(contactIndex, 1);

    this._config = {
      ...this._config,
      contacts,
    };

    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      })
    );
  }

  static styles = css`
    .card-config {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }

    ha-textfield {
      width: 100%;
    }

    .contact-row {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .contact-row ha-textfield {
      flex: 1;
    }

    ha-icon-button {
      --mdc-icon-button-size: 40px;
      align-self: center;
      margin-top: 16px; /* Align with text fields */
      color: var(--error-color, #ff0000);
      cursor: pointer;
    }

    h3 {
      margin: 8px 0;
      color: var(--primary-text-color);
    }

    label {
      display: block;
      margin-bottom: 4px;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    .switch-label {
      display: inline-block;
      margin-right: 8px;
      margin-bottom: 0;
      vertical-align: middle;
      align-self: center;
      color: var(--primary-text-color);
      font-size: 14px;
    }

    .switch-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0;
    }

    .switch-container ha-switch {
      margin-left: auto;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-webrtc-sip-card-editor": WebRTCSipCardEditor;
  }
}
