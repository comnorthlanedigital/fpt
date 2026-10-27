// Sound was removed from the combined site and the color studio page: every call is a no-op and no AudioContext is ever created.
const noop = () => {}
export const sound = new Proxy({ enabled: false, level: () => 0 }, { get: (t, k) => (k in t ? t[k] : noop) })
export const BEDS = {}
