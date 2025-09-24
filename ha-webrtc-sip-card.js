var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import { D as DEFAULT_CONFIG, i, r, C as CARD_VERSION, a as i$1, x, b as DTMF_KEYS, n, t } from "./constants.js";
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e$1 = (e2, t2, c) => (c.configurable = true, c.enumerable = true, Reflect.decorate && "object" != typeof t2 && Object.defineProperty(e2, t2, c), c);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function e(e2, r2) {
  return (n2, s, i2) => {
    const o = (t2) => {
      var _a, _b;
      return (_b = (_a = t2.renderRoot) == null ? void 0 : _a.querySelector(e2)) != null ? _b : null;
    };
    return e$1(n2, s, { get() {
      return o(this);
    } });
  };
}
function mergeConfig(userConfig) {
  return __spreadProps(__spreadValues(__spreadValues({}, DEFAULT_CONFIG), userConfig), {
    contacts: userConfig.contacts || DEFAULT_CONFIG.contacts,
    stun_servers: userConfig.stun_servers || DEFAULT_CONFIG.stun_servers,
    turn_servers: userConfig.turn_servers || DEFAULT_CONFIG.turn_servers
  });
}
function validateConfig(config) {
  if (!config.server_url) {
    throw new Error("server_url is required");
  }
  if (!config.username) {
    throw new Error("username is required");
  }
  if (!config.password) {
    throw new Error("password is required");
  }
  try {
    const url = new URL(config.server_url);
    if (!["ws:", "wss:"].includes(url.protocol)) {
      throw new Error("server_url must use ws:// or wss:// protocol");
    }
  } catch (error) {
    throw new Error("Invalid server_url format");
  }
}
function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
function formatPhoneNumber(number) {
  const cleaned = number.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return number;
}
function playRingtone() {
  try {
    const audio = new Audio();
    audio.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBQ==";
    audio.loop = true;
    const playPromise = audio.play();
    if (playPromise !== void 0) {
      playPromise.catch(() => {
      });
    }
    return audio;
  } catch (error) {
    console.warn("Failed to play ringtone:", error);
    return null;
  }
}
function stopRingtone(audio) {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}
function getContactByExtension(contacts, extension) {
  return contacts.find((contact) => contact.extension === extension);
}
function sanitizeExtension(extension) {
  return extension.replace(/[^\d*#+]/g, "");
}
function debugLog(debug, message, ...args) {
  if (debug) {
    console.log(`[WebRTC SIP Card] ${message}`, ...args);
  }
}
function errorLog(message, error) {
  console.error(`[WebRTC SIP Card] ${message}`, error);
}
let Web = null;
class SipManager extends EventTarget {
  // Flag to prevent multiple simultaneous enableVideo calls
  constructor() {
    super();
    this.simpleUser = null;
    this.config = null;
    this.isRegistered = false;
    this.isConnected = false;
    this.connectionTimer = null;
    this.currentCall = null;
    this.remoteAudio = null;
    this.remoteVideo = null;
    this.localVideo = null;
    this.localStream = null;
    this.videoEnabled = false;
    this.isInitialized = false;
    this.isInitializing = false;
    this.lastVideoState = false;
    this.isEnablingVideo = false;
    this.callTimer = null;
    this.setupMediaElements();
  }
  setupMediaElements() {
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
  async getUserMedia(includeVideo = false) {
    const constraints = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 48e3
      },
      video: includeVideo ? {
        width: { ideal: 640, min: 320, max: 1280 },
        height: { ideal: 480, min: 240, max: 720 },
        frameRate: { ideal: 30, min: 15, max: 30 },
        facingMode: "user"
      } : false
    };
    return navigator.mediaDevices.getUserMedia(constraints);
  }
  async enableVideo() {
    var _a, _b, _c, _d;
    if (this.isEnablingVideo) {
      debugLog(((_a = this.config) == null ? void 0 : _a.debug) || false, "Video is already being enabled, ignoring duplicate request");
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
      debugLog(((_b = this.config) == null ? void 0 : _b.debug) || false, "Local video enabled with new stream:", {
        videoTracks: stream.getVideoTracks().length,
        audioTracks: stream.getAudioTracks().length,
        streamId: stream.id
      });
      if (((_c = this.simpleUser) == null ? void 0 : _c.session) && ((_d = this.currentCall) == null ? void 0 : _d.state) === "connected") {
        await this.replaceMediaTracks(stream);
      }
      this.dispatchEvent(
        new CustomEvent("localVideoChanged", {
          detail: {
            enabled: true,
            transmitting: stream.getVideoTracks().some((track) => track.enabled && track.readyState === "live")
          }
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
  async disableVideo() {
    var _a, _b, _c;
    try {
      const audioOnlyStream = await this.getUserMedia(false);
      if (this.localVideo) {
        this.localVideo.srcObject = null;
      }
      if (this.localStream) {
        this.localStream.getTracks().forEach((track) => {
          var _a2;
          track.stop();
          debugLog(((_a2 = this.config) == null ? void 0 : _a2.debug) || false, `Stopped ${track.kind} track:`, track.id);
        });
      }
      this.localStream = audioOnlyStream;
      this.videoEnabled = false;
      debugLog(((_a = this.config) == null ? void 0 : _a.debug) || false, "Local video disabled, using audio-only stream:", {
        videoTracks: audioOnlyStream.getVideoTracks().length,
        audioTracks: audioOnlyStream.getAudioTracks().length,
        streamId: audioOnlyStream.id
      });
      if (((_b = this.simpleUser) == null ? void 0 : _b.session) && ((_c = this.currentCall) == null ? void 0 : _c.state) === "connected") {
        await this.replaceMediaTracks(audioOnlyStream);
      }
      this.dispatchEvent(
        new CustomEvent("localVideoChanged", {
          detail: {
            enabled: false,
            transmitting: false
          }
        })
      );
    } catch (error) {
      errorLog("Disable video failed", error);
      throw error;
    }
  }
  async replaceMediaTracks(newStream) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    try {
      const session = (_a = this.simpleUser) == null ? void 0 : _a.session;
      if (!session || !session.sessionDescriptionHandler) {
        debugLog(((_b = this.config) == null ? void 0 : _b.debug) || false, "No active session to replace tracks");
        return;
      }
      const pc = session.sessionDescriptionHandler.peerConnection;
      if (!pc) {
        debugLog(((_c = this.config) == null ? void 0 : _c.debug) || false, "No peer connection found");
        return;
      }
      const senders = pc.getSenders();
      const audioTrack = newStream.getAudioTracks()[0];
      const audioSender = senders.find((sender) => sender.track && sender.track.kind === "audio");
      if (audioSender && audioTrack) {
        await audioSender.replaceTrack(audioTrack);
        debugLog(((_d = this.config) == null ? void 0 : _d.debug) || false, "Audio track replaced successfully");
      }
      const videoTrack = newStream.getVideoTracks()[0] || null;
      const videoSender = senders.find((sender) => sender.track && sender.track.kind === "video");
      if (videoSender) {
        await videoSender.replaceTrack(videoTrack);
        debugLog(((_e = this.config) == null ? void 0 : _e.debug) || false, videoTrack ? "Video track replaced" : "Video track removed from sender");
      } else if (videoTrack) {
        try {
          pc.addTrack(videoTrack, newStream);
          debugLog(((_f = this.config) == null ? void 0 : _f.debug) || false, "Video track added to peer connection");
          if (session.sessionDescriptionHandler && typeof session.sessionDescriptionHandler.sendReinvite === "function") {
            await session.sessionDescriptionHandler.sendReinvite();
            debugLog(((_g = this.config) == null ? void 0 : _g.debug) || false, "Session renegotiated for new video track");
          }
        } catch (error) {
          debugLog(((_h = this.config) == null ? void 0 : _h.debug) || false, "Failed to add video track:", error);
        }
      }
    } catch (error) {
      debugLog(((_i = this.config) == null ? void 0 : _i.debug) || false, "Replace media tracks failed but call continues:", error);
    }
  }
  async toggleVideo() {
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
  getLocalVideoState() {
    return {
      enabled: this.videoEnabled,
      transmitting: this.localStream ? this.localStream.getVideoTracks().some((track) => track.enabled && track.readyState === "live") : false
    };
  }
  setupRemoteStreamHandlers(session) {
    var _a, _b, _c;
    try {
      const sessionDescriptionHandler = session.sessionDescriptionHandler;
      if (!sessionDescriptionHandler) {
        debugLog(((_a = this.config) == null ? void 0 : _a.debug) || false, "No session description handler");
        return;
      }
      const pc = sessionDescriptionHandler.peerConnection;
      if (!pc) {
        debugLog(((_b = this.config) == null ? void 0 : _b.debug) || false, "No peer connection");
        return;
      }
      debugLog(((_c = this.config) == null ? void 0 : _c.debug) || false, "Setting up remote stream handlers for", pc.connectionState);
      pc.ontrack = (event) => {
        var _a2, _b2, _c2, _d, _e;
        debugLog(((_a2 = this.config) == null ? void 0 : _a2.debug) || false, "Remote track received:", {
          kind: event.track.kind,
          readyState: event.track.readyState,
          enabled: event.track.enabled,
          streams: event.streams.length,
          transceiver: event.transceiver.direction
        });
        const stream = event.streams[0];
        if (!stream) {
          debugLog(((_b2 = this.config) == null ? void 0 : _b2.debug) || false, "No stream in track event");
          return;
        }
        if (event.track.kind === "audio") {
          if (this.remoteAudio) {
            this.remoteAudio.srcObject = stream;
            debugLog(((_c2 = this.config) == null ? void 0 : _c2.debug) || false, "Remote audio stream attached");
          }
        } else if (event.track.kind === "video") {
          if (this.remoteVideo) {
            this.remoteVideo.srcObject = stream;
            this.remoteVideo.autoplay = true;
            this.remoteVideo.playsInline = true;
            debugLog(((_d = this.config) == null ? void 0 : _d.debug) || false, "Remote video stream attached, playing...");
            if (this.remoteVideo.srcObject) {
              const playPromise = this.remoteVideo.play();
              if (playPromise !== void 0) {
                playPromise.then(() => {
                  var _a3;
                  debugLog(((_a3 = this.config) == null ? void 0 : _a3.debug) || false, "Remote video playing successfully");
                }).catch((error) => {
                  var _a3, _b3, _c3;
                  debugLog(((_a3 = this.config) == null ? void 0 : _a3.debug) || false, "Remote video play failed:", error);
                  if (error.name === "NotAllowedError") {
                    debugLog(((_b3 = this.config) == null ? void 0 : _b3.debug) || false, "Video play not allowed, likely due to autoplay restrictions");
                    if (this.remoteVideo) {
                      this.remoteVideo.muted = true;
                      const retryPromise = this.remoteVideo.play();
                      if (retryPromise !== void 0) {
                        retryPromise.catch((retryError) => {
                          var _a4;
                          debugLog(((_a4 = this.config) == null ? void 0 : _a4.debug) || false, "Muted video play retry failed:", retryError);
                          if (this.remoteVideo && this.remoteVideo.srcObject) {
                            const currentStream = this.remoteVideo.srcObject;
                            this.remoteVideo.srcObject = null;
                            this.remoteVideo.srcObject = currentStream;
                            setTimeout(() => {
                              if (this.remoteVideo && this.remoteVideo.srcObject) {
                                this.remoteVideo.muted = true;
                                const finalPromise = this.remoteVideo.play();
                                if (finalPromise !== void 0) {
                                  finalPromise.catch((finalError) => {
                                    var _a5;
                                    debugLog(((_a5 = this.config) == null ? void 0 : _a5.debug) || false, "Final video play attempt failed:", finalError);
                                  });
                                }
                              }
                            }, 100);
                          }
                        });
                      }
                    }
                  } else if (error.name === "AbortError") {
                    debugLog(((_c3 = this.config) == null ? void 0 : _c3.debug) || false, "Video play was interrupted, this is normal during stream updates");
                    setTimeout(() => {
                      if (this.remoteVideo && this.remoteVideo.srcObject) {
                        if (this.remoteVideo.readyState >= 2) {
                          const retryPromise = this.remoteVideo.play();
                          if (retryPromise !== void 0) {
                            retryPromise.catch((retryError) => {
                              var _a4;
                              debugLog(((_a4 = this.config) == null ? void 0 : _a4.debug) || false, "Video play retry failed:", retryError);
                            });
                          }
                        } else {
                          setTimeout(() => {
                            if (this.remoteVideo && this.remoteVideo.srcObject) {
                              const retryPromise = this.remoteVideo.play();
                              if (retryPromise !== void 0) {
                                retryPromise.catch((retryError) => {
                                  var _a4;
                                  debugLog(((_a4 = this.config) == null ? void 0 : _a4.debug) || false, "Delayed video play retry failed:", retryError);
                                });
                              }
                            }
                          }, 200);
                        }
                      }
                    }, 150);
                  } else {
                    if (this.remoteVideo && this.remoteVideo.srcObject) {
                      const currentStream = this.remoteVideo.srcObject;
                      this.remoteVideo.srcObject = null;
                      this.remoteVideo.srcObject = currentStream;
                      setTimeout(() => {
                        if (this.remoteVideo && this.remoteVideo.srcObject) {
                          const retryPromise = this.remoteVideo.play();
                          if (retryPromise !== void 0) {
                            retryPromise.catch((retryError) => {
                              var _a4;
                              debugLog(((_a4 = this.config) == null ? void 0 : _a4.debug) || false, "Remote video play retry failed:", retryError);
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
            debugLog(((_e = this.config) == null ? void 0 : _e.debug) || false, "Video track details:", {
              trackCount: videoTracks.length,
              hasActive: hasActiveVideo,
              trackStates: videoTracks.map((t2) => ({
                id: t2.id,
                enabled: t2.enabled,
                readyState: t2.readyState,
                label: t2.label
              }))
            });
            this.lastVideoState = hasActiveVideo;
            this.dispatchEvent(
              new CustomEvent("remoteVideoChanged", {
                detail: {
                  enabled: true,
                  stream,
                  hasVideoTracks: hasActiveVideo
                }
              })
            );
            setTimeout(() => {
              this.dispatchEvent(
                new CustomEvent("remoteVideoChanged", {
                  detail: {
                    enabled: true,
                    stream,
                    hasVideoTracks: hasActiveVideo
                  }
                })
              );
            }, 200);
          }
        }
      };
      pc.oniceconnectionstatechange = () => {
        var _a2;
        debugLog(((_a2 = this.config) == null ? void 0 : _a2.debug) || false, "ICE connection state changed:", pc.iceConnectionState);
        if (pc.iceConnectionState === "failed") {
          errorLog("ICE connection failed - attempting to recover");
          this.handleIceConnectionFailure(pc);
        }
      };
      pc.onicegatheringstatechange = () => {
        var _a2;
        debugLog(((_a2 = this.config) == null ? void 0 : _a2.debug) || false, "ICE gathering state changed:", pc.iceGatheringState);
      };
      pc.onicecandidate = (event) => {
        var _a2, _b2;
        if (event.candidate) {
          debugLog(((_a2 = this.config) == null ? void 0 : _a2.debug) || false, "ICE candidate:", event.candidate.type, event.candidate.candidate);
        } else {
          debugLog(((_b2 = this.config) == null ? void 0 : _b2.debug) || false, "ICE gathering complete");
        }
      };
      pc.onconnectionstatechange = () => {
        var _a2;
        debugLog(((_a2 = this.config) == null ? void 0 : _a2.debug) || false, "Connection state changed:", pc.connectionState);
        if (pc.connectionState === "failed") {
          errorLog("Peer connection failed completely");
          this.handleConnectionFailure();
        } else if (pc.connectionState === "connected") {
          setTimeout(() => {
            var _a3;
            const transceivers = pc.getTransceivers();
            debugLog(((_a3 = this.config) == null ? void 0 : _a3.debug) || false, "Checking transceivers:", transceivers.length);
            transceivers.forEach((transceiver, index) => {
              var _a4, _b2, _c2, _d, _e, _f, _g, _h, _i, _j;
              debugLog(((_a4 = this.config) == null ? void 0 : _a4.debug) || false, `Transceiver ${index}:`, {
                direction: transceiver.direction,
                kind: (_c2 = (_b2 = transceiver.receiver) == null ? void 0 : _b2.track) == null ? void 0 : _c2.kind,
                trackState: (_e = (_d = transceiver.receiver) == null ? void 0 : _d.track) == null ? void 0 : _e.readyState,
                hasTrack: !!((_f = transceiver.receiver) == null ? void 0 : _f.track)
              });
              if (((_h = (_g = transceiver.receiver) == null ? void 0 : _g.track) == null ? void 0 : _h.kind) === "video" && transceiver.receiver.track.readyState === "live") {
                debugLog(((_i = this.config) == null ? void 0 : _i.debug) || false, "Found active video transceiver");
                let videoStream;
                if (((_j = this.remoteVideo) == null ? void 0 : _j.srcObject) instanceof MediaStream) {
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
                      hasVideoTracks: true
                    }
                  })
                );
              }
            });
          }, 500);
        }
      };
      pc.onremovetrack = (event) => {
        var _a2;
        debugLog(((_a2 = this.config) == null ? void 0 : _a2.debug) || false, "Remote track removed:", event.track.kind);
        if (event.track.kind === "video" && this.remoteVideo) {
          this.remoteVideo.srcObject = null;
          this.lastVideoState = false;
          this.dispatchEvent(
            new CustomEvent("remoteVideoChanged", {
              detail: {
                enabled: false,
                stream: null,
                hasVideoTracks: false
              }
            })
          );
        }
      };
    } catch (error) {
      errorLog("Failed to setup remote stream handlers:", error);
    }
  }
  handleIceConnectionFailure(pc) {
    var _a;
    debugLog(((_a = this.config) == null ? void 0 : _a.debug) || false, "Attempting ICE restart");
    setTimeout(() => {
      var _a2;
      if (pc.iceConnectionState === "failed") {
        try {
          pc.restartIce();
          debugLog(((_a2 = this.config) == null ? void 0 : _a2.debug) || false, "ICE restart initiated");
        } catch (error) {
          errorLog("ICE restart failed:", error);
        }
      }
    }, 1e3);
  }
  handleConnectionFailure() {
    errorLog("Connection failed - notifying UI");
    this.dispatchEvent(
      new CustomEvent("error", {
        detail: {
          error: "Connection failed - check network and STUN servers",
          type: "connection_failure"
        }
      })
    );
  }
  async waitForSipLibrary(timeout = 15e3) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const timeoutId = setTimeout(() => {
        reject(new Error(`SIP.js library loading timeout after ${timeout}ms`));
      }, timeout);
      const continueCheck = () => {
        var _a;
        try {
          const isFullyLoaded = Web && Web.SimpleUser && Web.SimpleUser.prototype && typeof Web.SimpleUser.prototype.register === "function" && typeof Web.SimpleUser.prototype.connect === "function" && typeof Web.SimpleUser.prototype.disconnect === "function";
          if (isFullyLoaded) {
            clearTimeout(timeoutId);
            debugLog(((_a = this.config) == null ? void 0 : _a.debug) || false, "SIP.js library fully loaded and verified");
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
      const checkLibrary = () => {
        if (!Web) {
          import("./index.js").then((SIP) => {
            Web = SIP.Web || SIP;
            continueCheck();
          }).catch(() => {
            setTimeout(checkLibrary, 200);
          });
        } else {
          continueCheck();
        }
      };
      checkLibrary();
    });
  }
  async ensureSipClient() {
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
  setConfig(config) {
    this.config = config;
    debugLog(config.debug || false, "SIP configuration set, will initialize on first use");
  }
  async initialize(config) {
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
      const getMediaOptions = (includeVideo = false) => ({
        constraints: includeVideo ? {
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          },
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            frameRate: { ideal: 30 }
          }
        } : {
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          },
          video: false
        },
        remote: {
          audio: this.remoteAudio,
          video: this.remoteVideo
        }
      });
      const options = {
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
            reconnectionTimeout: 4
          },
          logLevel: config.debug ? "debug" : "error",
          sessionDescriptionHandlerFactoryOptions: {
            constraints: {
              audio: true,
              video: false
            },
            peerConnectionConfiguration: {
              iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:stun1.l.google.com:19302" },
                { urls: "stun:stun2.l.google.com:19302" },
                { urls: "stun:stun3.l.google.com:19302" }
              ],
              iceCandidatePoolSize: 10,
              iceTransportPolicy: "all",
              bundlePolicy: "balanced",
              rtcpMuxPolicy: "require"
            }
          }
        }
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
            type: "initialization"
          }
        })
      );
      throw new Error(`Failed to initialize SIP client: ${errorMessage}`);
    }
  }
  setupEventHandlers() {
    var _a;
    if (!this.simpleUser) {
      errorLog("Cannot setup event handlers: SimpleUser is null");
      return;
    }
    debugLog(((_a = this.config) == null ? void 0 : _a.debug) || false, "Setting up event handlers");
    this.simpleUser.delegate = {
      onCallCreated: () => {
        var _a2;
        debugLog(((_a2 = this.config) == null ? void 0 : _a2.debug) || false, "Call created");
        this.dispatchEvent(new CustomEvent("callCreated"));
      },
      onCallReceived: () => {
        var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
        debugLog(((_a2 = this.config) == null ? void 0 : _a2.debug) || false, "Incoming call received");
        const session = (_b = this.simpleUser) == null ? void 0 : _b.session;
        if (!session) {
          debugLog(((_c = this.config) == null ? void 0 : _c.debug) || false, "No session found for incoming call");
          return;
        }
        let remoteIdentity = "unknown";
        let displayName = "Unknown Caller";
        try {
          debugLog(((_d = this.config) == null ? void 0 : _d.debug) || false, "Current session state:", session.state);
          this.setupRemoteStreamHandlers(session);
          if (session.request) {
            const fromHeader = session.request.getHeader("From");
            debugLog(((_e = this.config) == null ? void 0 : _e.debug) || false, "From header:", fromHeader);
            if (fromHeader) {
              const uriMatches = fromHeader.match(/<sip:([^@]+)@/) || fromHeader.match(/sip:([^@]+)@/);
              if (uriMatches && uriMatches[1]) {
                remoteIdentity = uriMatches[1];
                debugLog(((_f = this.config) == null ? void 0 : _f.debug) || false, "Extracted extension from From:", remoteIdentity);
              }
              const nameMatches = fromHeader.match(/^"([^"]*)"/) || fromHeader.match(/^([^<]*)</);
              if (nameMatches && nameMatches[1] && nameMatches[1].trim()) {
                displayName = nameMatches[1].trim();
                debugLog(((_g = this.config) == null ? void 0 : _g.debug) || false, "Extracted display name:", displayName);
              } else if (remoteIdentity !== "unknown") {
                displayName = remoteIdentity;
              }
            }
          }
          if (remoteIdentity === "unknown" && session.remoteIdentity) {
            debugLog(((_h = this.config) == null ? void 0 : _h.debug) || false, "Trying session.remoteIdentity:", session.remoteIdentity);
            if (session.remoteIdentity.uri) {
              const uriString = session.remoteIdentity.uri.toString();
              debugLog(((_i = this.config) == null ? void 0 : _i.debug) || false, "Remote URI:", uriString);
              const matches = uriString.match(/sip:([^@]+)@/);
              if (matches && matches[1]) {
                remoteIdentity = matches[1];
                debugLog(((_j = this.config) == null ? void 0 : _j.debug) || false, "Extracted from remote URI:", remoteIdentity);
              }
            }
            if (session.remoteIdentity.displayName) {
              displayName = session.remoteIdentity.displayName;
              debugLog(((_k = this.config) == null ? void 0 : _k.debug) || false, "Remote display name:", displayName);
            } else if (remoteIdentity !== "unknown") {
              displayName = remoteIdentity;
            }
          }
        } catch (error) {
          debugLog(((_l = this.config) == null ? void 0 : _l.debug) || false, "Error parsing caller info:", error);
        }
        debugLog(((_m = this.config) == null ? void 0 : _m.debug) || false, "Final parsed caller info:", { remoteIdentity, displayName });
        this.currentCall = {
          id: Date.now().toString(),
          remoteIdentity,
          displayName,
          state: "incoming",
          duration: 0
        };
        this.dispatchEvent(
          new CustomEvent("incomingCall", {
            detail: {
              from: remoteIdentity,
              displayName,
              callInfo: this.currentCall
            }
          })
        );
      },
      onCallAnswered: () => {
        var _a2, _b;
        if (this.currentCall) {
          this.currentCall.state = "connected";
          this.currentCall.startTime = /* @__PURE__ */ new Date();
        }
        debugLog(((_a2 = this.config) == null ? void 0 : _a2.debug) || false, "Call answered");
        if ((_b = this.simpleUser) == null ? void 0 : _b.session) {
          const session = this.simpleUser.session;
          this.setupRemoteStreamHandlers(session);
          session.stateChange.addListener((newState) => {
            var _a3, _b2;
            debugLog(((_a3 = this.config) == null ? void 0 : _a3.debug) || false, "Incoming session state changed:", newState);
            switch (newState) {
              case "Terminated":
              case "Ended":
                debugLog(((_b2 = this.config) == null ? void 0 : _b2.debug) || false, "Incoming call ended");
                if (this.localStream) {
                  this.localStream.getTracks().forEach((track) => {
                    var _a4, _b3;
                    try {
                      track.stop();
                      debugLog(((_a4 = this.config) == null ? void 0 : _a4.debug) || false, `Stopped local media track on incoming call end: ${track.kind}`);
                    } catch (error) {
                      debugLog(((_b3 = this.config) == null ? void 0 : _b3.debug) || false, `Failed to stop track on incoming call end: ${track.kind}`, error);
                    }
                  });
                  this.localStream = null;
                }
                this.videoEnabled = false;
                if (this.currentCall) {
                  this.currentCall.state = "ended";
                  this.dispatchEvent(
                    new CustomEvent("callEnded", {
                      detail: { callInfo: this.currentCall }
                    })
                  );
                }
                break;
            }
          });
          setTimeout(() => {
            this.forceRemoteVideoCheck(session);
          }, 500);
        }
        this.dispatchEvent(
          new CustomEvent("callAnswered", {
            detail: { callInfo: this.currentCall }
          })
        );
        this.startCallTimer();
      },
      onCallHangup: () => {
        var _a2;
        debugLog(((_a2 = this.config) == null ? void 0 : _a2.debug) || false, "Call ended");
        if (this.localStream) {
          this.localStream.getTracks().forEach((track) => {
            var _a3, _b;
            try {
              track.stop();
              debugLog(((_a3 = this.config) == null ? void 0 : _a3.debug) || false, `Stopped local media track: ${track.kind}`);
            } catch (error) {
              debugLog(((_b = this.config) == null ? void 0 : _b.debug) || false, `Failed to stop track: ${track.kind}`, error);
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
            detail: { callInfo: this.currentCall }
          })
        );
        this.currentCall = null;
        this.lastVideoState = false;
        this.videoEnabled = false;
      },
      onCallHold: (held) => {
        var _a2;
        debugLog(((_a2 = this.config) == null ? void 0 : _a2.debug) || false, "Call hold state changed", held);
        this.dispatchEvent(
          new CustomEvent("callHold", {
            detail: { held, callInfo: this.currentCall }
          })
        );
      },
      onRegistered: () => {
        var _a2;
        this.isRegistered = true;
        debugLog(((_a2 = this.config) == null ? void 0 : _a2.debug) || false, "Registration successful");
        this.dispatchEvent(new CustomEvent("registered", { detail: { registered: true } }));
      },
      onUnregistered: () => {
        var _a2;
        this.isRegistered = false;
        debugLog(((_a2 = this.config) == null ? void 0 : _a2.debug) || false, "Unregistered");
        this.dispatchEvent(new CustomEvent("registered", { detail: { registered: false } }));
      },
      onServerConnect: () => {
        var _a2;
        this.isConnected = true;
        debugLog(((_a2 = this.config) == null ? void 0 : _a2.debug) || false, "Server connected");
        this.dispatchEvent(new CustomEvent("connected"));
      },
      onServerDisconnect: () => {
        var _a2;
        this.isConnected = false;
        this.isRegistered = false;
        debugLog(((_a2 = this.config) == null ? void 0 : _a2.debug) || false, "Server disconnected");
        this.dispatchEvent(new CustomEvent("disconnected"));
      }
    };
  }
  startCallTimer() {
    this.stopCallTimer();
    this.callTimer = window.setInterval(() => {
      if (this.currentCall && this.currentCall.startTime) {
        this.currentCall.duration = Math.floor((Date.now() - this.currentCall.startTime.getTime()) / 1e3);
        this.dispatchEvent(
          new CustomEvent("callTimer", {
            detail: { duration: this.currentCall.duration, callInfo: this.currentCall }
          })
        );
      }
    }, 1e3);
  }
  stopCallTimer() {
    if (this.callTimer) {
      clearInterval(this.callTimer);
      this.callTimer = null;
    }
  }
  startConnectionMonitoring() {
    this.connectionTimer = window.setInterval(() => {
      var _a;
      const connected = ((_a = this.simpleUser) == null ? void 0 : _a.isConnected()) || false;
      if (connected !== this.isConnected) {
        this.isConnected = connected;
        this.dispatchEvent(
          new CustomEvent("heartbeat", {
            detail: {
              connected,
              registered: this.isRegistered
            }
          })
        );
      }
    }, 5e3);
  }
  async makeCall(target, includeVideo = true) {
    var _a, _b;
    await this.ensureSipClient();
    if (!this.simpleUser || !this.isRegistered) {
      throw new Error("SIP client not registered");
    }
    if (this.currentCall) {
      throw new Error("Another call is already in progress");
    }
    try {
      const targetUri = `sip:${target}@${this.config.domain}`;
      debugLog(((_a = this.config) == null ? void 0 : _a.debug) || false, "Making VIDEO call to", targetUri, "with video:", includeVideo);
      if (!this.videoEnabled) {
        await this.enableVideo();
      }
      const mediaStream = this.localStream;
      this.currentCall = {
        id: Date.now().toString(),
        remoteIdentity: target,
        displayName: target,
        state: "outgoing",
        duration: 0
      };
      const callOptions = {
        sessionDescriptionHandlerOptions: {
          constraints: {
            audio: true,
            video: true
          },
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
          iceGatheringTimeout: 1e4,
          rtcConfiguration: {
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:stun1.l.google.com:19302" },
              { urls: "stun:stun2.l.google.com:19302" },
              { urls: "stun:stun3.l.google.com:19302" }
            ],
            iceCandidatePoolSize: 10,
            iceTransportPolicy: "all",
            bundlePolicy: "balanced",
            rtcpMuxPolicy: "require"
          }
        },
        sessionDescriptionHandlerFactory: (session, options) => {
          options.localStream = mediaStream;
          options.remote = {
            audio: this.remoteAudio,
            video: this.remoteVideo
          };
          return session.sessionDescriptionHandlerFactory(session, options);
        }
      };
      await this.simpleUser.call(targetUri, callOptions);
      if (this.simpleUser.session) {
        const session = this.simpleUser.session;
        debugLog(((_b = this.config) == null ? void 0 : _b.debug) || false, "Outgoing call session created, state:", session.state);
        this.setupRemoteStreamHandlers(session);
        session.stateChange.addListener((newState) => {
          var _a2, _b2, _c, _d;
          debugLog(((_a2 = this.config) == null ? void 0 : _a2.debug) || false, "Outgoing session state changed:", newState);
          switch (newState) {
            case "Establishing":
              debugLog(((_b2 = this.config) == null ? void 0 : _b2.debug) || false, "Call is establishing, setting up stream handlers");
              this.setupRemoteStreamHandlers(session);
              break;
            case "Established":
              debugLog(((_c = this.config) == null ? void 0 : _c.debug) || false, "Call established, ensuring stream handlers");
              setTimeout(() => {
                this.setupRemoteStreamHandlers(session);
                this.forceRemoteVideoCheck(session);
              }, 100);
              this.startCallTimer();
              break;
            case "Terminated":
            case "Ended":
              debugLog(((_d = this.config) == null ? void 0 : _d.debug) || false, "Outgoing call ended");
              if (this.localStream) {
                this.localStream.getTracks().forEach((track) => {
                  var _a3, _b3;
                  try {
                    track.stop();
                    debugLog(((_a3 = this.config) == null ? void 0 : _a3.debug) || false, `Stopped local media track on outgoing call end: ${track.kind}`);
                  } catch (error) {
                    debugLog(((_b3 = this.config) == null ? void 0 : _b3.debug) || false, `Failed to stop track on outgoing call end: ${track.kind}`, error);
                  }
                });
                this.localStream = null;
              }
              this.videoEnabled = false;
              if (this.currentCall) {
                this.currentCall.state = "ended";
                this.dispatchEvent(
                  new CustomEvent("callEnded", {
                    detail: { callInfo: this.currentCall }
                  })
                );
              }
              break;
          }
        });
        const checkForSDH = () => {
          var _a2;
          if (session.sessionDescriptionHandler) {
            debugLog(((_a2 = this.config) == null ? void 0 : _a2.debug) || false, "Session description handler available for outgoing call");
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
            videoEnabled: true
          }
        })
      );
    } catch (error) {
      errorLog("Call failed", error);
      if (this.localStream) {
        this.localStream.getTracks().forEach((track) => {
          var _a2, _b2;
          try {
            track.stop();
            debugLog(((_a2 = this.config) == null ? void 0 : _a2.debug) || false, `Stopped local media track on call failure: ${track.kind}`);
          } catch (trackError) {
            debugLog(((_b2 = this.config) == null ? void 0 : _b2.debug) || false, `Failed to stop track on call failure: ${track.kind}`, trackError);
          }
        });
        this.localStream = null;
      }
      this.currentCall = null;
      this.dispatchEvent(
        new CustomEvent("callFailed", {
          detail: {
            error: error instanceof Error ? error.message : "Call failed",
            target
          }
        })
      );
      throw error;
    }
  }
  forceRemoteVideoCheck(session) {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
      if (!session || !session.sessionDescriptionHandler) {
        debugLog(((_a = this.config) == null ? void 0 : _a.debug) || false, "No session description handler for video check");
        return;
      }
      const pc = session.sessionDescriptionHandler.peerConnection;
      if (!pc) {
        debugLog(((_b = this.config) == null ? void 0 : _b.debug) || false, "No peer connection for video check");
        return;
      }
      debugLog(((_c = this.config) == null ? void 0 : _c.debug) || false, "Forcing remote video check, connection state:", pc.connectionState);
      const remoteStreams = pc.getRemoteStreams ? pc.getRemoteStreams() : [];
      debugLog(((_d = this.config) == null ? void 0 : _d.debug) || false, "Remote streams found:", remoteStreams.length);
      if (remoteStreams.length > 0) {
        const remoteStream = remoteStreams[0];
        const videoTracks = remoteStream.getVideoTracks();
        debugLog(((_e = this.config) == null ? void 0 : _e.debug) || false, "Found remote stream with video tracks:", videoTracks.length);
        if (videoTracks.length > 0 && this.remoteVideo) {
          this.remoteVideo.srcObject = remoteStream;
          this.remoteVideo.autoplay = true;
          this.remoteVideo.playsInline = true;
          const playPromise = this.remoteVideo.play();
          if (playPromise !== void 0) {
            playPromise.catch((error) => {
              var _a2;
              debugLog(((_a2 = this.config) == null ? void 0 : _a2.debug) || false, "Remote video play failed:", error);
              if (this.remoteVideo && this.remoteVideo.srcObject) {
                const currentStream = this.remoteVideo.srcObject;
                this.remoteVideo.srcObject = null;
                this.remoteVideo.srcObject = currentStream;
                setTimeout(() => {
                  if (this.remoteVideo && this.remoteVideo.srcObject) {
                    const retryPromise = this.remoteVideo.play();
                    if (retryPromise !== void 0) {
                      retryPromise.catch((retryError) => {
                        var _a3;
                        debugLog(((_a3 = this.config) == null ? void 0 : _a3.debug) || false, "Remote video play retry failed:", retryError);
                      });
                    }
                  }
                }, 100);
              }
            });
          }
          const hasActiveVideo = videoTracks.some((track) => track.enabled && track.readyState === "live");
          this.dispatchEvent(
            new CustomEvent("remoteVideoChanged", {
              detail: {
                enabled: true,
                stream: remoteStream,
                hasVideoTracks: hasActiveVideo
              }
            })
          );
        }
      }
      const transceivers = pc.getTransceivers();
      debugLog(((_f = this.config) == null ? void 0 : _f.debug) || false, "Checking transceivers for outgoing call:", transceivers.length);
      transceivers.forEach((transceiver, index) => {
        var _a2, _b2, _c2;
        if (((_b2 = (_a2 = transceiver.receiver) == null ? void 0 : _a2.track) == null ? void 0 : _b2.kind) === "video" && transceiver.receiver.track.readyState === "live") {
          debugLog(((_c2 = this.config) == null ? void 0 : _c2.debug) || false, `Found active video transceiver ${index} for outgoing call`);
          if (this.remoteVideo && !this.remoteVideo.srcObject) {
            const videoStream = new MediaStream([transceiver.receiver.track]);
            this.remoteVideo.srcObject = videoStream;
            this.remoteVideo.autoplay = true;
            this.remoteVideo.playsInline = true;
            if (this.remoteVideo.srcObject) {
              const playPromise = this.remoteVideo.play();
              if (playPromise !== void 0) {
                playPromise.then(() => {
                  var _a3;
                  debugLog(((_a3 = this.config) == null ? void 0 : _a3.debug) || false, "Transceiver video playing successfully");
                }).catch((error) => {
                  var _a3;
                  debugLog(((_a3 = this.config) == null ? void 0 : _a3.debug) || false, "Transceiver video play failed:", error);
                  if (this.remoteVideo && this.remoteVideo.srcObject) {
                    const currentStream = this.remoteVideo.srcObject;
                    this.remoteVideo.srcObject = null;
                    this.remoteVideo.srcObject = currentStream;
                    setTimeout(() => {
                      if (this.remoteVideo && this.remoteVideo.srcObject) {
                        if (this.remoteVideo.readyState >= 2) {
                          const retryPromise = this.remoteVideo.play();
                          if (retryPromise !== void 0) {
                            retryPromise.catch((retryError) => {
                              var _a4;
                              debugLog(((_a4 = this.config) == null ? void 0 : _a4.debug) || false, "Transceiver video play retry failed:", retryError);
                            });
                          }
                        } else {
                          setTimeout(() => {
                            if (this.remoteVideo && this.remoteVideo.srcObject) {
                              const retryPromise = this.remoteVideo.play();
                              if (retryPromise !== void 0) {
                                retryPromise.catch((retryError) => {
                                  var _a4;
                                  debugLog(((_a4 = this.config) == null ? void 0 : _a4.debug) || false, "Delayed transceiver video play retry failed:", retryError);
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
                  hasVideoTracks: true
                }
              })
            );
          }
        }
      });
    } catch (error) {
      debugLog(((_g = this.config) == null ? void 0 : _g.debug) || false, "Force remote video check failed:", error);
    }
  }
  async answerCall() {
    var _a, _b;
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
    debugLog(((_a = this.config) == null ? void 0 : _a.debug) || false, "Attempting to answer call, session state:", sessionState);
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
      const mediaStream = this.localStream;
      const answerOptions = {
        sessionDescriptionHandlerOptions: {
          constraints: {
            audio: true,
            video: true
          },
          rtcConfiguration: {
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:stun1.l.google.com:19302" },
              { urls: "stun:stun2.l.google.com:19302" },
              { urls: "stun:stun3.l.google.com:19302" }
            ],
            iceCandidatePoolSize: 10,
            iceTransportPolicy: "all",
            bundlePolicy: "balanced",
            rtcpMuxPolicy: "require"
          }
        },
        sessionDescriptionHandlerFactory: (session2, options) => {
          options.localStream = mediaStream;
          return session2.sessionDescriptionHandlerFactory(session2, options);
        }
      };
      await this.simpleUser.answer(answerOptions);
      debugLog(((_b = this.config) == null ? void 0 : _b.debug) || false, "Call answered with video:", this.videoEnabled);
      if (this.simpleUser.session) {
        this.setupRemoteStreamHandlers(this.simpleUser.session);
      }
    } catch (error) {
      errorLog("Answer call failed", error);
      if (this.localStream) {
        this.localStream.getTracks().forEach((track) => {
          var _a2, _b2;
          try {
            track.stop();
            debugLog(((_a2 = this.config) == null ? void 0 : _a2.debug) || false, `Stopped local media track on answer failure: ${track.kind}`);
          } catch (trackError) {
            debugLog(((_b2 = this.config) == null ? void 0 : _b2.debug) || false, `Failed to stop track on answer failure: ${track.kind}`, trackError);
          }
        });
        this.localStream = null;
      }
      throw error;
    }
  }
  async rejectCall() {
    var _a;
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
      debugLog(((_a = this.config) == null ? void 0 : _a.debug) || false, "Call rejected");
    } catch (error) {
      errorLog("Reject call failed", error);
      throw error;
    }
  }
  async hangup() {
    var _a;
    if (!this.simpleUser) return;
    try {
      await this.simpleUser.hangup();
      debugLog(((_a = this.config) == null ? void 0 : _a.debug) || false, "Call hung up");
    } catch (error) {
      errorLog("Hangup failed", error);
      throw error;
    }
  }
  async mute() {
    var _a;
    if (!this.simpleUser) return;
    try {
      await this.simpleUser.mute();
      debugLog(((_a = this.config) == null ? void 0 : _a.debug) || false, "Call muted");
    } catch (error) {
      errorLog("Mute failed", error);
      throw error;
    }
  }
  async unmute() {
    var _a;
    if (!this.simpleUser) return;
    try {
      await this.simpleUser.unmute();
      debugLog(((_a = this.config) == null ? void 0 : _a.debug) || false, "Call unmuted");
    } catch (error) {
      errorLog("Unmute failed", error);
      throw error;
    }
  }
  sendDTMF(tone) {
    var _a;
    if (!this.simpleUser || !this.currentCall) return;
    try {
      if (typeof this.simpleUser.sendDTMF === "function") {
        this.simpleUser.sendDTMF(tone);
        debugLog(((_a = this.config) == null ? void 0 : _a.debug) || false, "DTMF sent", tone);
        this.dispatchEvent(
          new CustomEvent("dtmfSent", {
            detail: { tone, callInfo: this.currentCall }
          })
        );
      }
    } catch (error) {
      errorLog("DTMF send failed", error);
    }
  }
  getRemoteVideo() {
    return this.remoteVideo;
  }
  getRemoteAudio() {
    return this.remoteAudio;
  }
  getCurrentCall() {
    return this.currentCall;
  }
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      registered: this.isRegistered,
      initialized: this.isInitialized
    };
  }
  async connect() {
    await this.ensureSipClient();
  }
  async disconnect() {
    var _a;
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
    void this.lastVideoState;
    debugLog(((_a = this.config) == null ? void 0 : _a.debug) || false, "SIP client disconnected");
  }
}
class CallManager extends EventTarget {
  // Flag to prevent multiple simultaneous answer calls
  constructor(sipManager, contacts = []) {
    super();
    this.ringtone = null;
    this.ringTimeout = null;
    this.contacts = [];
    this.isAnsweringCall = false;
    this.sipManager = sipManager;
    this.contacts = contacts;
    this.callState = this.getInitialState();
    this.setupSipEventHandlers();
  }
  updateContacts(contacts) {
    this.contacts = contacts;
  }
  getInitialState() {
    return {
      active: false,
      incoming: false,
      outgoing: false,
      onHold: false,
      muted: false,
      remoteVideoEnabled: false,
      localVideoTransmitting: false,
      duration: 0,
      status: "idle"
    };
  }
  setupSipEventHandlers() {
    this.sipManager.addEventListener("incomingCall", this.handleIncomingCall.bind(this));
    this.sipManager.addEventListener("callStarted", this.handleCallStarted.bind(this));
    this.sipManager.addEventListener("callAnswered", this.handleCallAnswered.bind(this));
    this.sipManager.addEventListener("callEnded", this.handleCallEnded.bind(this));
    this.sipManager.addEventListener("callFailed", this.handleCallFailed.bind(this));
    this.sipManager.addEventListener("localVideoChanged", this.handleLocalVideoChanged.bind(this));
    this.sipManager.addEventListener("remoteVideoChanged", this.handleRemoteVideoChanged.bind(this));
    this.sipManager.addEventListener("callTimer", this.handleCallTimer.bind(this));
    this.sipManager.addEventListener("callHold", this.handleCallHold.bind(this));
  }
  cleanExtension(rawExtension) {
    if (!rawExtension || rawExtension === "unknown") return rawExtension;
    let cleaned = rawExtension.replace(/^Extension\s+/i, "");
    cleaned = cleaned.replace(/-screen$|-web$|-mobile$|-phone$/i, "");
    const numericMatch = cleaned.match(/(\d+)/);
    if (numericMatch) {
      return numericMatch[1];
    }
    return cleaned;
  }
  cleanDisplayName(displayName, extension) {
    if (!displayName || displayName === "unknown" || displayName === "Unknown Caller") {
      return extension;
    }
    let cleaned = displayName.replace(/^Extension\s+/i, "");
    cleaned = cleaned.replace(new RegExp(`\\b${extension}\\b`, "g"), "").trim();
    if (!cleaned || cleaned === extension) {
      return extension;
    }
    return cleaned;
  }
  handleIncomingCall(event) {
    const { from, displayName } = event.detail;
    const cleanedExtension = this.cleanExtension(from);
    const cleanedDisplayName = this.cleanDisplayName(displayName, cleanedExtension);
    const contact = this.contacts ? getContactByExtension(this.contacts, cleanedExtension) : null;
    const finalCallerName = contact ? contact.name : cleanedDisplayName;
    this.callState = __spreadProps(__spreadValues({}, this.callState), {
      active: true,
      incoming: true,
      outgoing: false,
      callerId: cleanedExtension,
      callerName: finalCallerName,
      status: "ringing",
      duration: 0
    });
    this.ringtone = playRingtone();
    this.ringTimeout = window.setTimeout(() => {
      if (this.callState.status === "ringing" && this.callState.incoming) {
        this.rejectCall().catch((error) => {
          console.error("Auto-reject failed:", error);
          this.forceCallCleanup();
        });
      }
    }, 3e4);
    this.dispatchCallStateUpdate();
  }
  forceCallCleanup() {
    this.stopRinging();
    this.clearRingTimeout();
    try {
      console.log("Force call cleanup, ensuring media tracks are stopped");
    } catch (error) {
      console.error("Error during force call cleanup:", error);
    }
    this.callState = this.getInitialState();
    this.callState.status = "ended";
    this.dispatchCallStateUpdate();
    setTimeout(() => {
      this.callState.status = "idle";
      this.dispatchCallStateUpdate();
    }, 1e3);
  }
  handleCallStarted(event) {
    const { target } = event.detail;
    const cleanedExtension = this.cleanExtension(target);
    const contact = this.contacts ? getContactByExtension(this.contacts, cleanedExtension) : null;
    const finalCallerName = contact ? contact.name : cleanedExtension;
    this.callState = __spreadProps(__spreadValues({}, this.callState), {
      active: true,
      incoming: false,
      outgoing: true,
      callerId: cleanedExtension,
      callerName: finalCallerName,
      status: "connecting",
      duration: 0
    });
    this.dispatchCallStateUpdate();
  }
  handleCallAnswered(_event) {
    this.stopRinging();
    this.clearRingTimeout();
    this.callState = __spreadProps(__spreadValues({}, this.callState), {
      status: "answered",
      incoming: false,
      outgoing: false,
      duration: 0
    });
    const videoState = this.sipManager.getLocalVideoState();
    this.callState.localVideoTransmitting = videoState.transmitting;
    setTimeout(() => {
      const remoteVideo = this.sipManager.getRemoteVideo();
      if (remoteVideo && remoteVideo.srcObject) {
        const stream = remoteVideo.srcObject;
        const videoTracks = stream.getVideoTracks();
        this.callState.remoteVideoEnabled = videoTracks.length > 0 && videoTracks.some((track) => track.enabled);
        console.log("Remote video detected in call answered:", {
          videoTracks: videoTracks.length,
          enabled: this.callState.remoteVideoEnabled
        });
        this.dispatchCallStateUpdate();
      }
    }, 500);
    this.dispatchCallStateUpdate();
  }
  handleCallEnded(_event) {
    this.stopRinging();
    this.clearRingTimeout();
    this.callState = this.getInitialState();
    this.callState.status = "ended";
    this.dispatchCallStateUpdate();
    setTimeout(() => {
      this.callState.status = "idle";
      this.dispatchCallStateUpdate();
    }, 2e3);
  }
  handleCallFailed(_event) {
    this.stopRinging();
    this.clearRingTimeout();
    try {
      console.log("Call failed, ensuring media tracks are stopped");
    } catch (error) {
      console.error("Error during call failure cleanup:", error);
    }
    this.callState = this.getInitialState();
    this.callState.status = "error";
    this.dispatchCallStateUpdate();
  }
  handleCallTimer(event) {
    const { duration } = event.detail;
    this.callState.duration = duration;
    this.dispatchCallStateUpdate();
    this.dispatchEvent(
      new CustomEvent("callTimerUpdate", {
        detail: {
          duration,
          formattedDuration: formatDuration(duration)
        }
      })
    );
  }
  handleCallHold(event) {
    const { held } = event.detail;
    this.callState.onHold = held;
    this.callState.status = held ? "held" : "answered";
    this.dispatchCallStateUpdate();
  }
  handleLocalVideoChanged(event) {
    const { transmitting } = event.detail;
    this.callState.localVideoTransmitting = transmitting;
    this.dispatchCallStateUpdate();
  }
  handleRemoteVideoChanged(event) {
    const { enabled } = event.detail;
    this.callState.remoteVideoEnabled = enabled;
    this.dispatchCallStateUpdate();
  }
  async toggleVideo() {
    try {
      const enabled = await this.sipManager.toggleVideo();
      return enabled;
    } catch (error) {
      console.error("Failed to toggle video:", error);
      throw error;
    }
  }
  async enableVideo() {
    try {
      await this.sipManager.enableVideo();
      console.log("Video enabled successfully");
    } catch (error) {
      console.error("Failed to enable video:", error);
      throw error;
    }
  }
  async disableVideo() {
    try {
      await this.sipManager.disableVideo();
    } catch (error) {
      console.error("Failed to disable video:", error);
      throw error;
    }
  }
  stopRinging() {
    if (this.ringtone) {
      stopRingtone(this.ringtone);
      this.ringtone = null;
    }
  }
  clearRingTimeout() {
    if (this.ringTimeout) {
      clearTimeout(this.ringTimeout);
      this.ringTimeout = null;
    }
  }
  dispatchCallStateUpdate() {
    this.dispatchEvent(
      new CustomEvent("callStateChanged", {
        detail: { callState: __spreadValues({}, this.callState) }
      })
    );
  }
  async makeCall(target, includeVideo) {
    try {
      await this.sipManager.makeCall(target, includeVideo);
    } catch (error) {
      this.callState.status = "error";
      this.dispatchCallStateUpdate();
      throw error;
    }
  }
  // FIXED: Enhanced answerCall to properly handle video
  async answerCall(withVideo = false) {
    if (this.isAnsweringCall) {
      console.warn("Call is already being answered, ignoring duplicate request");
      return;
    }
    try {
      this.isAnsweringCall = true;
      if (withVideo) {
        console.log("Answering with video - enabling video first");
        await this.sipManager.enableVideo();
      }
      await this.sipManager.answerCall();
      console.log(`Call answered ${withVideo ? "with" : "without"} video`);
    } catch (error) {
      console.error("Failed to answer call:", error);
      this.callState.status = "error";
      this.dispatchCallStateUpdate();
      throw error;
    } finally {
      this.isAnsweringCall = false;
    }
  }
  async rejectCall() {
    this.stopRinging();
    this.clearRingTimeout();
    try {
      if (this.sipManager && (this.callState.status === "ringing" || this.callState.incoming)) {
        await this.sipManager.rejectCall();
      } else {
        console.warn("Cannot reject call - invalid state:", this.callState.status);
        this.forceCallCleanup();
        return;
      }
    } catch (error) {
      console.error("Reject call failed:", error);
      this.forceCallCleanup();
      throw error;
    }
  }
  async hangupCall() {
    try {
      await this.sipManager.hangup();
    } catch (error) {
      this.callState = this.getInitialState();
      this.dispatchCallStateUpdate();
      throw error;
    }
  }
  async toggleMute() {
    if (this.callState.muted) {
      await this.sipManager.unmute();
      this.callState.muted = false;
    } else {
      await this.sipManager.mute();
      this.callState.muted = true;
    }
    this.dispatchCallStateUpdate();
    return this.callState.muted;
  }
  sendDTMF(tone) {
    if (this.callState.active && this.callState.status === "answered") {
      this.sipManager.sendDTMF(tone);
    }
  }
  getCallState() {
    return __spreadValues({}, this.callState);
  }
  getRemoteVideo() {
    return this.sipManager.getRemoteVideo();
  }
  getCurrentCall() {
    return this.sipManager.getCurrentCall();
  }
  getFormattedDuration() {
    return formatDuration(this.callState.duration);
  }
}
const sharedStyles = i`
  :host {
    display: block;
    --sip-primary-color: var(--primary-color);
    --sip-secondary-color: var(--secondary-color);
    --sip-text-primary-color: var(--primary-text-color);
    --sip-text-secondary-color: var(--secondary-text-color);
    --sip-card-background-color: var(--card-background-color);
    --sip-divider-color: var(--divider-color);
    --sip-success-color: var(--success-color, #4caf50);
    --sip-warning-color: var(--warning-color, #ff9800);
    --sip-error-color: var(--error-color, #f44336);
    --sip-border-radius: var(--ha-card-border-radius, 12px);
  }

  .card-content {
    padding: 16px;
  }

  .status-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    background: var(--secondary-background-color);
    border-bottom: 1px solid var(--sip-divider-color);
    border-radius: var(--sip-border-radius) var(--sip-border-radius) 0 0;
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--sip-error-color);
  }

  .status-dot.connected {
    background: var(--sip-success-color);
  }

  .status-dot.connecting {
    background: var(--sip-warning-color);
    animation: pulse 1.5s infinite;
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

  .contacts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
    margin: 16px 0;
  }

  .contact-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 8px;
    background: var(--sip-card-background-color);
    border: 1px solid var(--sip-divider-color);
    border-radius: var(--sip-border-radius);
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
    color: var(--sip-text-primary-color);
  }

  .contact-button:hover {
    background: var(--secondary-background-color);
    border-color: var(--sip-primary-color);
    transform: translateY(-2px);
  }

  .contact-button:active {
    transform: translateY(0);
  }

  .contact-icon {
    width: 32px;
    height: 32px;
    color: var(--sip-primary-color);
  }

  .contact-name {
    font-size: 12px;
    font-weight: 500;
    text-align: center;
    line-height: 1.2;
  }

  .contact-extension {
    font-size: 10px;
    color: var(--sip-text-secondary-color);
    opacity: 0.7;
  }

  .video-container {
    position: relative;
    background: #000;
    border-radius: var(--sip-border-radius);
    overflow: hidden;
    aspect-ratio: 4/3;
    margin: 16px 0;
  }

  .video-element {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .video-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 18px;
  }

  .call-controls {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin: 16px 0;
  }

  .control-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
  }

  .control-button.primary {
    background: var(--sip-success-color);
    color: white;
  }

  .control-button.danger {
    background: var(--sip-error-color);
    color: white;
  }

  .control-button.secondary {
    background: var(--secondary-background-color);
    color: var(--sip-text-primary-color);
    border: 1px solid var(--sip-divider-color);
  }

  .control-button:hover {
    transform: scale(1.1);
  }

  .control-button:active {
    transform: scale(0.95);
  }

  .control-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .keypad {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin: 16px 0;
    max-width: 240px;
    margin-left: auto;
    margin-right: auto;
  }

  .keypad-button {
    aspect-ratio: 1;
    border: none;
    border-radius: var(--sip-border-radius);
    background: var(--secondary-background-color);
    color: var(--sip-text-primary-color);
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.1s ease;
    font-family: inherit;
  }

  .keypad-button:hover {
    background: var(--sip-primary-color);
    color: white;
  }

  .keypad-button:active {
    transform: scale(0.95);
  }

  .call-info {
    text-align: center;
    margin: 16px 0;
  }

  .caller-name {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 4px;
  }

  .caller-number {
    font-size: 16px;
    color: var(--sip-text-secondary-color);
    margin-bottom: 8px;
  }

  .call-duration {
    font-size: 14px;
    color: var(--sip-text-secondary-color);
    font-family: monospace;
  }

  .error-message {
    background: var(--sip-error-color);
    color: white;
    padding: 12px;
    border-radius: var(--sip-border-radius);
    margin: 16px 0;
    text-align: center;
    font-weight: 500;
  }

  .hidden {
    display: none !important;
  }

  .incoming-call-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  }

  .incoming-call-content {
    background: var(--sip-card-background-color);
    border-radius: var(--sip-border-radius);
    padding: 32px;
    text-align: center;
    max-width: 320px;
    width: 90%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .incoming-call-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--sip-primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    color: white;
    font-size: 32px;
  }

  .incoming-call-actions {
    display: flex;
    justify-content: center;
    gap: 32px;
    margin-top: 24px;
  }

  .answer-button {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: none;
    background: var(--sip-success-color);
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }

  .reject-button {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: none;
    background: var(--sip-error-color);
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }

  .answer-button:hover,
  .reject-button:hover {
    transform: scale(1.1);
  }

  .answer-button:active,
  .reject-button:active {
    transform: scale(0.95);
  }
`;
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp2(target, key, result);
  return result;
};
let WebRTCSipCard = class extends i$1 {
  constructor() {
    super(...arguments);
    this.connected = false;
    this.registered = false;
    this.error = null;
    this.showKeypad = false;
    this.currentInput = "";
    this.callDuration = "00:00";
    this.remoteVideoAvailable = false;
    this.connectionAttempts = 0;
    this.isRetrying = false;
    this.sipManager = null;
    this.callManager = null;
    this.remoteVideoCheckInterval = null;
    this.remoteVideoUpdateTimeout = null;
    this.connectionRetryTimeout = null;
    this.MAX_RETRY_ATTEMPTS = 5;
    this.RETRY_DELAYS = [2e3, 5e3, 1e4, 2e4, 3e4];
    this.isAnsweringCall = false;
  }
  static getConfigElement() {
    return document.createElement("ha-webrtc-sip-card-editor");
  }
  static getStubConfig() {
    return __spreadValues({}, DEFAULT_CONFIG);
  }
  setConfig(config) {
    try {
      validateConfig(config);
      this.config = mergeConfig(config);
      this.connectionAttempts = 0;
      this.initializeSipClient();
    } catch (error) {
      this.error = error instanceof Error ? error.message : "Invalid configuration";
      throw new Error(this.error);
    }
  }
  getCardSize() {
    return this.callState && this.callState.active ? 6 : 4;
  }
  async initializeSipClient() {
    try {
      if (this.sipManager) {
        await this.sipManager.disconnect();
      }
      this.error = null;
      this.connected = false;
      this.registered = false;
      this.isRetrying = false;
      const sipConfig = {
        server: this.config.server_url.replace(/^wss?:\/\//, "").replace(/:\d+$/, ""),
        username: this.config.username,
        password: this.config.password,
        domain: this.config.domain || this.config.server_url.replace(/^wss?:\/\//, "").replace(/:\d+$/, ""),
        websocket_port: this.config.websocket_port ? Number(this.config.websocket_port) : this.config.server_url.includes("wss://") ? 443 : 80,
        use_secure: this.config.server_url.startsWith("wss://"),
        display_name: this.config.display_name,
        debug: this.config.debug
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
  async attemptConnection() {
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
      await this.sipManager.connect();
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
        this.error = `Connection failed. Retrying in ${Math.ceil(delay / 1e3)} seconds... (${this.connectionAttempts}/${this.MAX_RETRY_ATTEMPTS})`;
        this.isRetrying = true;
        this.requestUpdate();
        this.connectionRetryTimeout = window.setTimeout(() => {
          this.attemptConnection();
        }, delay);
      } else {
        let detailedError = "Connection failed";
        if (errorMessage.includes("1006")) {
          detailedError = "WebSocket connection failed (1006). Check:\n• Server is running and accessible\n• Correct WebSocket URL and port\n• Network/firewall allows WebSocket connections\n• SSL certificate valid (for wss://)";
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
  setupEventHandlers() {
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
    this.sipManager.addEventListener("registered", (event) => {
      this.registered = event.detail.registered;
      if (this.registered) {
        this.error = null;
        this.connectionAttempts = 0;
        this.isRetrying = false;
      }
      this.requestUpdate();
    });
    this.sipManager.addEventListener("error", (event) => {
      const errorDetail = event.detail.error;
      console.error("SIP Manager error:", errorDetail);
      if (errorDetail.includes("WebSocket closed") || errorDetail.includes("1006")) {
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
    this.sipManager.addEventListener("localVideoChanged", (_event) => {
      var _a;
      this.callState = ((_a = this.callManager) == null ? void 0 : _a.getCallState()) || this.callState;
      this.requestUpdate();
    });
    this.sipManager.addEventListener("remoteVideoChanged", (event) => {
      var _a;
      console.log("Remote video changed:", event.detail);
      this.remoteVideoAvailable = event.detail.enabled && event.detail.hasVideoTracks;
      this.callState = ((_a = this.callManager) == null ? void 0 : _a.getCallState()) || this.callState;
      this.callState.remoteVideoEnabled = this.remoteVideoAvailable;
      this.updateComplete.then(() => {
        this.debouncedUpdateRemoteVideo();
      });
      this.requestUpdate();
    });
    this.callManager.addEventListener("callStateChanged", (event) => {
      var _a;
      const wasActive = (_a = this.callState) == null ? void 0 : _a.active;
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
    this.callManager.addEventListener("callTimerUpdate", (event) => {
      this.callDuration = event.detail.formattedDuration;
    });
  }
  scheduleReconnect() {
    if (this.isRetrying || this.connectionRetryTimeout) return;
    console.log("Scheduling reconnection...");
    this.connectionAttempts = 0;
    this.connectionRetryTimeout = window.setTimeout(() => {
      this.attemptConnection();
    }, 3e3);
  }
  debouncedUpdateRemoteVideo() {
    if (this.remoteVideoUpdateTimeout) {
      clearTimeout(this.remoteVideoUpdateTimeout);
    }
    this.remoteVideoUpdateTimeout = window.setTimeout(() => {
      this.updateRemoteVideo();
      this.remoteVideoUpdateTimeout = null;
    }, 50);
  }
  startRemoteVideoMonitoring() {
    this.stopRemoteVideoMonitoring();
    this.remoteVideoCheckInterval = window.setInterval(() => {
      var _a;
      const remoteVideo = (_a = this.callManager) == null ? void 0 : _a.getRemoteVideo();
      if (remoteVideo && remoteVideo.srcObject) {
        const stream = remoteVideo.srcObject;
        const hasVideoTracks = stream.getVideoTracks().length > 0;
        if (hasVideoTracks !== this.remoteVideoAvailable) {
          this.remoteVideoAvailable = hasVideoTracks;
          this.callState.remoteVideoEnabled = hasVideoTracks;
          console.log("Remote video monitoring detected change:", {
            hasVideoTracks,
            streamId: stream.id
          });
          this.updateRemoteVideo();
          this.requestUpdate();
        }
      }
    }, 1e3);
  }
  stopRemoteVideoMonitoring() {
    if (this.remoteVideoCheckInterval) {
      clearInterval(this.remoteVideoCheckInterval);
      this.remoteVideoCheckInterval = null;
    }
  }
  updateRemoteVideo() {
    var _a, _b;
    if (this.callState.active && this.remoteVideoElement) {
      const remoteVideo = (_a = this.callManager) == null ? void 0 : _a.getRemoteVideo();
      if (remoteVideo && remoteVideo.srcObject) {
        console.log("Updating remote video element:", {
          hasStream: !!remoteVideo.srcObject,
          videoTracks: ((_b = remoteVideo.srcObject) == null ? void 0 : _b.getVideoTracks().length) || 0
        });
        const updateVideoStream = async () => {
          try {
            if (this.remoteVideoElement.srcObject !== remoteVideo.srcObject) {
              if (!this.remoteVideoElement.paused) {
                this.remoteVideoElement.pause();
              }
              this.remoteVideoElement.srcObject = remoteVideo.srcObject;
              this.remoteVideoElement.autoplay = true;
              this.remoteVideoElement.playsInline = true;
              this.remoteVideoElement.muted = false;
              const playPromise = this.remoteVideoElement.play();
              if (playPromise !== void 0) {
                playPromise.then(() => {
                  console.log("Remote video playback started successfully");
                }).catch((error) => {
                  console.warn("Remote video playback failed:", error);
                });
              }
            }
          } catch (error) {
            if (error.name === "AbortError") {
              console.log("Video play was interrupted, this is normal during stream updates");
              setTimeout(() => {
                if (this.remoteVideoElement && this.remoteVideoElement.srcObject) {
                  if (this.remoteVideoElement.readyState >= 2) {
                    const retryPromise = this.remoteVideoElement.play();
                    if (retryPromise !== void 0) {
                      retryPromise.catch(() => {
                        console.log("Secondary play attempt failed, ignoring");
                      });
                    }
                  } else {
                    setTimeout(() => {
                      if (this.remoteVideoElement && this.remoteVideoElement.srcObject) {
                        const retryPromise = this.remoteVideoElement.play();
                        if (retryPromise !== void 0) {
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
              if (this.remoteVideoElement) {
                const currentStream = this.remoteVideoElement.srcObject;
                this.remoteVideoElement.srcObject = null;
                this.remoteVideoElement.srcObject = currentStream;
                setTimeout(() => {
                  if (this.remoteVideoElement && this.remoteVideoElement.srcObject) {
                    this.remoteVideoElement.muted = true;
                    const retryPromise = this.remoteVideoElement.play();
                    if (retryPromise !== void 0) {
                      retryPromise.catch((retryError) => {
                        console.log("Retry play attempt failed:", retryError);
                        if (this.remoteVideoElement && this.remoteVideoElement.srcObject) {
                          const currentStream2 = this.remoteVideoElement.srcObject;
                          this.remoteVideoElement.srcObject = null;
                          this.remoteVideoElement.srcObject = currentStream2;
                          setTimeout(() => {
                            if (this.remoteVideoElement && this.remoteVideoElement.srcObject) {
                              this.remoteVideoElement.muted = true;
                              const finalPromise = this.remoteVideoElement.play();
                              if (finalPromise !== void 0) {
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
          const stream = remoteVideo.srcObject;
          this.remoteVideoAvailable = stream.getVideoTracks().length > 0;
          this.requestUpdate();
        }
      }
    }
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.config) {
      this.initializeSipClient();
    }
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
  }
  render() {
    if (!this.config) {
      return x`<ha-card><div class="error">Configuration required</div></ha-card>`;
    }
    return x` <ha-card> ${this.renderStatusBar()} ${this.renderError()} ${this.renderContent()} ${this.renderIncomingCallModal()} </ha-card> `;
  }
  renderStatusBar() {
    const statusClass = this.registered ? "connected" : this.connected ? "connecting" : this.isRetrying ? "retrying" : "disconnected";
    let statusText = "Disconnected";
    if (this.registered) {
      statusText = "Connected";
    } else if (this.connected) {
      statusText = "Registering...";
    } else if (this.isRetrying) {
      statusText = `Retrying... (${this.connectionAttempts}/${this.MAX_RETRY_ATTEMPTS})`;
    }
    return x`
      <div class="status-bar">
        <div class="status-indicator">
          <div class="status-dot ${statusClass}"></div>
          <span>${statusText}</span>
          ${this.isRetrying ? x`<ha-circular-progress size="small" indeterminate></ha-circular-progress>` : ""}
        </div>
        <div class="card-title">${this.config.title || "WebRTC SIP Phone"}</div>
        ${!this.registered && !this.isRetrying ? x`<ha-icon-button @click=${this.manualRetry} title="Retry connection">
              <ha-icon icon="mdi:refresh"></ha-icon>
            </ha-icon-button>` : ""}
      </div>
    `;
  }
  renderError() {
    if (!this.error) return x``;
    const isMultiLine = this.error.includes("\n");
    return x`
      <div class="error-message ${isMultiLine ? "multiline" : ""}">
        <ha-icon icon="mdi:alert-circle"></ha-icon>
        <div class="error-text">${isMultiLine ? this.error.split("\n").map((line) => x`<div>${line}</div>`) : this.error}</div>
      </div>
    `;
  }
  renderContent() {
    if (this.callState.active) {
      return this.renderActiveCall();
    }
    return x` <div class="card-content">${this.renderContacts()} ${this.renderManualDial()} ${this.showKeypad ? this.renderKeypad() : ""}</div> `;
  }
  renderContacts() {
    if (!this.config.contacts.length) {
      return x`
        <div class="no-contacts">
          <ha-icon icon="mdi:account-plus-outline"></ha-icon>
          <div class="no-contacts-text">No contacts configured</div>
          <div class="no-contacts-subtitle">Add contacts in card configuration</div>
        </div>
      `;
    }
    return x`
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
  renderContact(contact) {
    return x`
      <div class="contact-item" ?disabled=${!this.registered}>
        <div class="contact-avatar">
          <ha-icon icon=${contact.icon || "mdi:account"}></ha-icon>
        </div>

        <div class="contact-info">
          <div class="contact-name">${contact.name}</div>
          <div class="contact-details">
            <span class="contact-extension">${formatPhoneNumber(contact.extension)}</span>
            <span class="video-badge">Video</span>
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
  renderManualDial() {
    return x`
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
  renderKeypad() {
    return x`
      <div class="keypad">
        ${DTMF_KEYS.flat().map((key) => x` <button class="keypad-button" @click=${() => this.handleKeypadPress(key)}>${key}</button> `)}
      </div>
    `;
  }
  renderActiveCall() {
    const isIncoming = this.callState.incoming && this.callState.status === "ringing";
    const isActive = this.callState.status === "answered";
    return x`
      <div class="active-call">
        ${this.renderCallInfo()} ${this.renderVideoStatus()} ${this.renderVideoArea()} ${isIncoming ? this.renderIncomingCallControls() : ""}
        ${isActive ? this.renderCallControls() : ""} ${isActive && !this.config.hide_keypad ? this.renderInCallKeypad() : ""}
      </div>
    `;
  }
  renderCallInfo() {
    return x`
      <div class="call-info">
        <div class="caller-name">${this.callState.callerName || "Unknown"}</div>
        <div class="caller-number">${formatPhoneNumber(this.callState.callerId || "")}</div>
        <div class="call-status">${this.getCallStatusText()}</div>
        ${this.callState.status === "answered" ? x`<div class="call-duration">${this.callDuration}</div>` : ""}
      </div>
    `;
  }
  renderVideoStatus() {
    return x`
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
  renderVideoArea() {
    return x`
      <div class="video-container ${this.remoteVideoAvailable ? "has-video" : "no-video"}">
        <video id="remote-video" autoplay playsinline ?muted=${false}></video>
        ${!this.remoteVideoAvailable ? x`
              <div class="video-overlay">
                <ha-icon icon="mdi:video-off"></ha-icon>
                <div>No remote video</div>
              </div>
            ` : ""}
      </div>
    `;
  }
  renderIncomingCallControls() {
    const isAnswering = this.isAnsweringCall;
    return x`
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
  renderCallControls() {
    return x`
      <div class="call-controls">
        <button class="control-button ${this.callState.muted ? "danger" : "secondary"}" @click=${this.toggleMute}>
          <ha-icon icon=${this.callState.muted ? "mdi:microphone-off" : "mdi:microphone"}></ha-icon>
        </button>

        <button class="control-button danger" @click=${this.hangupCall}>
          <ha-icon icon="mdi:phone-hangup"></ha-icon>
        </button>

        <button class="control-button secondary" @click=${() => this.showKeypad = !this.showKeypad}>
          <ha-icon icon="mdi:dialpad"></ha-icon>
        </button>
      </div>
    `;
  }
  renderInCallKeypad() {
    if (!this.showKeypad) return x``;
    return x`
      <div class="in-call-keypad">
        <div class="keypad">${DTMF_KEYS.flat().map((key) => x` <button class="keypad-button" @click=${() => this.sendDTMF(key)}>${key}</button> `)}</div>
      </div>
    `;
  }
  renderIncomingCallModal() {
    if (!this.callState.incoming || this.callState.status !== "ringing") {
      return x``;
    }
    const isAnswering = this.isAnsweringCall;
    return x`
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
  getCallStatusText() {
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
  handleInputChange(event) {
    const target = event.target;
    this.currentInput = sanitizeExtension(target.value);
  }
  handleKeypadPress(key) {
    this.currentInput += key;
    this.requestUpdate();
  }
  toggleKeypad() {
    this.showKeypad = !this.showKeypad;
  }
  clearInput() {
    this.currentInput = "";
  }
  async manualRetry() {
    this.connectionAttempts = 0;
    this.error = null;
    await this.attemptConnection();
  }
  async callContact(contact, withVideo = true) {
    if (!this.callManager || !this.registered) return;
    try {
      await this.callManager.makeCall(contact.extension, withVideo);
      console.log(`Video call started to ${contact.name}`);
    } catch (error) {
      console.error("Failed to call contact:", error);
      this.error = `Failed to call ${contact.name}`;
    }
  }
  async makeVideoCall() {
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
  // Flag to prevent multiple simultaneous answer calls
  async answerCall(withVideo = true) {
    if (!this.callManager) return;
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
  async rejectCall() {
    if (!this.callManager) return;
    try {
      await this.callManager.rejectCall();
    } catch (error) {
      console.error("Failed to reject call:", error);
    }
  }
  async hangupCall() {
    if (!this.callManager) return;
    try {
      await this.callManager.hangupCall();
      this.showKeypad = false;
    } catch (error) {
      console.error("Failed to hangup call:", error);
    }
  }
  async toggleMute() {
    if (!this.callManager) return;
    try {
      await this.callManager.toggleMute();
    } catch (error) {
      console.error("Failed to toggle mute:", error);
      this.error = "Failed to toggle mute";
    }
  }
  sendDTMF(tone) {
    if (!this.callManager) return;
    this.callManager.sendDTMF(tone);
  }
  static get styles() {
    return [
      sharedStyles,
      i`
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
      `
    ];
  }
};
__decorateClass([
  n({ attribute: false })
], WebRTCSipCard.prototype, "hass", 2);
__decorateClass([
  r()
], WebRTCSipCard.prototype, "config", 2);
__decorateClass([
  r()
], WebRTCSipCard.prototype, "connected", 2);
__decorateClass([
  r()
], WebRTCSipCard.prototype, "registered", 2);
__decorateClass([
  r()
], WebRTCSipCard.prototype, "error", 2);
__decorateClass([
  r()
], WebRTCSipCard.prototype, "callState", 2);
__decorateClass([
  r()
], WebRTCSipCard.prototype, "showKeypad", 2);
__decorateClass([
  r()
], WebRTCSipCard.prototype, "currentInput", 2);
__decorateClass([
  r()
], WebRTCSipCard.prototype, "callDuration", 2);
__decorateClass([
  r()
], WebRTCSipCard.prototype, "remoteVideoAvailable", 2);
__decorateClass([
  r()
], WebRTCSipCard.prototype, "connectionAttempts", 2);
__decorateClass([
  r()
], WebRTCSipCard.prototype, "isRetrying", 2);
__decorateClass([
  e("#remote-video")
], WebRTCSipCard.prototype, "remoteVideoElement", 2);
WebRTCSipCard = __decorateClass([
  t("ha-webrtc-sip-card")
], WebRTCSipCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "ha-webrtc-sip-card",
  name: "WebRTC SIP Card",
  description: "A modern WebRTC SIP client card for Home Assistant with video calling functionality",
  preview: true,
  documentationURL: "https://github.com/Ahmed9190/ha-webrtc-sip-card",
  version: CARD_VERSION
});
console.info(
  `%c HA-WEBRTC-SIP-CARD %c ${CARD_VERSION} `,
  "color: white; background: #03a9f4; font-weight: bold;",
  "color: #03a9f4; background: white; font-weight: bold;"
);
console.info("%c 🏠 HACS Compatible", "color: white; background: #4285F4; font-weight: bold; padding: 5px 10px; border-radius: 5px;");
export {
  WebRTCSipCard
};
