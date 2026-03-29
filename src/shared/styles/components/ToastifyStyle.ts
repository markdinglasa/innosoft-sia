import { createGlobalStyle } from 'styled-components'

export const ToastifyStyle = createGlobalStyle`
  .Toastify {
    &__close-button {
      && {
        display: none;
      }
    }

    &__toast {
      && {
        border-radius: 8px;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
        min-height: 56px;
        padding: 16px;
        font-size: 1.5rem;
      }
    }

    &__toast-container {
      && {
        width: 360px;
        padding: 1rem;
      }
    }

    &__toast-body {
      && {
        margin: 0;
        padding: 0 8px;
      }
    }
  }
`
