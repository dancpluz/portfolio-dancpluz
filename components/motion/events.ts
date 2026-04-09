export const pageTransitionEvent = new EventTarget();

export function triggerExitAnimation() {
  return new Promise((resolve) => {
    pageTransitionEvent.dispatchEvent(new CustomEvent('exit', { detail: { resolve } }));
  });
}
