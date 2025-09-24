import { css } from "lit";

export const sharedStyles = css`
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
