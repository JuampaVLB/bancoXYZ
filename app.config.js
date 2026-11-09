module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    balanceApiUrl: process.env.EXPO_PUBLIC_BALANCE_API_URL,
    transfersApiUrl: process.env.EXPO_PUBLIC_TRANSFERS_API_URL,
  },
});
