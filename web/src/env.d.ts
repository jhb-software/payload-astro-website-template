/// <reference types="astro/client" />

import type { GlobalState } from './globalState'

declare global {
  namespace App {
    interface Locals {
      globalState: GlobalState
    }
  }
}
