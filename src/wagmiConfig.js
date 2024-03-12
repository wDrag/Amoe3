import { http, createConfig } from "wagmi";
import { klaytnBaobab } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const WagmiConfig = createConfig({
  chains: [klaytnBaobab],
  connectors: [injected()],
  transports: {
    [klaytnBaobab.id]: http(),
  },
});
