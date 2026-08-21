// Utility function to trigger custom section transition events
export function triggerSectionTransition(target, label) {
  window.dispatchEvent(
    new CustomEvent('trigger-section-transition', {
      detail: { target, label }
    })
  );
}
