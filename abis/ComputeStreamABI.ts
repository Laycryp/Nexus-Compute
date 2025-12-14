export const COMPUTE_STREAM_ABI = [
  // ... createStream and stopStream same as before ...
  {
    "type": "function", "name": "createStream",
    "inputs": [{ "name": "_provider", "type": "address" }, { "name": "_ratePerSecond", "type": "uint256" }, { "name": "_depositAmount", "type": "uint256" }],
    "outputs": [{ "name": "streamId", "type": "uint256" }], "stateMutability": "nonpayable"
  },
  {
    "type": "function", "name": "stopStream",
    "inputs": [{ "name": "_streamId", "type": "uint256" }],
    "outputs": [], "stateMutability": "nonpayable"
  },
  // Updated Read Functions with amountPaid
  {
    "type": "function", "name": "streams",
    "inputs": [{ "name": "", "type": "uint256" }],
    "outputs": [
      { "name": "id", "type": "uint256" },
      { "name": "consumer", "type": "address" },
      { "name": "provider", "type": "address" },
      { "name": "ratePerSecond", "type": "uint256" },
      { "name": "depositAmount", "type": "uint256" },
      { "name": "startTime", "type": "uint256" },
      { "name": "amountPaid", "type": "uint256" }, // ✅ Added
      { "name": "isActive", "type": "bool" }
    ], "stateMutability": "view"
  },
  {
    "type": "function", "name": "getMyStreamsAsConsumer",
    "inputs": [{ "name": "_user", "type": "address" }],
    "outputs": [{
      "components": [
        { "name": "id", "type": "uint256" },
        { "name": "consumer", "type": "address" },
        { "name": "provider", "type": "address" },
        { "name": "ratePerSecond", "type": "uint256" },
        { "name": "depositAmount", "type": "uint256" },
        { "name": "startTime", "type": "uint256" },
        { "name": "amountPaid", "type": "uint256" }, // ✅ Added
        { "name": "isActive", "type": "bool" }
      ], "type": "tuple[]"
    }], "stateMutability": "view"
  },
  {
    "type": "function", "name": "getMyStreamsAsProvider",
    "inputs": [{ "name": "_provider", "type": "address" }],
    "outputs": [{
      "components": [
        { "name": "id", "type": "uint256" },
        { "name": "consumer", "type": "address" },
        { "name": "provider", "type": "address" },
        { "name": "ratePerSecond", "type": "uint256" },
        { "name": "depositAmount", "type": "uint256" },
        { "name": "startTime", "type": "uint256" },
        { "name": "amountPaid", "type": "uint256" }, // ✅ Added
        { "name": "isActive", "type": "bool" }
      ], "type": "tuple[]"
    }], "stateMutability": "view"
  }
] as const;

export const ERC20_ABI = [
  { "type": "function", "name": "approve", "inputs": [{ "name": "spender", "type": "address" }, { "name": "amount", "type": "uint256" }], "outputs": [{ "name": "", "type": "bool" }], "stateMutability": "nonpayable" }
] as const;