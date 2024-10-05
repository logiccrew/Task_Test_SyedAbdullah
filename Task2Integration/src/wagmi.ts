import { http, createConfig } from 'wagmi'
import {flare, polygon} from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [flare],
  connectors: [
    injected(),

    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
  ],
  transports: {
    [flare.id]: http(),
   
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
