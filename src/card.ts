import { LitElement, html, css, type CSSResultGroup, type TemplateResult } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import type { HomeAssistant, SIPCardConfig, SIPContact } from "./types";
import { SipManager, type SipConfig } from "./sip-manager";
import { CallManager, type CallState } from "./call-manager";
import { sharedStyles } from "./styles";
import { CARD_VERSION, DEFAULT_CONFIG, DTMF_KEYS } from "./constants";
import { mergeConfig, validateConfig, formatPhoneNumber, sanitizeExtension } from "./utils";

@customElement("ha-webrtc-sip-card")
export class WebRTCSipCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: SIPCardConfig;
  @state() private connected = false;
  @state() private registered = false;
  @state() private error: string | null = null;
  @state() private callState!: CallState;
  @state() private showKeypad = false;
  @state() private currentInput = "";
  @state() private callDuration = "00:00";
  @state() private remoteVideoAvailable = false;
  @state() private connectionAttempts = 0;
  @state() private isRetrying = false;
  @state() private currentTheme: "light" | "dark" = "light";

  @query("#remote-video") private remoteVideoElement?: HTMLVideoElement;

  private sipManager: SipManager | null = null;
  private callManager: CallManager | null = null;
  private remoteVideoCheckInterval: number | null = null;
  private remoteVideoUpdateTimeout: number | null = null;
  private connectionRetryTimeout: number | null = null;

  private readonly MAX_RETRY_ATTEMPTS = 5;
  private readonly RETRY_DELAYS = [2000, 5000, 10000, 20000, 30000];

  static async getConfigElement() {
    try {
      // Only import if not already loaded
      if (!customElements.get("ha-webrtc-sip-card-editor")) {
        console.log("📦 Loading editor...");
        await import("./editor.js");
        console.log("✅ Editor loaded");
      }

      return document.createElement("ha-webrtc-sip-card-editor");
    } catch (error) {
      console.error("❌ Failed to load editor:", error);
      return null;
    }
  }

  public static getStubConfig(): SIPCardConfig {
    return { ...DEFAULT_CONFIG };
  }

  public setConfig(config: SIPCardConfig): void {
    try {
      validateConfig(config);
      this.config = mergeConfig(config);
      this.connectionAttempts = 0;
      this.updateTheme(); // Update theme when config changes
      this.initializeSipClient();
    } catch (error) {
      this.error = error instanceof Error ? error.message : "Invalid configuration";
      throw new Error(this.error);
    }
  }

  public getCardSize(): number {
    return this.callState && this.callState.active ? 6 : 4;
  }

  private async initializeSipClient(): Promise<void> {
    try {
      if (this.sipManager) {
        await this.sipManager.disconnect();
      }

      this.error = null;
      this.connected = false;
      this.registered = false;
      this.isRetrying = false;

      const sipConfig: SipConfig = {
        server: this.config.server_url,
        username: this.config.username,
        password: this.config.password,
        use_secure: this.config.server_url.startsWith("wss://"),
        debug: this.config.debug,
      };

      this.sipManager = new SipManager();
      this.callManager = new CallManager(this.sipManager, this.config.contacts);

      this.setupEventHandlers();
      this.callState = this.callManager.getCallState();
      this.sipManager.setConfig(sipConfig);

      this.attemptConnection();
    } catch (error) {
      this.error = error instanceof Error ? error.message : "Configuration failed";
      this.connected = false;
      this.registered = false;
      console.error("SIP configuration failed:", error);
    }
  }

  private async attemptConnection(): Promise<void> {
    if (this.connectionAttempts >= this.MAX_RETRY_ATTEMPTS) {
      this.error = "Failed to connect after multiple attempts. Please check server configuration and network connectivity.";
      this.isRetrying = false;
      this.requestUpdate();
      return;
    }

    if (this.connectionRetryTimeout) {
      clearTimeout(this.connectionRetryTimeout);
      this.connectionRetryTimeout = null;
    }

    try {
      this.isRetrying = this.connectionAttempts > 0;
      this.requestUpdate();

      console.log(`Connection attempt ${this.connectionAttempts + 1}/${this.MAX_RETRY_ATTEMPTS}`);

      await this.sipManager!.connect();

      this.connectionAttempts = 0;
      this.isRetrying = false;
      this.error = null;
      console.log("SIP client connected successfully");
      this.requestUpdate();
    } catch (error) {
      this.connectionAttempts++;
      const errorMessage = error instanceof Error ? error.message : "Connection failed";

      console.error(`Connection attempt ${this.connectionAttempts} failed:`, errorMessage);

      if (this.connectionAttempts < this.MAX_RETRY_ATTEMPTS) {
        const delay = this.RETRY_DELAYS[this.connectionAttempts - 1] || this.RETRY_DELAYS[this.RETRY_DELAYS.length - 1];

        this.error = `Connection failed. Retrying in ${Math.ceil(delay / 1000)} seconds... (${this.connectionAttempts}/${this.MAX_RETRY_ATTEMPTS})`;
        this.isRetrying = true;
        this.requestUpdate();

        this.connectionRetryTimeout = window.setTimeout(() => {
          this.attemptConnection();
        }, delay);
      } else {
        let detailedError = "Connection failed";
        if (errorMessage.includes("1006")) {
          detailedError =
            "WebSocket connection failed (1006). Check:\n• Server is running and accessible\n• Correct WebSocket URL and port\n• Network/firewall allows WebSocket connections\n• SSL certificate valid (for wss://)";
        } else if (errorMessage.includes("timeout")) {
          detailedError = "Connection timeout. Server may be unreachable or overloaded.";
        } else if (errorMessage.includes("refused")) {
          detailedError = "Connection refused. Check server URL and port.";
        }

        this.error = detailedError;
        this.isRetrying = false;
        this.connected = false;
        this.registered = false;
        this.requestUpdate();
      }
    }
  }

  private setupEventHandlers(): void {
    if (!this.sipManager || !this.callManager) return;

    this.sipManager.addEventListener("connected", () => {
      this.connected = true;
      this.connectionAttempts = 0;
      this.isRetrying = false;
      this.error = null;
      this.requestUpdate();
    });

    this.sipManager.addEventListener("disconnected", () => {
      this.connected = false;
      this.registered = false;
      if (!this.isRetrying && this.connectionAttempts === 0) {
        this.error = "Disconnected from server";
        this.scheduleReconnect();
      }
      this.requestUpdate();
    });

    this.sipManager.addEventListener("registered", (event: any) => {
      this.registered = event.detail.registered;
      if (this.registered) {
        this.error = null;
        this.connectionAttempts = 0;
        this.isRetrying = false;
      }
      this.requestUpdate();
    });

    this.sipManager.addEventListener("error", (event: any) => {
      const errorDetail = event.detail.error;
      const errorType = event.detail.type;
      console.error("SIP Manager error:", errorDetail, "Type:", errorType);

      if (errorType === "registration") {
        this.error = `Registration failed: ${errorDetail}. Please check your credentials.`;
        this.connected = false; // Treat as disconnected
        this.registered = false;
        this.isRetrying = false;
        if (this.connectionRetryTimeout) {
          clearTimeout(this.connectionRetryTimeout);
          this.connectionRetryTimeout = null;
        }
        this.requestUpdate();
      } else if (errorDetail.includes("WebSocket closed") || errorDetail.includes("1006")) {
        if (!this.isRetrying) {
          this.scheduleReconnect();
        }
      } else {
        this.error = errorDetail;
        this.connected = false;
        this.registered = false;
        this.requestUpdate();
      }
    });

    this.sipManager.addEventListener("localVideoChanged", (_event: any) => {
      this.callState = this.callManager?.getCallState() || this.callState;
      this.requestUpdate();
    });

    this.sipManager.addEventListener("remoteVideoChanged", (event: any) => {
      console.log("Remote video changed:", event.detail);
      this.remoteVideoAvailable = event.detail.enabled && event.detail.hasVideoTracks;
      this.callState = this.callManager?.getCallState() || this.callState;
      this.callState.remoteVideoEnabled = this.remoteVideoAvailable;

      this.updateComplete.then(() => {
        this.debouncedUpdateRemoteVideo();
      });

      this.requestUpdate();
    });

    this.callManager.addEventListener("callStateChanged", (event: any) => {
      const wasActive = this.callState?.active;
      this.callState = event.detail.callState;

      if (this.callState.active && !wasActive) {
        this.startRemoteVideoMonitoring();
      } else if (!this.callState.active && wasActive) {
        this.stopRemoteVideoMonitoring();
        this.remoteVideoAvailable = false;
      }

      this.updateComplete.then(() => {
        this.debouncedUpdateRemoteVideo();
      });

      this.requestUpdate();
    });

    this.callManager.addEventListener("callTimerUpdate", (event: any) => {
      this.callDuration = event.detail.formattedDuration;
    });
  }

  private scheduleReconnect(): void {
    if (this.isRetrying || this.connectionRetryTimeout) return;

    console.log("Scheduling reconnection...");
    this.connectionAttempts = 0;

    this.connectionRetryTimeout = window.setTimeout(() => {
      this.attemptConnection();
    }, 3000);
  }

  private debouncedUpdateRemoteVideo(): void {
    if (this.remoteVideoUpdateTimeout) {
      clearTimeout(this.remoteVideoUpdateTimeout);
    }

    this.remoteVideoUpdateTimeout = window.setTimeout(() => {
      this.updateRemoteVideo();
      this.remoteVideoUpdateTimeout = null;
    }, 50);
  }

  private startRemoteVideoMonitoring(): void {
    this.stopRemoteVideoMonitoring();

    this.remoteVideoCheckInterval = window.setInterval(() => {
      const remoteVideo = this.callManager?.getRemoteVideo();
      if (remoteVideo && remoteVideo.srcObject) {
        const stream = remoteVideo.srcObject as MediaStream;
        const hasVideoTracks = stream.getVideoTracks().length > 0;

        if (hasVideoTracks !== this.remoteVideoAvailable) {
          this.remoteVideoAvailable = hasVideoTracks;
          this.callState.remoteVideoEnabled = hasVideoTracks;

          console.log("Remote video monitoring detected change:", {
            hasVideoTracks,
            streamId: stream.id,
          });

          this.updateRemoteVideo();
          this.requestUpdate();
        }
      }
    }, 1000);
  }

  private stopRemoteVideoMonitoring(): void {
    if (this.remoteVideoCheckInterval) {
      clearInterval(this.remoteVideoCheckInterval);
      this.remoteVideoCheckInterval = null;
    }
  }

  private updateRemoteVideo(): void {
    if (this.callState.active && this.remoteVideoElement) {
      const remoteVideo = this.callManager?.getRemoteVideo();
      if (remoteVideo && remoteVideo.srcObject) {
        console.log("Updating remote video element:", {
          hasStream: !!remoteVideo.srcObject,
          videoTracks: (remoteVideo.srcObject as MediaStream)?.getVideoTracks().length || 0,
        });

        const updateVideoStream = async () => {
          try {
            if (this.remoteVideoElement!.srcObject !== remoteVideo.srcObject) {
              if (!this.remoteVideoElement!.paused) {
                this.remoteVideoElement!.pause();
              }

              this.remoteVideoElement!.srcObject = remoteVideo.srcObject;
              this.remoteVideoElement!.autoplay = true;
              this.remoteVideoElement!.playsInline = true;
              this.remoteVideoElement!.muted = false;

              const playPromise = this.remoteVideoElement!.play();

              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    console.log("Remote video playback started successfully");
                  })
                  .catch((error) => {
                    console.warn("Remote video playback failed:", error);
                  });
              }
            }
          } catch (error: any) {
            if (error.name === "AbortError") {
              console.log("Video play was interrupted, this is normal during stream updates");

              // Don't immediately retry, wait for a more stable state
              setTimeout(() => {
                if (this.remoteVideoElement && this.remoteVideoElement.srcObject) {
                  // Check if the element is still in a playable state
                  if (this.remoteVideoElement.readyState >= 2) {
                    // HAVE_CURRENT_DATA
                    const retryPromise = this.remoteVideoElement.play();
                    if (retryPromise !== undefined) {
                      retryPromise.catch(() => {
                        console.log("Secondary play attempt failed, ignoring");
                      });
                    }
                  } else {
                    // If not ready, wait a bit more and try again
                    setTimeout(() => {
                      if (this.remoteVideoElement && this.remoteVideoElement.srcObject) {
                        const retryPromise = this.remoteVideoElement.play();
                        if (retryPromise !== undefined) {
                          retryPromise.catch(() => {
                            console.log("Delayed play attempt failed, ignoring");
                          });
                        }
                      }
                    }, 200);
                  }
                }
              }, 150);
            } else if (error.name === "NotAllowedError") {
              console.log("Video play not allowed, likely due to autoplay restrictions");

              // Try to handle autoplay restrictions by re-attaching the stream
              if (this.remoteVideoElement) {
                const currentStream = this.remoteVideoElement.srcObject;
                this.remoteVideoElement.srcObject = null;
                this.remoteVideoElement.srcObject = currentStream;
                setTimeout(() => {
                  if (this.remoteVideoElement && this.remoteVideoElement.srcObject) {
                    this.remoteVideoElement.muted = true;
                    const retryPromise = this.remoteVideoElement.play();
                    if (retryPromise !== undefined) {
                      retryPromise.catch((retryError) => {
                        console.log("Retry play attempt failed:", retryError);

                        // Last resort: try to re-attach the stream again
                        if (this.remoteVideoElement && this.remoteVideoElement.srcObject) {
                          const currentStream = this.remoteVideoElement.srcObject;
                          this.remoteVideoElement.srcObject = null;
                          this.remoteVideoElement.srcObject = currentStream;
                          setTimeout(() => {
                            if (this.remoteVideoElement && this.remoteVideoElement.srcObject) {
                              this.remoteVideoElement.muted = true;
                              const finalPromise = this.remoteVideoElement.play();
                              if (finalPromise !== undefined) {
                                finalPromise.catch((finalError) => {
                                  console.log("Final play attempt failed:", finalError);
                                });
                              }
                            }
                          }, 100);
                        }
                      });
                    }
                  }
                }, 100);
              }
            } else {
              console.warn("Video play failed:", error);
            }
          }
        };

        updateVideoStream();

        if (!this.remoteVideoAvailable) {
          const stream = remoteVideo.srcObject as MediaStream;
          this.remoteVideoAvailable = stream.getVideoTracks().length > 0;
          this.requestUpdate();
        }
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.config) {
      this.updateTheme(); // Update theme when component connects
      this.initializeSipClient();
    }

    // Listen for theme changes from Home Assistant
    window.addEventListener("theme-changed", this._handleThemeChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    if (this.connectionRetryTimeout) {
      clearTimeout(this.connectionRetryTimeout);
      this.connectionRetryTimeout = null;
    }

    if (this.remoteVideoUpdateTimeout) {
      clearTimeout(this.remoteVideoUpdateTimeout);
      this.remoteVideoUpdateTimeout = null;
    }

    this.stopRemoteVideoMonitoring();
    if (this.sipManager) {
      this.sipManager.disconnect().catch(console.error);
    }

    // Remove theme change listener when disconnected
    if (this.hass && this.hass.themes) {
      window.removeEventListener("theme-changed", this._handleThemeChange);
    }
  }

  /**
   * Determines the current theme based on configuration and system preference
   */
  private determineTheme(): "light" | "dark" {
    if (this.config.theme === "light") {
      return "light";
    } else if (this.config.theme === "dark") {
      return "dark";
    } else {
      // Auto mode: check system preference or hass theme
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (this.hass && this.hass.themes) {
        // Check if current HA theme is dark
        const currentTheme = this.hass.themes.default_theme || this.hass.themes.current_theme;
        if (currentTheme && currentTheme.toLowerCase().includes("dark")) {
          return "dark";
        }
      }
      return prefersDark ? "dark" : "light";
    }
  }

  /**
   * Updates the theme state and applies theme-specific CSS variables
   */
  private updateTheme(): void {
    const newTheme = this.determineTheme();
    if (this.currentTheme !== newTheme) {
      this.currentTheme = newTheme;
      this.requestUpdate();
    }
  }

  /**
   * Handles theme change events from Home Assistant
   */
  private _handleThemeChange = (): void => {
    this.updateTheme();
  };

  protected render(): TemplateResult {
    if (!this.config) {
      return html`<ha-card><div class="error">Configuration required</div></ha-card>`;
    }

    // Apply theme class to the host element
    this.setAttribute("data-theme", this.currentTheme);

    return html`
      <ha-card class="${this.currentTheme}-theme">
        ${this.renderStatusBar()} ${this.renderError()} ${this.renderContent()} ${this.renderIncomingCallModal()}
      </ha-card>
    `;
  }

  private renderStatusBar(): TemplateResult {
    const statusClass = this.registered ? "connected" : this.connected ? "connecting" : this.isRetrying ? "retrying" : "disconnected";

    let statusText = "Disconnected";
    if (this.registered) {
      statusText = "Connected";
    } else if (this.connected) {
      statusText = "Registering...";
    } else if (this.isRetrying) {
      statusText = `Retrying... (${this.connectionAttempts}/${this.MAX_RETRY_ATTEMPTS})`;
    }

    return html`
      <div class="status-bar">
        <div class="status-indicator">
          <div class="status-dot ${statusClass}"></div>
          <span>${statusText}</span>
          ${this.isRetrying ? html`<ha-circular-progress size="small" indeterminate></ha-circular-progress>` : ""}
        </div>
        <div class="card-title">${this.config.title || "WebRTC SIP Phone"}</div>
        ${!this.registered && !this.isRetrying
          ? html`<ha-icon-button @click=${this.manualRetry} title="Retry connection">
              <ha-icon icon="mdi:refresh"></ha-icon>
            </ha-icon-button>`
          : ""}
      </div>
    `;
  }

  private renderError(): TemplateResult {
    if (!this.error) return html``;

    const isMultiLine = this.error.includes("\n");

    return html`
      <div class="error-message ${isMultiLine ? "multiline" : ""}">
        <ha-icon icon="mdi:alert-circle"></ha-icon>
        <div class="error-text">${isMultiLine ? this.error.split("\n").map((line) => html`<div>${line}</div>`) : this.error}</div>
      </div>
    `;
  }

  private renderContent(): TemplateResult {
    if (this.callState.active) {
      return this.renderActiveCall();
    }

    return html` <div class="card-content">${this.renderContacts()} ${this.renderManualDial()} ${this.showKeypad ? this.renderKeypad() : ""}</div> `;
  }

  private renderContacts(): TemplateResult {
    if (!this.config.contacts.length) {
      return html`
        <div class="no-contacts">
          <ha-icon icon="mdi:account-plus-outline"></ha-icon>
          <div class="no-contacts-text">No contacts configured</div>
          <div class="no-contacts-subtitle">Add contacts in card configuration</div>
        </div>
      `;
    }

    return html`
      <div class="contacts-section">
        <div class="section-header">
          <ha-icon icon="mdi:contacts"></ha-icon>
          <h3>Quick Dial</h3>
          <div class="contact-count">${this.config.contacts.length}</div>
        </div>
        <div class="contacts-list">${this.config.contacts.map((contact) => this.renderContact(contact))}</div>
      </div>
    `;
  }

  private renderContact(contact: SIPContact): TemplateResult {
    return html`
      <div class="contact-item" ?disabled=${!this.registered}>
        <div class="contact-avatar">
          <ha-icon icon=${contact.icon || "mdi:account"}></ha-icon>
        </div>

        <div class="contact-info">
          <div class="contact-name">${contact.name}</div>
          <div class="contact-details">
            <span class="contact-extension">${formatPhoneNumber(contact.extension)}</span>
          </div>
        </div>

        <div class="contact-actions">
          <button class="action-btn video-btn" @click=${() => this.callContact(contact, true)} ?disabled=${!this.registered} title="Video call">
            <ha-icon icon="mdi:video"></ha-icon>
          </button>
        </div>
      </div>
    `;
  }

  private renderManualDial(): TemplateResult {
    return html`
      <div class="manual-dial">
        <div class="dial-input-container">
          <ha-textfield .value=${this.currentInput} @input=${this.handleInputChange} placeholder="Enter number..." ?disabled=${!this.registered}></ha-textfield>
          <ha-icon-button @click=${this.toggleKeypad} ?disabled=${!this.registered}><ha-icon icon="mdi:dialpad"></ha-icon></ha-icon-button>
        </div>
        <div class="dial-actions">
          <ha-button @click=${() => this.makeVideoCall()} ?disabled=${!this.registered || !this.currentInput.trim()} class="video-call">
            <ha-icon icon="mdi:video" slot="icon"></ha-icon> Video Call
          </ha-button>
          <ha-button @click=${this.clearInput} ?disabled=${!this.currentInput.length}> Clear </ha-button>
        </div>
      </div>
    `;
  }

  private renderKeypad(): TemplateResult {
    return html`
      <div class="keypad">
        ${DTMF_KEYS.flat().map((key) => html` <button class="keypad-button" @click=${() => this.handleKeypadPress(key)}>${key}</button> `)}
      </div>
    `;
  }

  private renderActiveCall(): TemplateResult {
    const isIncoming = this.callState.incoming && this.callState.status === "ringing";
    const isActive = this.callState.status === "answered";
    // Also show controls for outgoing calls that are connecting/ringing
    const isOutgoingRinging = this.callState.outgoing && (this.callState.status === "connecting" || this.callState.status === "ringing");

    return html`
      <div class="active-call">
        ${this.renderCallInfo()} ${this.renderVideoStatus()} ${this.renderVideoArea()} ${isIncoming ? this.renderIncomingCallControls() : ""}
        ${(isActive || isOutgoingRinging) ? this.renderCallControls() : ""} ${isActive ? this.renderInCallKeypad() : ""}
      </div>
    `;
  }

  private renderCallInfo(): TemplateResult {
    return html`
      <div class="call-info">
        <div class="caller-name">${this.callState.callerName || "Unknown"}</div>
        <div class="caller-number">${formatPhoneNumber(this.callState.callerId || "")}</div>
        <div class="call-status">${this.getCallStatusText()}</div>
        ${this.callState.status === "answered" ? html`<div class="call-duration">${this.callDuration}</div>` : ""}
      </div>
    `;
  }

  private renderVideoStatus(): TemplateResult {
    return html`
      <div class="video-status">
        <div class="video-indicator active">
          <ha-icon icon="mdi:video"></ha-icon>
          <span>Camera On</span>
        </div>

        <div class="video-indicator ${this.remoteVideoAvailable ? "active" : "inactive"}">
          <ha-icon icon=${this.remoteVideoAvailable ? "mdi:video" : "mdi:video-off"}></ha-icon>
          <span>${this.remoteVideoAvailable ? "Remote Video" : "No Remote Video"}</span>
        </div>
      </div>
    `;
  }

  private renderVideoArea(): TemplateResult {
    return html`
      <div class="video-container ${this.remoteVideoAvailable ? "has-video" : "no-video"}">
        <video id="remote-video" autoplay playsinline ?muted=${false}></video>
        ${!this.remoteVideoAvailable
          ? html`
              <div class="video-overlay">
                <ha-icon style="color: var(--primary-color);" icon="mdi:video-off"></ha-icon>
                <div style="color: var(--primary-color);">No remote video</div>
              </div>
            `
          : ""}
      </div>
    `;
  }

  private renderIncomingCallControls(): TemplateResult {
    const isAnswering = this.isAnsweringCall;

    return html`
      <div class="call-controls">
        <button class="control-button video" @click=${() => this.answerCall(true)} ?disabled=${isAnswering}>
          <ha-icon icon="mdi:video"></ha-icon>
        </button>
        <button class="control-button danger" @click=${this.rejectCall} ?disabled=${isAnswering}>
          <ha-icon icon="mdi:phone-hangup"></ha-icon>
        </button>
      </div>
    `;
  }

  private renderCallControls(): TemplateResult {
    // For outgoing calls that are still connecting/ringing, show a cancel button instead of hangup
    const isOutgoingConnecting = this.callState.outgoing && (this.callState.status === "connecting" || this.callState.status === "ringing");

    return html`
      <div class="call-controls">
        <button class="control-button ${this.callState.muted ? "danger" : "secondary"}" @click=${this.toggleMute}>
          <ha-icon icon=${this.callState.muted ? "mdi:microphone-off" : "mdi:microphone"}></ha-icon>
        </button>

        ${isOutgoingConnecting
          ? html`<button class="control-button danger" @click=${this.cancelCall}>
              <ha-icon icon="mdi:phone-hangup"></ha-icon>
            </button>`
          : html`<button class="control-button danger" @click=${this.hangupCall}>
              <ha-icon icon="mdi:phone-hangup"></ha-icon>
            </button>`}

        <button class="control-button secondary" @click=${() => (this.showKeypad = !this.showKeypad)}>
          <ha-icon icon="mdi:dialpad"></ha-icon>
        </button>
      </div>
    `;
  }

  private renderInCallKeypad(): TemplateResult {
    if (!this.showKeypad) return html``;

    return html`
      <div class="in-call-keypad">
        <div class="keypad">${DTMF_KEYS.flat().map((key) => html` <button class="keypad-button" @click=${() => this.sendDTMF(key)}>${key}</button> `)}</div>
      </div>
    `;
  }

  private renderIncomingCallModal(): TemplateResult {
    if (!this.callState.incoming || this.callState.status !== "ringing") {
      return html``;
    }

    const isAnswering = this.isAnsweringCall;

    return html`
      <div class="incoming-call-modal">
        <div class="incoming-call-content">
          <div class="incoming-call-avatar">
            <ha-icon icon="mdi:account"></ha-icon>
          </div>
          <div class="caller-name">${this.callState.callerName || "Unknown Caller"}</div>
          <div class="caller-number">${formatPhoneNumber(this.callState.callerId || "")}</div>
          <div class="incoming-call-actions">
            <button class="video-answer-button" @click=${() => this.answerCall(true)} ?disabled=${isAnswering}>
              <ha-icon icon="mdi:video"></ha-icon>
            </button>
            <button class="reject-button" @click=${this.rejectCall} ?disabled=${isAnswering}>
              <ha-icon icon="mdi:phone-hangup"></ha-icon>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private getCallStatusText(): string {
    switch (this.callState.status) {
      case "connecting":
        return "Connecting...";
      case "ringing":
        return this.callState.incoming ? "Incoming call" : "Ringing...";
      case "answered":
        return "Connected";
      case "ended":
        return "Call ended";
      case "error":
        return "Call failed";
      default:
        return "";
    }
  }

  private handleInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.currentInput = sanitizeExtension(target.value);
  }

  private handleKeypadPress(key: string): void {
    this.currentInput += key;
    this.requestUpdate();
  }

  private toggleKeypad(): void {
    this.showKeypad = !this.showKeypad;
  }

  private clearInput(): void {
    this.currentInput = "";
  }

  private async manualRetry(): Promise<void> {
    this.connectionAttempts = 0;
    this.error = null;
    await this.attemptConnection();
  }

  private async callContact(contact: SIPContact, withVideo = true): Promise<void> {
    if (!this.callManager || !this.registered) return;

    try {
      await this.callManager.makeCall(contact.extension, withVideo);
      console.log(`Video call started to ${contact.name}`);
    } catch (error) {
      console.error("Failed to call contact:", error);
      this.error = `Failed to call ${contact.name}`;
    }
  }

  private async makeVideoCall(): Promise<void> {
    if (!this.callManager || !this.registered || !this.currentInput.trim()) return;

    try {
      await this.callManager.makeCall(this.currentInput.trim(), true);
      this.currentInput = "";
      this.showKeypad = false;
    } catch (error) {
      console.error("Failed to make video call:", error);
      this.error = "Failed to make video call";
    }
  }

  private isAnsweringCall = false; // Flag to prevent multiple simultaneous answer calls

  private async answerCall(withVideo = true): Promise<void> {
    if (!this.callManager) return;

    // Prevent multiple simultaneous answer calls
    if (this.isAnsweringCall) {
      console.warn("Call is already being answered, ignoring duplicate request");
      return;
    }

    try {
      this.isAnsweringCall = true;

      if (withVideo) {
        await this.callManager.enableVideo();
      }
      await this.callManager.answerCall();
    } catch (error) {
      console.error("Failed to answer call:", error);
      this.error = "Failed to answer call";
    } finally {
      this.isAnsweringCall = false;
    }
  }

  private async rejectCall(): Promise<void> {
    if (!this.callManager) return;

    try {
      await this.callManager.rejectCall();
    } catch (error) {
      console.error("Failed to reject call:", error);
    }
  }

  private async hangupCall(): Promise<void> {
    if (!this.callManager) return;

    try {
      await this.callManager.hangupCall();
      this.showKeypad = false;
    } catch (error) {
      console.error("Failed to hangup call:", error);
    }
  }

  private async cancelCall(): Promise<void> {
    if (!this.callManager) return;

    try {
      // For outgoing calls in "connecting" or "ringing" state, we use hangup to cancel
      await this.callManager.hangupCall();
      this.showKeypad = false;
    } catch (error) {
      console.error("Failed to cancel call:", error);
    }
  }

  private async toggleMute(): Promise<void> {
    if (!this.callManager) return;

    try {
      await this.callManager.toggleMute();
    } catch (error) {
      console.error("Failed to toggle mute:", error);
      this.error = "Failed to toggle mute";
    }
  }

  private sendDTMF(tone: string): void {
    if (!this.callManager) return;
    this.callManager.sendDTMF(tone);
  }

  static get styles(): CSSResultGroup {
    return [
      sharedStyles,
      css`
        :host {
          /* Default light theme variables */
          --primary-color: #03a9f4;
          --accent-color: #ff9800;
          --primary-text-color: #212121;
          --divider-color: #e0e0e0;
          --success-color: #4caf50;
          --warning-color: #ffc107;
          --error-color: #f44336;
          --info-color: #2196f3;
          --primary-color-rgb: 3, 169, 244;
          --success-color-rgb: 76, 175, 80;
          --error-color-rgb: 244, 67, 54;
          --disabled-text-color-rgb: 189, 189, 189;
          --sip-divider-color: var(--divider-color);
          --sip-text-secondary-color: var(--secondary-text-color);
          --sip-success-color: var(--success-color);
          --sip-danger-color: var(--error-color);
          --code-font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
        }

        /* Dark theme variables */
        :host([data-theme="dark"]) {
          --primary-color: #42a5f5;
          --accent-color: #ffab40;
          --divider-color: #4a4a4a;
          --success-color: #66bb6a;
          --warning-color: #ffca28;
          --error-color: #ef5350;
          --info-color: #42a5f5;
          --primary-color-rgb: 66, 165, 245;
          --success-color-rgb: 102, 187, 106;
          --error-color-rgb: 239, 83, 80;
          --disabled-text-color-rgb: 117, 117, 117;
          --sip-divider-color: var(--divider-color);
          --sip-text-secondary-color: var(--secondary-text-color);
          --sip-success-color: var(--success-color);
          --sip-danger-color: var(--error-color);
          --code-font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
        }

        .card-title {
          font-weight: 500;
          font-size: 16px;
        }

        .status-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid var(--divider-color);
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .status-dot.connected {
          background: var(--success-color, #4caf50);
          animation: none;
        }

        .status-dot.connecting {
          background: var(--warning-color, #ff9800);
        }

        .status-dot.retrying {
          background: var(--info-color, #2196f3);
        }

        .status-dot.disconnected {
          background: var(--error-color, #f44336);
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .error-message {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          margin: 16px;
          background: rgba(var(--error-color-rgb, 244, 67, 54), 0.1);
          border: 1px solid var(--error-color, #f44336);
          border-radius: 8px;
          color: var(--error-color, #f44336);
        }

        .error-message.multiline {
          align-items: flex-start;
        }

        .error-message ha-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .error-text div {
          margin: 2px 0;
          font-size: 13px;
        }

        .contacts-section {
          margin-bottom: 24px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding: 0 4px;
        }

        .section-header ha-icon {
          color: var(--primary-color);
          font-size: 20px;
        }

        .section-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 500;
          color: var(--primary-text-color);
          flex: 1;
        }

        .contact-count {
          background: var(--primary-color);
          color: white;
          font-size: 12px;
          font-weight: 500;
          padding: 2px 8px;
          border-radius: 12px;
          min-width: 16px;
          text-align: center;
        }

        .no-contacts {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 48px 16px;
          text-align: center;
          background: var(--card-background-color);
          border: 2px dashed var(--divider-color);
          border-radius: 16px;
          margin-bottom: 24px;
        }

        .no-contacts ha-icon {
          font-size: 48px;
          color: var(--disabled-text-color);
          margin-bottom: 16px;
        }

        .no-contacts-text {
          font-size: 16px;
          font-weight: 500;
          color: var(--primary-text-color);
          margin-bottom: 4px;
        }

        .no-contacts-subtitle {
          font-size: 14px;
          color: var(--secondary-text-color);
        }

        .contacts-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          padding: 16px;
          background: var(--card-background-color);
          border: 1px solid var(--divider-color);
          border-radius: 16px;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .contact-item::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: var(--primary-color);
          transform: scaleY(0);
          transition: transform 0.2s ease;
        }

        .contact-item:hover:not([disabled]) {
          border-color: var(--primary-color);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .contact-item:hover:not([disabled])::before {
          transform: scaleY(1);
        }

        .contact-item[disabled] {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .contact-item[disabled] .action-btn {
          pointer-events: none;
        }

        .contact-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-color), var(--accent-color, var(--primary-color)));
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          flex-shrink: 0;
        }

        .contact-avatar ha-icon {
          font-size: 24px;
          color: white;
        }

        .contact-info {
          flex: 1;
          min-width: 0;
        }

        .contact-name {
          font-size: 16px;
          font-weight: 500;
          color: var(--primary-text-color);
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .contact-details {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .contact-extension {
          font-size: 14px;
          color: var(--secondary-text-color);
          font-family: var(--code-font-family, monospace);
          background: var(--secondary-background-color);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .video-badge {
          font-size: 11px;
          font-weight: 500;
          color: var(--primary-color);
          background: rgba(var(--primary-color-rgb, 33, 150, 243), 0.1);
          padding: 2px 6px;
          border-radius: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .contact-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }

        .action-btn {
          width: 44px;
          height: 44px;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .action-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          background: currentColor;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .action-btn:hover::before {
          opacity: 0.1;
        }

        .action-btn:active {
          transform: scale(0.95);
        }

        .action-btn ha-icon {
          font-size: 20px;
          z-index: 1;
        }

        .video-btn {
          background: var(--primary-color);
          color: white;
          box-shadow: 0 2px 4px rgba(var(--primary-color-rgb, 33, 150, 243), 0.3);
        }

        .video-btn:hover {
          box-shadow: 0 4px 12px rgba(var(--primary-color-rgb, 33, 150, 243), 0.4);
          transform: translateY(-2px);
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        .manual-dial {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid var(--sip-divider-color);
        }

        .dial-input-container {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .dial-input-container ha-textfield {
          flex: 1;
        }

        .dial-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .active-call {
          padding: 16px;
        }

        .call-status {
          font-size: 14px;
          color: var(--sip-text-secondary-color);
          margin-bottom: 8px;
        }

        .in-call-keypad {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--sip-divider-color);
        }

        .video-container {
          position: relative;
          width: 100%;
          height: 240px;
          background: #000;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video-container video {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background: #000;
          border-radius: 12px;
        }

        .video-container.has-video video {
          opacity: 1;
        }

        .video-container.no-video video {
          opacity: 0;
        }

        .video-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          color: var(--primary-text-color);
          opacity: 0.7;
        }

        .video-overlay ha-icon {
          font-size: 48px;
          margin-bottom: 8px;
        }

        .video-status {
          display: flex;
          justify-content: center;
          gap: 16px;
          padding: 8px 16px;
          background: var(--secondary-background-color);
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .video-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .video-indicator.active {
          background: rgba(var(--success-color-rgb, 76, 175, 80), 0.1);
          color: var(--success-color, #4caf50);
        }

        .video-indicator.active ha-icon {
          color: var(--success-color, #4caf50);
        }

        .video-indicator.inactive {
          background: rgba(var(--disabled-text-color-rgb, 128, 128, 128), 0.1);
          color: var(--disabled-text-color, #808080);
        }

        .video-indicator.inactive ha-icon {
          color: var(--disabled-text-color, #808080);
        }

        .control-button.primary {
          background: var(--sip-success-color);
          color: white;
        }

        .control-button.video {
          background: var(--primary-color);
          color: white;
        }

        .control-button.secondary {
          background: var(--secondary-background-color);
          color: var(--primary-text-color);
        }

        .control-button.danger {
          background: var(--sip-danger-color);
          color: white;
        }

        .incoming-call-actions {
          display: flex;
          justify-content: center;
          gap: 24px;
        }

        .video-answer-button {
          background: var(--primary-color);
          border: none;
          border-radius: 50%;
          width: 64px;
          height: 64px;
          color: white;
          font-size: 24px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .video-answer-button:hover {
          transform: scale(1.1);
        }

        ha-button.video-call {
          --mdc-theme-primary: var(--primary-color);
        }

        ha-textfield {
          width: 100%;
        }

        ha-icon-button {
          --mdc-icon-button-size: 40px;
        }

        @media (max-width: 600px) {
          .contact-item {
            padding: 12px;
          }

          .contact-avatar {
            width: 40px;
            height: 40px;
            margin-right: 12px;
          }

          .contact-avatar ha-icon {
            font-size: 20px;
          }

          .action-btn {
            width: 40px;
            height: 40px;
          }

          .action-btn ha-icon {
            font-size: 18px;
          }

          .contact-name {
            font-size: 15px;
          }

          .contact-extension {
            font-size: 13px;
          }

          .video-container {
            height: 200px;
          }
        }

        @media (max-width: 400px) {
          .section-header {
            margin-bottom: 12px;
          }

          .contacts-list {
            gap: 6px;
          }

          .contact-item {
            padding: 10px;
          }

          .contact-actions {
            gap: 6px;
          }

          .video-container {
            height: 160px;
          }
        }
      `,
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-webrtc-sip-card": WebRTCSipCard;
  }
}

// HACS Integration Information
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "ha-webrtc-sip-card",
  name: "WebRTC SIP Card",
  description: "A modern WebRTC SIP client card for Home Assistant with video calling functionality",
  preview: true,
  documentationURL: "https://github.com/Ahmed9190/ha-webrtc-sip-card",
  version: CARD_VERSION,
});

console.info(
  `%c HA-WEBRTC-SIP-CARD %c ${CARD_VERSION} `,
  "color: white; background: #03a9f4; font-weight: bold;",
  "color: #03a9f4; background: white; font-weight: bold;"
);

// Add HACS banner
console.info("%c 🏠 HACS Compatible", "color: white; background: #4285F4; font-weight: bold; padding: 5px 10px; border-radius: 5px;");
