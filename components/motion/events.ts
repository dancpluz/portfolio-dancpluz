export const pageTransitionEvent = new EventTarget();

export function triggerExitAnimation(): Promise<void> {
  return new Promise((resolve) => {
    pageTransitionEvent.dispatchEvent(
      new CustomEvent('exit', { detail: { resolve } }),
    );
  });
}