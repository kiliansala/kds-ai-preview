/**
 * @package @kds/blazor
 * @description JavaScript interop for Blazor KDS components
 */

// Import KDS web components
import '@kds/web-components';

window.KdsBlazor = {
  buttonListeners: new Map(),

  /**
   * Attach event listener to button web component
   * @param {HTMLElement} element - The button element
   * @param {DotNetObject} dotNetHelper - .NET object reference
   */
  attachButtonListener: function (element, dotNetHelper) {
    const listener = () => {
      dotNetHelper.invokeMethodAsync('HandleButtonClick');
    };

    element.addEventListener('kds-button-click', listener);
    this.buttonListeners.set(element, listener);
  },

  /**
   * Detach event listener from button web component
   * @param {HTMLElement} element - The button element
   */
  detachButtonListener: function (element) {
    const listener = this.buttonListeners.get(element);
    if (listener) {
      element.removeEventListener('kds-button-click', listener);
      this.buttonListeners.delete(element);
    }
  }
};
