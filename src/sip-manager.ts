import { debugLog, errorLog } from "./utils";

type SimpleUser = any;
type SimpleUserOptions = any;
let Web: any = null;

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

export class SipManager extends EventTarget {
  private simpleUser: SimpleUser | null = null;
  private config: SipConfig | null = null;
  private isRegistered = false;
  private isConnected = false;
  private connectionTimer: number | null = null;
  private currentCall: CallInfo | null = null;
  private remoteAudio: HTMLAudioElement | null = null;
  private remoteVideo: HTMLVideoElement | null = null;
  private localVideo: HTMLVideoElement | null = null;
  private localStream: MediaStream | null = null;
  private videoEnabled = false;
  private isInitialized = false;
  private isInitializing = false;
  private lastVideoState = false;
  private isEnablingVideo = false; // Flag to prevent multiple simultaneous enableVideo calls

  constructor() {
    super();
    this.setupMediaElements();
  }

  private setupMediaElements(): void {
    this.remoteAudio = document.createElement("audio");
    this.remoteAudio.autoplay = true;
    this.remoteAudio.style.display = "none";
    document.body.appendChild(this.remoteAudio);

    this.remoteVideo = document.createElement("video");
    this.remoteVideo.autoplay = true;
    this.remoteVideo.playsInline = true;
    this.remoteVideo.style.display = "none";
    document.body.appendChild(this.remoteVideo);

    this.localVideo = document.createElement("video");
    this.localVideo.autoplay = true;
    this.localVideo.muted = true;
    this.localVideo.playsInline = true;
    this.localVideo.style.display = "none";
    document.body.appendChild(this.localVideo);
  }

  private async getUserMedia(includeVideo: boolean = false): Promise<MediaStream> {
    const constraints: MediaStreamConstraints = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 48000,
      },
      video: includeVideo
        ? {
            width: { ideal: 640, min: 320, max: 1280 },
            height: { ideal: 480, min: 240, max: 720 },
            frameRate: { ideal: 30, min: 15, max: 30 },
            facingMode: "user",
          }
        : false,
    };

    return navigator.mediaDevices.getUserMedia(constraints);
  }

  public async enableVideo(): Promise<void> {
    // Prevent multiple simultaneous enableVideo calls
    if (this.isEnablingVideo) {
      debugLog(this.config?.debug || false, "Video is already being enabled, ignoring duplicate request");
      return;
    }

    try {
      this.isEnablingVideo = true;
      
      const stream = await this.getUserMedia(true);

      if (this.localStream) {
        this.localStream.getTracks().forEach((track) => track.stop());
      }

      if (this.localVideo) {
        this.localVideo.srcObject = stream;
      }

      this.localStream = stream;
      this.videoEnabled = true;

      debugLog(this.config?.debug || false, "Local video enabled with new stream:", {
        videoTracks: stream.getVideoTracks().length,
        audioTracks: stream.getAudioTracks().length,
        streamId: stream.id,
      });

      if (this.simpleUser?.session && this.currentCall?.state === "connected") {
        await this.replaceMediaTracks(stream);
      }

      this.dispatchEvent(
        new CustomEvent("localVideoChanged", {
          detail: {
            enabled: true,
            transmitting: stream.getVideoTracks().some((track) => track.enabled && track.readyState === "live"),
          },
        })
      );
    } catch (error) {
      errorLog("Enable video failed", error);
      this.videoEnabled = false;
      throw error;
    } finally {
      this.isEnablingVideo = false;
    }
  }

  public async disableVideo(): Promise<void> {
    try {
      const audioOnlyStream = await this.getUserMedia(false);

      if (this.localVideo) {
        this.localVideo.srcObject = null;
      }

      if (this.localStream) {
        this.localStream.getTracks().forEach((track) => {
          track.stop();
          debugLog(this.config?.debug || false, `Stopped ${track.kind} track:`, track.id);
        });
      }

      this.localStream = audioOnlyStream;
      this.videoEnabled = false;

      debugLog(this.config?.debug || false, "Local video disabled, using audio-only stream:", {
        videoTracks: audioOnlyStream.getVideoTracks().length,
        audioTracks: audioOnlyStream.getAudioTracks().length,
        streamId: audioOnlyStream.id,
      });

      if (this.simpleUser?.session && this.currentCall?.state === "connected") {
        await this.replaceMediaTracks(audioOnlyStream);
      }

      this.dispatchEvent(
        new CustomEvent("localVideoChanged", {
          detail: {
            enabled: false,
            transmitting: false,
          },
        })
      );
    } catch (error) {
      errorLog("Disable video failed", error);
      throw error;
    }
  }

  private async replaceMediaTracks(newStream: MediaStream): Promise<void> {
    try {
      const session = this.simpleUser?.session;
      if (!session || !session.sessionDescriptionHandler) {
        debugLog(this.config?.debug || false, "No active session to replace tracks");
        return;
      }

      const pc = session.sessionDescriptionHandler.peerConnection;
      if (!pc) {
        debugLog(this.config?.debug || false, "No peer connection found");
        return;
      }

      const senders = pc.getSenders();

      const audioTrack = newStream.getAudioTracks()[0];
      const audioSender = senders.find((sender: any) => sender.track && sender.track.kind === "audio");
      if (audioSender && audioTrack) {
        await audioSender.replaceTrack(audioTrack);
        debugLog(this.config?.debug || false, "Audio track replaced successfully");
      }

      const videoTrack = newStream.getVideoTracks()[0] || null;
      const videoSender = senders.find((sender: any) => sender.track && sender.track.kind === "video");

      if (videoSender) {
        await videoSender.replaceTrack(videoTrack);
        debugLog(this.config?.debug || false, videoTrack ? "Video track replaced" : "Video track removed from sender");
      } else if (videoTrack) {
        try {
          pc.addTrack(videoTrack, newStream);
          debugLog(this.config?.debug || false, "Video track added to peer connection");

          if (session.sessionDescriptionHandler && typeof session.sessionDescriptionHandler.sendReinvite === "function") {
            await session.sessionDescriptionHandler.sendReinvite();
            debugLog(this.config?.debug || false, "Session renegotiated for new video track");
          }
        } catch (error) {
          debugLog(this.config?.debug || false, "Failed to add video track:", error);
        }
      }
    } catch (error) {
      debugLog(this.config?.debug || false, "Replace media tracks failed but call continues:", error);
    }
  }

  public async toggleVideo(): Promise<boolean> {
    try {
      if (this.videoEnabled) {
        await this.disableVideo();
        return false;
      } else {
        await this.enableVideo();
        return true;
      }
    } catch (error) {
      errorLog("Toggle video failed", error);
      throw error;
    }
  }

  public getLocalVideoState(): { enabled: boolean; transmitting: boolean } {
    return {
      enabled: this.videoEnabled,
      transmitting: this.localStream ? this.localStream.getVideoTracks().some((track) => track.enabled && track.readyState === "live") : false,
    };
  }

  private setupRemoteStreamHandlers(session: any): void {
    try {
      const sessionDescriptionHandler = session.sessionDescriptionHandler;
      if (!sessionDescriptionHandler) {
        debugLog(this.config?.debug || false, "No session description handler");
        return;
      }

      const pc = sessionDescriptionHandler.peerConnection;
      if (!pc) {
        debugLog(this.config?.debug || false, "No peer connection");
        return;
      }

      debugLog(this.config?.debug || false, "Setting up remote stream handlers for", pc.connectionState);

      pc.ontrack = (event: RTCTrackEvent) => {
        debugLog(this.config?.debug || false, "Remote track received:", {
          kind: event.track.kind,
          readyState: event.track.readyState,
          enabled: event.track.enabled,
          streams: event.streams.length,
          transceiver: event.transceiver.direction,
        });

        const stream = event.streams[0];
        if (!stream) {
          debugLog(this.config?.debug || false, "No stream in track event");
          return;
        }

        if (event.track.kind === "audio") {
          if (this.remoteAudio) {
            this.remoteAudio.srcObject = stream;
            debugLog(this.config?.debug || false, "Remote audio stream attached");
          }
        } else if (event.track.kind === "video") {
          if (this.remoteVideo) {
            this.remoteVideo.srcObject = stream;
            this.remoteVideo.autoplay = true;
            this.remoteVideo.playsInline = true;

            debugLog(this.config?.debug || false, "Remote video stream attached, playing...");

            // Handle video play with better error handling
            if (this.remoteVideo.srcObject) {
              const playPromise = this.remoteVideo.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    debugLog(this.config?.debug || false, "Remote video playing successfully");
                  })
                  .catch((error) => {
                    debugLog(this.config?.debug || false, "Remote video play failed:", error);
                    
                    // Handle specific error types
                    if (error.name === "NotAllowedError") {
                      debugLog(this.config?.debug || false, "Video play not allowed, likely due to autoplay restrictions");
                      
                      // Try to handle autoplay restrictions by muting and retrying
                      if (this.remoteVideo) {
                        this.remoteVideo.muted = true;
                        const retryPromise = this.remoteVideo.play();
                        if (retryPromise !== undefined) {
                          retryPromise.catch((retryError) => {
                            debugLog(this.config?.debug || false, "Muted video play retry failed:", retryError);
                            
                            // Last resort: re-attach the stream
                            if (this.remoteVideo && this.remoteVideo.srcObject) {
                              const currentStream = this.remoteVideo.srcObject;
                              this.remoteVideo.srcObject = null;
                              this.remoteVideo.srcObject = currentStream;
                              setTimeout(() => {
                                if (this.remoteVideo && this.remoteVideo.srcObject) {
                                  this.remoteVideo.muted = true;
                                  const finalPromise = this.remoteVideo.play();
                                  if (finalPromise !== undefined) {
                                    finalPromise.catch((finalError) => {
                                      debugLog(this.config?.debug || false, "Final video play attempt failed:", finalError);
                                    });
                                  }
                                }
                              }, 100);
                            }
                          });
                        }
                      }
                                      } else if (error.name === "AbortError") {
                    debugLog(this.config?.debug || false, "Video play was interrupted, this is normal during stream updates");
                    
                    // Retry after a short delay, but be more careful about the timing
                    setTimeout(() => {
                      if (this.remoteVideo && this.remoteVideo.srcObject) {
                        // Check if the video element is in a playable state
                        if (this.remoteVideo.readyState >= 2) { // HAVE_CURRENT_DATA
                          const retryPromise = this.remoteVideo.play();
                          if (retryPromise !== undefined) {
                            retryPromise.catch((retryError) => {
                              debugLog(this.config?.debug || false, "Video play retry failed:", retryError);
                            });
                          }
                        } else {
                          // If not ready, wait a bit more
                          setTimeout(() => {
                            if (this.remoteVideo && this.remoteVideo.srcObject) {
                              const retryPromise = this.remoteVideo.play();
                              if (retryPromise !== undefined) {
                                retryPromise.catch((retryError) => {
                                  debugLog(this.config?.debug || false, "Delayed video play retry failed:", retryError);
                                });
                              }
                            }
                          }, 200);
                        }
                      }
                    }, 150);
                    } else {
                      // Try to handle other errors by re-attaching the stream
                      if (this.remoteVideo && this.remoteVideo.srcObject) {
                        const currentStream = this.remoteVideo.srcObject;
                        this.remoteVideo.srcObject = null;
                        this.remoteVideo.srcObject = currentStream;
                        setTimeout(() => {
                          if (this.remoteVideo && this.remoteVideo.srcObject) {
                            const retryPromise = this.remoteVideo.play();
                            if (retryPromise !== undefined) {
                              retryPromise.catch((retryError) => {
                                debugLog(this.config?.debug || false, "Remote video play retry failed:", retryError);
                              });
                            }
                          }
                        }, 100);
                      }
                    }
                  });
              }
            }

            const videoTracks = stream.getVideoTracks();
            const hasActiveVideo = videoTracks.length > 0 && videoTracks.some((track) => track.enabled);

            debugLog(this.config?.debug || false, "Video track details:", {
              trackCount: videoTracks.length,
              hasActive: hasActiveVideo,
              trackStates: videoTracks.map((t) => ({
                id: t.id,
                enabled: t.enabled,
                readyState: t.readyState,
                label: t.label,
              })),
            });

            this.lastVideoState = hasActiveVideo;

            this.dispatchEvent(
              new CustomEvent("remoteVideoChanged", {
                detail: {
                  enabled: true,
                  stream: stream,
                  hasVideoTracks: hasActiveVideo,
                },
              })
            );

            setTimeout(() => {
              this.dispatchEvent(
                new CustomEvent("remoteVideoChanged", {
                  detail: {
                    enabled: true,
                    stream: stream,
                    hasVideoTracks: hasActiveVideo,
                  },
                })
              );
            }, 200);
          }
        }
      };

      pc.oniceconnectionstatechange = () => {
        debugLog(this.config?.debug || false, "ICE connection state changed:", pc.iceConnectionState);

        if (pc.iceConnectionState === "failed") {
          errorLog("ICE connection failed - attempting to recover");
          this.handleIceConnectionFailure(pc);
        }
      };

      pc.onicegatheringstatechange = () => {
        debugLog(this.config?.debug || false, "ICE gathering state changed:", pc.iceGatheringState);
      };

      pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
        if (event.candidate) {
          debugLog(this.config?.debug || false, "ICE candidate:", event.candidate.type, event.candidate.candidate);
        } else {
          debugLog(this.config?.debug || false, "ICE gathering complete");
        }
      };

      pc.onconnectionstatechange = () => {
        debugLog(this.config?.debug || false, "Connection state changed:", pc.connectionState);

        if (pc.connectionState === "failed") {
          errorLog("Peer connection failed completely");
          this.handleConnectionFailure();
        } else if (pc.connectionState === "connected") {
          setTimeout(() => {
            const transceivers = pc.getTransceivers();
            debugLog(this.config?.debug || false, "Checking transceivers:", transceivers.length);

            transceivers.forEach((transceiver: RTCRtpTransceiver, index: number) => {
              debugLog(this.config?.debug || false, `Transceiver ${index}:`, {
                direction: transceiver.direction,
                kind: transceiver.receiver?.track?.kind,
                trackState: transceiver.receiver?.track?.readyState,
                hasTrack: !!transceiver.receiver?.track,
              });

              if (transceiver.receiver?.track?.kind === "video" && transceiver.receiver.track.readyState === "live") {
                debugLog(this.config?.debug || false, "Found active video transceiver");

                let videoStream: MediaStream;
                if (this.remoteVideo?.srcObject instanceof MediaStream) {
                  videoStream = this.remoteVideo.srcObject;
                } else {
                  videoStream = new MediaStream([transceiver.receiver.track]);
                  if (this.remoteVideo) {
                    this.remoteVideo.srcObject = videoStream;
                  }
                }

                this.dispatchEvent(
                  new CustomEvent("remoteVideoChanged", {
                    detail: {
                      enabled: true,
                      stream: videoStream,
                      hasVideoTracks: true,
                    },
                  })
                );
              }
            });
          }, 500);
        }
      };

      pc.onremovetrack = (event: RTCTrackEvent) => {
        debugLog(this.config?.debug || false, "Remote track removed:", event.track.kind);

        if (event.track.kind === "video" && this.remoteVideo) {
          this.remoteVideo.srcObject = null;
          this.lastVideoState = false;

          this.dispatchEvent(
            new CustomEvent("remoteVideoChanged", {
              detail: {
                enabled: false,
                stream: null,
                hasVideoTracks: false,
              },
            })
          );
        }
      };
    } catch (error) {
      errorLog("Failed to setup remote stream handlers:", error);
    }
  }

  private handleIceConnectionFailure(pc: RTCPeerConnection): void {
    debugLog(this.config?.debug || false, "Attempting ICE restart");

    setTimeout(() => {
      if (pc.iceConnectionState === "failed") {
        try {
          pc.restartIce();
          debugLog(this.config?.debug || false, "ICE restart initiated");
        } catch (error) {
          errorLog("ICE restart failed:", error);
        }
      }
    }, 1000);
  }

  private handleConnectionFailure(): void {
    errorLog("Connection failed - notifying UI");

    this.dispatchEvent(
      new CustomEvent("error", {
        detail: {
          error: "Connection failed - check network and STUN servers",
          type: "connection_failure",
        },
      })
    );
  }

  private async waitForSipLibrary(timeout = 15000): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      const startTime = Date.now();
      const timeoutId = setTimeout(() => {
        reject(new Error(`SIP.js library loading timeout after ${timeout}ms`));
      }, timeout);

      const checkLibrary = async () => {
        try {
          if (!Web) {
            const SIP = await import("sip.js");
            Web = (SIP as any).Web || SIP;
          }

          const isFullyLoaded =
            Web &&
            Web.SimpleUser &&
            Web.SimpleUser.prototype &&
            typeof Web.SimpleUser.prototype.register === "function" &&
            typeof Web.SimpleUser.prototype.connect === "function" &&
            typeof Web.SimpleUser.prototype.disconnect === "function";

          if (isFullyLoaded) {
            clearTimeout(timeoutId);
            debugLog(this.config?.debug || false, "SIP.js library fully loaded and verified");
            resolve();
            return;
          }

          if (Date.now() - startTime > timeout) {
            clearTimeout(timeoutId);
            reject(new Error("SIP.js library verification timeout"));
            return;
          }

          setTimeout(checkLibrary, 100);
        } catch (error) {
          setTimeout(checkLibrary, 200);
        }
      };

      checkLibrary();
    });
  }

  private async ensureSipClient(): Promise<void> {
    if (this.isInitialized) return;

    if (this.isInitializing) {
      return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (this.isInitialized) {
            clearInterval(checkInterval);
            resolve();
          } else if (!this.isInitializing) {
            clearInterval(checkInterval);
            reject(new Error("Initialization failed"));
          }
        }, 100);
      });
    }

    if (!this.config) {
      throw new Error("SIP configuration not set");
    }

    await this.initialize(this.config);
  }

  setConfig(config: SipConfig): void {
    this.config = config;
    debugLog(config.debug || false, "SIP configuration set, will initialize on first use");
  }

  async initialize(config: SipConfig): Promise<void> {
    if (this.isInitializing || this.isInitialized) return;

    this.isInitializing = true;
    this.config = config;

    debugLog(config.debug || false, "Starting lazy SIP initialization");

    try {
      await this.waitForSipLibrary();
      await new Promise((resolve) => setTimeout(resolve, 500));

      const wsProtocol = config.use_secure ? "wss" : "ws";
      const wsPort = config.websocket_port || (config.use_secure ? 443 : 80);
      const wsServer = `${wsProtocol}://${config.server}:${wsPort}`;
      const sipAor = `sip:${config.username}@${config.domain}`;

      debugLog(config.debug || false, "WebSocket URL:", wsServer);
      debugLog(config.debug || false, "SIP AOR:", sipAor);

      const getMediaOptions = (includeVideo: boolean = false) => ({
        constraints: includeVideo
          ? {
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
              },
              video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                frameRate: { ideal: 30 },
              },
            }
          : {
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
              },
              video: false,
            },
        remote: {
          audio: this.remoteAudio!,
          video: this.remoteVideo!,
        },
      });

      const options: SimpleUserOptions = {
        aor: sipAor,
        media: getMediaOptions(false),
        userAgentOptions: {
          authorizationUsername: config.username,
          authorizationPassword: config.password,
          displayName: config.display_name || config.username,
          transportOptions: {
            server: wsServer,
            connectionTimeout: 15,
            maxReconnectionAttempts: 3,
            reconnectionTimeout: 4,
          },
          logLevel: config.debug ? "debug" : "error",
          sessionDescriptionHandlerFactoryOptions: {
            constraints: {
              audio: true,
              video: false,
            },
            peerConnectionConfiguration: {
              iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:stun1.l.google.com:19302" },
                { urls: "stun:stun2.l.google.com:19302" },
                { urls: "stun:stun3.l.google.com:19302" },
              ],
              iceCandidatePoolSize: 10,
              iceTransportPolicy: "all",
              bundlePolicy: "balanced",
              rtcpMuxPolicy: "require",
            },
          },
        },
      };

      if (!Web || !Web.SimpleUser) {
        throw new Error("SIP.js Web.SimpleUser not available after loading");
      }

      this.simpleUser = new Web.SimpleUser(wsServer, options);

      if (!this.simpleUser) {
        throw new Error("Failed to create SimpleUser instance");
      }

      if (!this.simpleUser.register || typeof this.simpleUser.register !== "function") {
        throw new Error("SimpleUser register method not available - library incomplete");
      }

      debugLog(config.debug || false, "SimpleUser created and verified successfully");

      this.setupEventHandlers();

      debugLog(config.debug || false, `Connecting to: ${wsServer}`);
      await this.simpleUser.connect();

      this.isConnected = true;
      this.dispatchEvent(new CustomEvent("connected"));
      debugLog(config.debug || false, "Connected to WebSocket server");

      debugLog(config.debug || false, "Registering with SIP server...");
      await this.simpleUser.register();

      this.isRegistered = true;
      this.dispatchEvent(new CustomEvent("registered", { detail: { registered: true } }));

      this.startConnectionMonitoring();

      this.isInitialized = true;
      this.isInitializing = false;

      debugLog(config.debug || false, "SIP client lazy initialization completed successfully");
    } catch (error) {
      this.isInitializing = false;
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      errorLog("SIP lazy initialization failed:", errorMessage);

      this.isConnected = false;
      this.isRegistered = false;

      if (this.simpleUser) {
        try {
          await this.simpleUser.disconnect();
        } catch (cleanupError) {
          debugLog(config.debug || false, "Cleanup error", cleanupError);
        }
        this.simpleUser = null;
      }

      this.dispatchEvent(
        new CustomEvent("error", {
          detail: {
            error: errorMessage,
            type: "initialization",
          },
        })
      );

      throw new Error(`Failed to initialize SIP client: ${errorMessage}`);
    }
  }

  private setupEventHandlers(): void {
    if (!this.simpleUser) {
      errorLog("Cannot setup event handlers: SimpleUser is null");
      return;
    }

    debugLog(this.config?.debug || false, "Setting up event handlers");

    this.simpleUser.delegate = {
      onCallCreated: () => {
        debugLog(this.config?.debug || false, "Call created");
        this.dispatchEvent(new CustomEvent("callCreated"));
      },

      onCallReceived: () => {
        debugLog(this.config?.debug || false, "Incoming call received");

        const session = this.simpleUser?.session;
        if (!session) {
          debugLog(this.config?.debug || false, "No session found for incoming call");
          return;
        }

        let remoteIdentity = "unknown";
        let displayName = "Unknown Caller";

        try {
          debugLog(this.config?.debug || false, "Current session state:", session.state);

          this.setupRemoteStreamHandlers(session);

          if (session.request) {
            const fromHeader = session.request.getHeader("From");
            debugLog(this.config?.debug || false, "From header:", fromHeader);

            if (fromHeader) {
              const uriMatches = fromHeader.match(/<sip:([^@]+)@/) || fromHeader.match(/sip:([^@]+)@/);
              if (uriMatches && uriMatches[1]) {
                remoteIdentity = uriMatches[1];
                debugLog(this.config?.debug || false, "Extracted extension from From:", remoteIdentity);
              }

              const nameMatches = fromHeader.match(/^"([^"]*)"/) || fromHeader.match(/^([^<]*)</);
              if (nameMatches && nameMatches[1] && nameMatches[1].trim()) {
                displayName = nameMatches[1].trim();
                debugLog(this.config?.debug || false, "Extracted display name:", displayName);
              } else if (remoteIdentity !== "unknown") {
                displayName = remoteIdentity;
              }
            }
          }

          if (remoteIdentity === "unknown" && session.remoteIdentity) {
            debugLog(this.config?.debug || false, "Trying session.remoteIdentity:", session.remoteIdentity);

            if (session.remoteIdentity.uri) {
              const uriString = session.remoteIdentity.uri.toString();
              debugLog(this.config?.debug || false, "Remote URI:", uriString);

              const matches = uriString.match(/sip:([^@]+)@/);
              if (matches && matches[1]) {
                remoteIdentity = matches[1];
                debugLog(this.config?.debug || false, "Extracted from remote URI:", remoteIdentity);
              }
            }

            if (session.remoteIdentity.displayName) {
              displayName = session.remoteIdentity.displayName;
              debugLog(this.config?.debug || false, "Remote display name:", displayName);
            } else if (remoteIdentity !== "unknown") {
              displayName = remoteIdentity;
            }
          }
        } catch (error) {
          debugLog(this.config?.debug || false, "Error parsing caller info:", error);
        }

        debugLog(this.config?.debug || false, "Final parsed caller info:", { remoteIdentity, displayName });

        this.currentCall = {
          id: Date.now().toString(),
          remoteIdentity: remoteIdentity,
          displayName: displayName,
          state: "incoming",
          duration: 0,
        };

        this.dispatchEvent(
          new CustomEvent("incomingCall", {
            detail: {
              from: remoteIdentity,
              displayName: displayName,
              callInfo: this.currentCall,
            },
          })
        );
      },

      onCallAnswered: () => {
        if (this.currentCall) {
          this.currentCall.state = "connected";
          this.currentCall.startTime = new Date();
        }

        debugLog(this.config?.debug || false, "Call answered");

        if (this.simpleUser?.session) {
          const session = this.simpleUser.session;
          this.setupRemoteStreamHandlers(session);

          // Set up session state change listener for incoming calls as well
          session.stateChange.addListener((newState: any) => {
            debugLog(this.config?.debug || false, "Incoming session state changed:", newState);

            switch (newState) {
              case "Terminated":
              case "Ended":
                debugLog(this.config?.debug || false, "Incoming call ended");
                // Stop local media tracks to release camera and microphone
                if (this.localStream) {
                  this.localStream.getTracks().forEach((track) => {
                    try {
                      track.stop();
                      debugLog(this.config?.debug || false, `Stopped local media track on incoming call end: ${track.kind}`);
                    } catch (error) {
                      debugLog(this.config?.debug || false, `Failed to stop track on incoming call end: ${track.kind}`, error);
                    }
                  });
                  this.localStream = null;
                }
                this.videoEnabled = false;
                
                if (this.currentCall) {
                  this.currentCall.state = "ended";
                  this.dispatchEvent(
                    new CustomEvent("callEnded", {
                      detail: { callInfo: this.currentCall },
                    })
                  );
                }
                break;
            }
          });

          // FIXED: Force remote video check for outgoing calls after answer
          setTimeout(() => {
            this.forceRemoteVideoCheck(session);
          }, 500);
        }

        this.dispatchEvent(
          new CustomEvent("callAnswered", {
            detail: { callInfo: this.currentCall },
          })
        );

        this.startCallTimer();
      },

      onCallHangup: () => {
        debugLog(this.config?.debug || false, "Call ended");

        // Stop local media tracks to release camera and microphone
        if (this.localStream) {
          this.localStream.getTracks().forEach((track) => {
            try {
              track.stop();
              debugLog(this.config?.debug || false, `Stopped local media track: ${track.kind}`);
            } catch (error) {
              debugLog(this.config?.debug || false, `Failed to stop track: ${track.kind}`, error);
            }
          });
          this.localStream = null;
        }

        if (this.remoteVideo) {
          this.remoteVideo.srcObject = null;
        }

        if (this.currentCall) {
          this.currentCall.state = "ended";
        }

        this.stopCallTimer();
        this.dispatchEvent(
          new CustomEvent("callEnded", {
            detail: { callInfo: this.currentCall },
          })
        );

        this.currentCall = null;
        this.lastVideoState = false;
        this.videoEnabled = false;
      },

      onCallHold: (held: boolean) => {
        debugLog(this.config?.debug || false, "Call hold state changed", held);
        this.dispatchEvent(
          new CustomEvent("callHold", {
            detail: { held, callInfo: this.currentCall },
          })
        );
      },

      onRegistered: () => {
        this.isRegistered = true;
        debugLog(this.config?.debug || false, "Registration successful");
        this.dispatchEvent(new CustomEvent("registered", { detail: { registered: true } }));
      },

      onUnregistered: () => {
        this.isRegistered = false;
        debugLog(this.config?.debug || false, "Unregistered");
        this.dispatchEvent(new CustomEvent("registered", { detail: { registered: false } }));
      },

      onServerConnect: () => {
        this.isConnected = true;
        debugLog(this.config?.debug || false, "Server connected");
        this.dispatchEvent(new CustomEvent("connected"));
      },

      onServerDisconnect: () => {
        this.isConnected = false;
        this.isRegistered = false;
        debugLog(this.config?.debug || false, "Server disconnected");
        this.dispatchEvent(new CustomEvent("disconnected"));
      },
    };
  }

  private callTimer: number | null = null;

  private startCallTimer(): void {
    this.stopCallTimer();
    this.callTimer = window.setInterval(() => {
      if (this.currentCall && this.currentCall.startTime) {
        this.currentCall.duration = Math.floor((Date.now() - this.currentCall.startTime.getTime()) / 1000);
        this.dispatchEvent(
          new CustomEvent("callTimer", {
            detail: { duration: this.currentCall.duration, callInfo: this.currentCall },
          })
        );
      }
    }, 1000);
  }

  private stopCallTimer(): void {
    if (this.callTimer) {
      clearInterval(this.callTimer);
      this.callTimer = null;
    }
  }

  private startConnectionMonitoring(): void {
    this.connectionTimer = window.setInterval(() => {
      const connected = this.simpleUser?.isConnected() || false;

      if (connected !== this.isConnected) {
        this.isConnected = connected;
        this.dispatchEvent(
          new CustomEvent("heartbeat", {
            detail: {
              connected,
              registered: this.isRegistered,
            },
          })
        );
      }
    }, 5000);
  }

  async makeCall(target: string, includeVideo = true): Promise<void> {
    await this.ensureSipClient();

    if (!this.simpleUser || !this.isRegistered) {
      throw new Error("SIP client not registered");
    }

    if (this.currentCall) {
      throw new Error("Another call is already in progress");
    }

    try {
      const targetUri = `sip:${target}@${this.config!.domain}`;
      debugLog(this.config?.debug || false, "Making VIDEO call to", targetUri, "with video:", includeVideo);

      if (!this.videoEnabled) {
        await this.enableVideo();
      }
      const mediaStream = this.localStream!;

      this.currentCall = {
        id: Date.now().toString(),
        remoteIdentity: target,
        displayName: target,
        state: "outgoing",
        duration: 0,
      };

      const callOptions = {
        sessionDescriptionHandlerOptions: {
          constraints: {
            audio: true,
            video: true,
          },
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,

          iceGatheringTimeout: 10000,
          rtcConfiguration: {
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:stun1.l.google.com:19302" },
              { urls: "stun:stun2.l.google.com:19302" },
              { urls: "stun:stun3.l.google.com:19302" },
            ],
            iceCandidatePoolSize: 10,
            iceTransportPolicy: "all",
            bundlePolicy: "balanced",
            rtcpMuxPolicy: "require",
          },
        },
        sessionDescriptionHandlerFactory: (session: any, options: any) => {
          options.localStream = mediaStream;
          options.remote = {
            audio: this.remoteAudio,
            video: this.remoteVideo,
          };

          return session.sessionDescriptionHandlerFactory(session, options);
        },
      };

      await this.simpleUser.call(targetUri, callOptions);

      // FIXED: Enhanced outgoing call session handling
      if (this.simpleUser.session) {
        const session = this.simpleUser.session;
        debugLog(this.config?.debug || false, "Outgoing call session created, state:", session.state);

        // FIXED: Set up handlers immediately for outgoing calls
        this.setupRemoteStreamHandlers(session);

        // FIXED: Listen for all session state changes
        session.stateChange.addListener((newState: any) => {
          debugLog(this.config?.debug || false, "Outgoing session state changed:", newState);

          switch (newState) {
            case "Establishing":
              debugLog(this.config?.debug || false, "Call is establishing, setting up stream handlers");
              this.setupRemoteStreamHandlers(session);
              break;

            case "Established":
              debugLog(this.config?.debug || false, "Call established, ensuring stream handlers");
              setTimeout(() => {
                this.setupRemoteStreamHandlers(session);
                this.forceRemoteVideoCheck(session);
              }, 100);
              
              // Start the call timer when the call is established
              this.startCallTimer();
              break;

            case "Terminated":
            case "Ended":
              debugLog(this.config?.debug || false, "Outgoing call ended");
              // Stop local media tracks to release camera and microphone
              if (this.localStream) {
                this.localStream.getTracks().forEach((track) => {
                  try {
                    track.stop();
                    debugLog(this.config?.debug || false, `Stopped local media track on outgoing call end: ${track.kind}`);
                  } catch (error) {
                    debugLog(this.config?.debug || false, `Failed to stop track on outgoing call end: ${track.kind}`, error);
                  }
                });
                this.localStream = null;
              }
              this.videoEnabled = false;
              
              if (this.currentCall) {
                this.currentCall.state = "ended";
                this.dispatchEvent(
                  new CustomEvent("callEnded", {
                    detail: { callInfo: this.currentCall },
                  })
                );
              }
              break;
          }
        });

        // FIXED: Also listen for session description handler changes
        const checkForSDH = () => {
          if (session.sessionDescriptionHandler) {
            debugLog(this.config?.debug || false, "Session description handler available for outgoing call");
            this.setupRemoteStreamHandlers(session);
          } else {
            setTimeout(checkForSDH, 100);
          }
        };
        checkForSDH();
      }

      this.dispatchEvent(
        new CustomEvent("callStarted", {
          detail: {
            target,
            callInfo: this.currentCall,
            videoEnabled: true,
          },
        })
      );
    } catch (error) {
      errorLog("Call failed", error);
      
      // Stop local media tracks to release camera and microphone
      if (this.localStream) {
        this.localStream.getTracks().forEach((track) => {
          try {
            track.stop();
            debugLog(this.config?.debug || false, `Stopped local media track on call failure: ${track.kind}`);
          } catch (trackError) {
            debugLog(this.config?.debug || false, `Failed to stop track on call failure: ${track.kind}`, trackError);
          }
        });
        this.localStream = null;
      }
      
      this.currentCall = null;
      this.dispatchEvent(
        new CustomEvent("callFailed", {
          detail: {
            error: error instanceof Error ? error.message : "Call failed",
            target,
          },
        })
      );
      throw error;
    }
  }

  private forceRemoteVideoCheck(session: any): void {
    try {
      if (!session || !session.sessionDescriptionHandler) {
        debugLog(this.config?.debug || false, "No session description handler for video check");
        return;
      }

      const pc = session.sessionDescriptionHandler.peerConnection;
      if (!pc) {
        debugLog(this.config?.debug || false, "No peer connection for video check");
        return;
      }

      debugLog(this.config?.debug || false, "Forcing remote video check, connection state:", pc.connectionState);

      // Check for remote streams
      const remoteStreams = pc.getRemoteStreams ? pc.getRemoteStreams() : [];
      debugLog(this.config?.debug || false, "Remote streams found:", remoteStreams.length);

      if (remoteStreams.length > 0) {
        const remoteStream = remoteStreams[0];
        const videoTracks = remoteStream.getVideoTracks();

        debugLog(this.config?.debug || false, "Found remote stream with video tracks:", videoTracks.length);

        if (videoTracks.length > 0 && this.remoteVideo) {
          this.remoteVideo.srcObject = remoteStream;
          this.remoteVideo.autoplay = true;
          this.remoteVideo.playsInline = true;

          const playPromise = this.remoteVideo.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              debugLog(this.config?.debug || false, "Remote video play failed:", error);
              // Try to handle the error by re-attaching the stream
              if (this.remoteVideo && this.remoteVideo.srcObject) {
                const currentStream = this.remoteVideo.srcObject;
                this.remoteVideo.srcObject = null;
                this.remoteVideo.srcObject = currentStream;
                setTimeout(() => {
                  if (this.remoteVideo && this.remoteVideo.srcObject) {
                    const retryPromise = this.remoteVideo.play();
                    if (retryPromise !== undefined) {
                      retryPromise.catch((retryError) => {
                        debugLog(this.config?.debug || false, "Remote video play retry failed:", retryError);
                      });
                    }
                  }
                }, 100);
              }
            });
          }

          const hasActiveVideo = videoTracks.some((track: any) => track.enabled && track.readyState === "live");

          this.dispatchEvent(
            new CustomEvent("remoteVideoChanged", {
              detail: {
                enabled: true,
                stream: remoteStream,
                hasVideoTracks: hasActiveVideo,
              },
            })
          );
        }
      }

      // Also check transceivers
      const transceivers = pc.getTransceivers();
      debugLog(this.config?.debug || false, "Checking transceivers for outgoing call:", transceivers.length);

      transceivers.forEach((transceiver: RTCRtpTransceiver, index: number) => {
        if (transceiver.receiver?.track?.kind === "video" && transceiver.receiver.track.readyState === "live") {
          debugLog(this.config?.debug || false, `Found active video transceiver ${index} for outgoing call`);

          if (this.remoteVideo && !this.remoteVideo.srcObject) {
            const videoStream = new MediaStream([transceiver.receiver.track]);
            this.remoteVideo.srcObject = videoStream;
            this.remoteVideo.autoplay = true;
            this.remoteVideo.playsInline = true;

            // Handle video play with better error handling
            if (this.remoteVideo.srcObject) {
              const playPromise = this.remoteVideo.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    debugLog(this.config?.debug || false, "Transceiver video playing successfully");
                  })
                  .catch((error) => {
                    debugLog(this.config?.debug || false, "Transceiver video play failed:", error);
                    // Try to handle the error by re-attaching the stream
                    if (this.remoteVideo && this.remoteVideo.srcObject) {
                      const currentStream = this.remoteVideo.srcObject;
                      this.remoteVideo.srcObject = null;
                      this.remoteVideo.srcObject = currentStream;
                      // Add a small delay before retrying to avoid race conditions
                      setTimeout(() => {
                        if (this.remoteVideo && this.remoteVideo.srcObject) {
                          // Check if the video element is in a playable state
                          if (this.remoteVideo.readyState >= 2) { // HAVE_CURRENT_DATA
                            const retryPromise = this.remoteVideo.play();
                            if (retryPromise !== undefined) {
                              retryPromise.catch((retryError) => {
                                debugLog(this.config?.debug || false, "Transceiver video play retry failed:", retryError);
                              });
                            }
                          } else {
                            // If not ready, wait a bit more
                            setTimeout(() => {
                              if (this.remoteVideo && this.remoteVideo.srcObject) {
                                const retryPromise = this.remoteVideo.play();
                                if (retryPromise !== undefined) {
                                  retryPromise.catch((retryError) => {
                                    debugLog(this.config?.debug || false, "Delayed transceiver video play retry failed:", retryError);
                                  });
                                }
                              }
                            }, 200);
                          }
                        }
                      }, 150);
                    }
                  });
              }
            }

            this.dispatchEvent(
              new CustomEvent("remoteVideoChanged", {
                detail: {
                  enabled: true,
                  stream: videoStream,
                  hasVideoTracks: true,
                },
              })
            );
          }
        }
      });
    } catch (error) {
      debugLog(this.config?.debug || false, "Force remote video check failed:", error);
    }
  }

  async answerCall(): Promise<void> {
    await this.ensureSipClient();

    if (!this.simpleUser) {
      throw new Error("SIP client not available");
    }

    const session = this.simpleUser.session;
    if (!session) {
      throw new Error("No session available to answer");
    }

    if (!this.currentCall || this.currentCall.state !== "incoming") {
      throw new Error("No incoming call to answer");
    }

    const sessionState = session.state;
    debugLog(this.config?.debug || false, "Attempting to answer call, session state:", sessionState);

    if (sessionState === "Terminated" || sessionState === "Ended") {
      throw new Error("Call has already ended");
    }

    if (sessionState !== "Initial") {
      throw new Error(`Cannot answer call in state: ${sessionState}`);
    }

    try {
      if (!this.videoEnabled) {
        await this.enableVideo();
      }
      const mediaStream = this.localStream!;

      const answerOptions = {
        sessionDescriptionHandlerOptions: {
          constraints: {
            audio: true,
            video: true,
          },
          rtcConfiguration: {
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:stun1.l.google.com:19302" },
              { urls: "stun:stun2.l.google.com:19302" },
              { urls: "stun:stun3.l.google.com:19302" },
            ],
            iceCandidatePoolSize: 10,
            iceTransportPolicy: "all",
            bundlePolicy: "balanced",
            rtcpMuxPolicy: "require",
          },
        },
        sessionDescriptionHandlerFactory: (session: any, options: any) => {
          options.localStream = mediaStream;
          return session.sessionDescriptionHandlerFactory(session, options);
        },
      };

      await this.simpleUser.answer(answerOptions);
      debugLog(this.config?.debug || false, "Call answered with video:", this.videoEnabled);

      if (this.simpleUser.session) {
        this.setupRemoteStreamHandlers(this.simpleUser.session);
      }
    } catch (error) {
      errorLog("Answer call failed", error);
      // Stop any media tracks that might have been started during the failed attempt
      if (this.localStream) {
        this.localStream.getTracks().forEach((track) => {
          try {
            track.stop();
            debugLog(this.config?.debug || false, `Stopped local media track on answer failure: ${track.kind}`);
          } catch (trackError) {
            debugLog(this.config?.debug || false, `Failed to stop track on answer failure: ${track.kind}`, trackError);
          }
        });
        this.localStream = null;
      }
      throw error;
    }
  }

  async rejectCall(): Promise<void> {
    await this.ensureSipClient();

    if (!this.simpleUser) {
      throw new Error("SIP client not available");
    }

    try {
      await this.simpleUser.decline();

      if (this.currentCall) {
        this.currentCall.state = "ended";
      }

      this.currentCall = null;
      debugLog(this.config?.debug || false, "Call rejected");
    } catch (error) {
      errorLog("Reject call failed", error);
      throw error;
    }
  }

  async hangup(): Promise<void> {
    if (!this.simpleUser) return;

    try {
      await this.simpleUser.hangup();
      debugLog(this.config?.debug || false, "Call hung up");
    } catch (error) {
      errorLog("Hangup failed", error);
      throw error;
    }
  }

  async mute(): Promise<void> {
    if (!this.simpleUser) return;

    try {
      await this.simpleUser.mute();
      debugLog(this.config?.debug || false, "Call muted");
    } catch (error) {
      errorLog("Mute failed", error);
      throw error;
    }
  }

  async unmute(): Promise<void> {
    if (!this.simpleUser) return;

    try {
      await this.simpleUser.unmute();
      debugLog(this.config?.debug || false, "Call unmuted");
    } catch (error) {
      errorLog("Unmute failed", error);
      throw error;
    }
  }

  sendDTMF(tone: string): void {
    if (!this.simpleUser || !this.currentCall) return;

    try {
      if (typeof this.simpleUser.sendDTMF === "function") {
        this.simpleUser.sendDTMF(tone);
        debugLog(this.config?.debug || false, "DTMF sent", tone);

        this.dispatchEvent(
          new CustomEvent("dtmfSent", {
            detail: { tone, callInfo: this.currentCall },
          })
        );
      }
    } catch (error) {
      errorLog("DTMF send failed", error);
    }
  }

  getRemoteVideo(): HTMLVideoElement | null {
    return this.remoteVideo;
  }

  getRemoteAudio(): HTMLAudioElement | null {
    return this.remoteAudio;
  }

  getCurrentCall(): CallInfo | null {
    return this.currentCall;
  }

  getConnectionStatus(): { connected: boolean; registered: boolean; initialized: boolean } {
    return {
      connected: this.isConnected,
      registered: this.isRegistered,
      initialized: this.isInitialized,
    };
  }

  async connect(): Promise<void> {
    await this.ensureSipClient();
  }

  async disconnect(): Promise<void> {
    if (this.connectionTimer) {
      clearInterval(this.connectionTimer);
      this.connectionTimer = null;
    }

    this.stopCallTimer();

    if (this.simpleUser) {
      try {
        if (this.currentCall) {
          await this.hangup();
        }

        if (this.isRegistered) {
          await this.simpleUser.unregister();
        }

        if (this.isConnected) {
          await this.simpleUser.disconnect();
        }
      } catch (error) {
        errorLog("Disconnect error", error);
      }

      this.simpleUser = null;
    }

    try {
      if (this.localStream) {
        this.localStream.getTracks().forEach((track) => track.stop());
        this.localStream = null;
      }

      if (this.localVideo && this.localVideo.parentNode) {
        this.localVideo.pause();
        this.localVideo.srcObject = null;
        this.localVideo.parentNode.removeChild(this.localVideo);
        this.localVideo = null;
      }

      if (this.remoteVideo && this.remoteVideo.parentNode) {
        this.remoteVideo.pause();
        this.remoteVideo.srcObject = null;
        this.remoteVideo.parentNode.removeChild(this.remoteVideo);
        this.remoteVideo = null;
      }

      this.videoEnabled = false;

      if (this.remoteAudio && this.remoteAudio.parentNode) {
        this.remoteAudio.pause();
        this.remoteAudio.srcObject = null;
        this.remoteAudio.parentNode.removeChild(this.remoteAudio);
        this.remoteAudio = null;
      }
    } catch (error) {
      errorLog("Error cleaning up media resources:", error);
    }

    this.isConnected = false;
    this.isRegistered = false;
    this.isInitialized = false;
    this.isInitializing = false;
    this.currentCall = null;

    debugLog(this.config?.debug || false, "SIP client disconnected");
  }
}
