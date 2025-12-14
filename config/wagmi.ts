// المسار: config/wagmi.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { type Chain } from 'viem';

export const codexTestnet = {
  id: 812242, // ✅ تم التصحيح حسب الوثائق الرسمية
  name: 'Codex Testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }, // عملة الغاز هي ETH
  rpcUrls: {
    default: { http: ['https://rpc.codex-stg.xyz'] }, // ✅ الرابط الصحيح
  },
  blockExplorers: {
    default: { name: 'Codex Explorer', url: 'https://explorer.codex-stg.xyz' },
  },
  testnet: true,
} as const satisfies Chain;

export const config = getDefaultConfig({
  appName: 'Codex Compute Market',
  projectId: 'YOUR_PROJECT_ID', 
  chains: [codexTestnet],
  ssr: true,
});
