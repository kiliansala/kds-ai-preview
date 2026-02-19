/**
 * @package @kds/blazor
 * @description JavaScript interop for Blazor KDS components
 */

// Import KDS web components
import '@kds/web-components';

window.KdsBlazor = {
  buttonListeners: new Map(),
  badgeListeners: new Map(),
  inputFieldListeners: new Map(),

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
  },

  /**
   * Attach event listener to badge web component
   * @param {HTMLElement} element - The badge element
   * @param {DotNetObject} dotNetHelper - .NET object reference
   */
  attachBadgeListener: function (element, dotNetHelper) {
    const listener = () => {
      dotNetHelper.invokeMethodAsync('HandleBadgeDismiss');
    };

    element.addEventListener('kds-badge-dismiss', listener);
    this.badgeListeners.set(element, listener);
  },

  /**
   * Detach event listener from badge web component
   * @param {HTMLElement} element - The badge element
   */
  detachBadgeListener: function (element) {
    const listener = this.badgeListeners.get(element);
    if (listener) {
      element.removeEventListener('kds-badge-dismiss', listener);
      this.badgeListeners.delete(element);
    }
  },

  /**
   * Attach event listeners to input-field web component
   * @param {HTMLElement} element - The input-field element
   * @param {DotNetObject} dotNetHelper - .NET object reference
   */
  attachInputFieldListeners: function (element, dotNetHelper) {
    const listeners = {
      input: (e) => dotNetHelper.invokeMethodAsync('HandleInput', e.detail.value),
      change: (e) => dotNetHelper.invokeMethodAsync('HandleChange', e.detail.value),
      help: () => dotNetHelper.invokeMethodAsync('HandleHelpClick'),
    };

    element.addEventListener('kds-input', listeners.input);
    element.addEventListener('kds-change', listeners.change);
    element.addEventListener('kds-help-click', listeners.help);
    this.inputFieldListeners.set(element, listeners);
  },

  /**
   * Detach event listeners from input-field web component
   * @param {HTMLElement} element - The input-field element
   */
  detachInputFieldListeners: function (element) {
    const listeners = this.inputFieldListeners.get(element);
    if (listeners) {
      element.removeEventListener('kds-input', listeners.input);
      element.removeEventListener('kds-change', listeners.change);
      element.removeEventListener('kds-help-click', listeners.help);
      this.inputFieldListeners.delete(element);
    }
  },

  /**
   * Set the value property on an input-field element
   * @param {HTMLElement} element - The input-field element
   * @param {string} value - The value to set
   */
  setInputFieldValue: function (element, value) {
    if (element) element.value = value;
  },

  buttonGroupItemListeners: new Map(),

  /**
   * Attach event listener to button group item web component
   * @param {HTMLElement} element - The button group item element
   * @param {DotNetObject} dotNetHelper - .NET object reference
   */
  attachButtonGroupItemListener: function (element, dotNetHelper) {
    const listener = () => {
      dotNetHelper.invokeMethodAsync('HandleButtonGroupItemClick');
    };

    element.addEventListener('kds-button-group-item-click', listener);
    this.buttonGroupItemListeners.set(element, listener);
  },

  /**
   * Detach event listener from button group item web component
   * @param {HTMLElement} element - The button group item element
   */
  detachButtonGroupItemListener: function (element) {
    const listener = this.buttonGroupItemListeners.get(element);
    if (listener) {
      element.removeEventListener('kds-button-group-item-click', listener);
      this.buttonGroupItemListeners.delete(element);
    }
  }
};
