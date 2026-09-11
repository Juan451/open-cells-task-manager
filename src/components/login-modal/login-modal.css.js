import { css } from 'lit';

export const styles = css`
  :host {
    display: block;

    font-family: 'Archivo', Arial, sans-serif;

    --modal-navy: #072146;
    --modal-dark-blue: #043263;
    --modal-core-blue: #004481;
    --modal-blue: #1973b8;
    --modal-aqua: #2dcccd;
    --modal-grey: #666666;
    --modal-grey-mid: #d9d9d9;
    --modal-grey-light: #f4f4f4;
    --modal-red: #d44b50;
    --modal-white: #ffffff;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* =========================================
     DIALOG
     ========================================= */

  .login-modal {
    width: calc(100% - 32px);
    max-width: 520px;

    padding: 0;
    margin: auto;

    overflow: hidden;

    border: none;
    border-radius: 4px;

    background: var(--modal-white);
    color: var(--modal-dark-blue);

    font-family: inherit;

    box-shadow:
      0 24px 80px rgba(7, 33, 70, 0.28),
      0 4px 16px rgba(7, 33, 70, 0.12);
  }

  .login-modal::backdrop {
    background: rgba(7, 33, 70, 0.68);
    backdrop-filter: blur(2px);
  }

  /* =========================================
     CONTENT
     ========================================= */

  .login-modal__content {
    position: relative;

    padding: 46px 48px 40px;

    border-top: 5px solid var(--modal-aqua);
  }

  /* =========================================
     CLOSE
     ========================================= */

  .login-modal__close {
    position: absolute;
    top: 18px;
    right: 18px;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 36px;
    height: 36px;

    padding: 0;

    border: 0;
    border-radius: 50%;

    background: transparent;

    color: var(--modal-grey);

    font-family: inherit;
    font-size: 18px;

    cursor: pointer;

    transition:
      background 0.2s ease,
      color 0.2s ease;
  }

  .login-modal__close:hover {
    background: var(--modal-grey-light);
    color: var(--modal-navy);
  }

  /* =========================================
     BRAND
     ========================================= */

  .login-modal__brand {
    display: flex;
    align-items: center;

    gap: 10px;

    margin-bottom: 28px;

    color: var(--modal-core-blue);

    font-size: 12px;
    font-weight: 700;

    line-height: 1;
    letter-spacing: 0.08em;
  }

  .login-modal__brand-dot {
    display: block;

    width: 10px;
    height: 10px;

    flex: 0 0 auto;

    border-radius: 50%;

    background: var(--modal-aqua);

    box-shadow: 0 0 0 4px rgba(45, 204, 205, 0.16);
  }

  /* =========================================
     HEADER
     ========================================= */

  .login-modal__header {
    margin-bottom: 30px;
  }

  .login-modal__header h1 {
    margin: 0 0 12px;

    color: var(--modal-core-blue);

    font-family: inherit;
    font-size: 42px;
    font-weight: 700;

    line-height: 1.05;
    letter-spacing: -1px;
  }

  .login-modal__header p {
    max-width: 390px;

    margin: 0;

    color: var(--modal-dark-blue);

    font-size: 16px;
    font-weight: 300;

    line-height: 1.55;
  }

  /* =========================================
     FORM
     ========================================= */

  .login-modal__form {
    display: flex;
    flex-direction: column;

    gap: 20px;
  }

  .login-modal__field {
    display: flex;
    flex-direction: column;

    gap: 8px;
  }

  .login-modal__field span {
    color: var(--modal-dark-blue);

    font-size: 14px;
    font-weight: 600;
  }

  .login-modal__field input {
    display: block;

    width: 100%;
    height: 50px;

    padding: 0 16px;

    border: 1px solid var(--modal-grey-mid);
    border-radius: 2px;

    outline: none;

    background: var(--modal-white);
    color: var(--modal-navy);

    font-family: inherit;
    font-size: 16px;
    font-weight: 400;

    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease;
  }

  .login-modal__field input::placeholder {
    color: #8a96a8;
  }

  .login-modal__field input:hover {
    border-color: var(--modal-blue);
  }

  .login-modal__field input:focus {
    border-color: var(--modal-blue);

    box-shadow: 0 0 0 3px rgba(25, 115, 184, 0.12);
  }

  /* =========================================
     ERROR
     ========================================= */

  .login-modal__error {
    padding: 14px 16px;

    border-left: 4px solid var(--modal-red);

    background: rgba(212, 75, 80, 0.08);

    color: var(--modal-red);

    font-size: 14px;
    line-height: 1.45;
  }

  /* =========================================
     SIGN IN
     ========================================= */

  .login-modal__submit {
    display: flex;
    align-items: center;
    justify-content: space-between;

    width: 100%;
    min-height: 52px;

    margin-top: 4px;
    padding: 0 20px;

    border: 2px solid var(--modal-core-blue);
    border-radius: 2px;

    background: var(--modal-core-blue);
    color: var(--modal-white);

    font-family: inherit;
    font-size: 16px;
    font-weight: 600;

    cursor: pointer;

    transition:
      background 0.15s ease,
      border-color 0.15s ease,
      transform 0.15s ease;
  }

  .login-modal__submit:hover:not(:disabled) {
    background: var(--modal-navy);
    border-color: var(--modal-navy);
  }

  .login-modal__submit:active:not(:disabled) {
    transform: translateY(1px);
  }

  .login-modal__submit:disabled {
    opacity: 0.65;

    cursor: wait;
  }

  /* =========================================
     SPINNER
     ========================================= */

  .login-modal__spinner {
    width: 20px;
    height: 20px;

    border: 2px solid rgba(255, 255, 255, 0.45);
    border-top-color: var(--modal-white);
    border-radius: 50%;

    animation: login-spin 0.7s linear infinite;
  }

  @keyframes login-spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* =========================================
     CREATE ACCOUNT
     ========================================= */

  .login-modal__footer {
    display: flex;
    flex-direction: column;

    gap: 8px;

    margin-top: 30px;
    padding-top: 24px;

    border-top: 1px solid var(--modal-grey-mid);

    color: var(--modal-grey);

    font-size: 14px;
  }

  .login-modal__register {
    display: inline-flex;
    align-items: center;

    gap: 8px;

    width: fit-content;

    padding: 0;

    border: none;

    background: transparent;

    color: var(--modal-blue);

    font-family: inherit;
    font-size: 15px;
    font-weight: 600;

    cursor: pointer;

    transition:
      gap 0.15s ease,
      color 0.15s ease;
  }

  .login-modal__register:hover {
    gap: 12px;

    color: var(--modal-core-blue);
  }

  /* =========================================
     MOBILE
     ========================================= */

  @media screen and (max-width: 600px) {
    .login-modal {
      width: calc(100% - 24px);
    }

    .login-modal__content {
      padding: 42px 24px 30px;
    }

    .login-modal__header h1 {
      font-size: 34px;
    }
  }
`;
