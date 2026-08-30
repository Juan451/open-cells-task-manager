import { css } from 'lit';

export const styles = css`
  :host {
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
    font-family: 'Archivo', sans-serif;
  }

  header {
    position: sticky;
    top: 0;

    display: flex;
    align-items: center;

    height: 4.5rem;
    padding: 0 1.5rem;

    background: #fff;
    border-bottom: 1px solid #d1d1d1;

    flex-shrink: 0;

    z-index: 10;
  }

  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;

    width: 100%;
  }

  .brand-link {
    display: inline-flex;
    align-items: center;

    cursor: pointer;
  }

  .brand-logo {
    height: 2rem;
  }

  .nav-links {
    display: flex;
    align-items: center;

    gap: 1.5rem;

    list-style: none;

    margin: 0;
    padding: 0;
  }

  .nav-links a {
    color: #1973b8;
    text-decoration: none;
  }

  /*
   * CONTENEDOR
   */

  .app-layout {
    display: flex;

    flex: 1;

    min-height: 0;
  }

  /*
   * SIDEBAR
   */

  .sidebar {
    width: 64px;

    display: flex;
    flex-direction: column;

    padding: 1rem 0;

    background: #072146;

    overflow: hidden;

    transition: width 0.25s ease;

    flex-shrink: 0;

    z-index: 5;
  }

  /*
   * Al pasar el ratón:
   */

  .sidebar:hover {
    width: 220px;
  }

  /*
   * ITEMS
   */

  .menu-item {
    width: 100%;

    display: flex;
    align-items: center;

    gap: 1rem;

    min-height: 52px;

    padding: 0 20px;

    border: 0;

    background: transparent;
    color: #fff;

    cursor: pointer;

    text-align: left;

    white-space: nowrap;
  }

  .menu-item:hover {
    background: #043263;
  }

  /*
   * ICONO
   */

  .menu-icon {
    width: 24px;

    display: flex;
    justify-content: center;

    flex-shrink: 0;

    font-size: 20px;
  }

  /*
   * TEXTO
   */

  .menu-text {
    opacity: 0;

    transform: translateX(-8px);

    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
  }

  .sidebar:hover .menu-text {
    opacity: 1;

    transform: translateX(0);
  }

  /*
   * PÁGINAS
   */

  main {
    flex: 1;

    position: relative;

    overflow: hidden;
  }

  main ::slotted(*) {
    position: absolute;

    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    visibility: hidden;

    overflow-y: auto;
  }

  main ::slotted([state='active']) {
    visibility: visible;

    animation: page-in 0.2s ease;
  }

  @keyframes page-in {
    from {
      opacity: 0;
      transform: translateY(6px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;