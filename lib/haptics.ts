import { WebHaptics } from "web-haptics";

let _haptics: WebHaptics | null = null;

function get(): WebHaptics | null {
  if (typeof window === "undefined") return null;
  if (!WebHaptics.isSupported) return null;
  if (!_haptics) _haptics = new WebHaptics();
  return _haptics;
}

export const haptics = {
  save:     () => get()?.trigger("nudge"),
  success:  () => get()?.trigger("success"),
  generate: () => get()?.trigger([{ duration: 30, intensity: 0.4 }]),
  error:    () => get()?.trigger("error"),
  dismiss:  () => get()?.trigger(20),
};
