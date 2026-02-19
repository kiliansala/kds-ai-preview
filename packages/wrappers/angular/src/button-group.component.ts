/**
 * @package @kds/angular
 * @component KdsButtonGroupComponent, KdsButtonGroupItemComponent
 * @description Angular component wrappers for kds-button-group web components
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import type { ButtonGroupItemIcon } from '@kds/web-components';

/**
 * Angular wrapper for the Button Group container
 *
 * @example
 * ```html
 * <kds-button-group-wrapper ariaLabel="View options">
 *   <kds-button-group-item-wrapper [selected]="true">Tab 1</kds-button-group-item-wrapper>
 *   <kds-button-group-item-wrapper>Tab 2</kds-button-group-item-wrapper>
 * </kds-button-group-wrapper>
 * ```
 */
@Component({
  selector: 'kds-button-group-wrapper',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <kds-button-group
      #groupElement
      [attr.aria-label]="ariaLabel"
    >
      <ng-content></ng-content>
    </kds-button-group>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class KdsButtonGroupComponent {
  @ViewChild('groupElement', { static: true }) groupElement!: ElementRef<HTMLElement>;

  /**
   * ARIA label for the group
   */
  @Input() ariaLabel?: string;
}

/**
 * Angular wrapper for a Button Group item
 *
 * @example
 * ```html
 * <kds-button-group-item-wrapper
 *   [selected]="true"
 *   icon="leading"
 *   (itemClick)="handleClick($event)"
 * >
 *   <svg slot="icon" ...></svg>
 *   Tab Label
 * </kds-button-group-item-wrapper>
 * ```
 */
@Component({
  selector: 'kds-button-group-item-wrapper',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <kds-button-group-item
      #itemElement
      [attr.selected]="selected || null"
      [attr.icon]="icon"
      [attr.disabled]="disabled || null"
      [attr.value]="value"
      [attr.aria-label]="ariaLabel"
    >
      <ng-content></ng-content>
    </kds-button-group-item>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class KdsButtonGroupItemComponent implements AfterViewInit, OnDestroy {
  @ViewChild('itemElement', { static: true }) itemElement!: ElementRef<HTMLElement>;

  /**
   * Whether this item is selected
   * @default false
   */
  @Input() selected = false;

  /**
   * Icon variant
   * @default 'none'
   */
  @Input() icon: ButtonGroupItemIcon = 'none';

  /**
   * Whether the item is disabled
   * @default false
   */
  @Input() disabled = false;

  /**
   * Value for selection tracking
   */
  @Input() value?: string;

  /**
   * ARIA label (required for icon-only)
   */
  @Input() ariaLabel?: string;

  /**
   * Emits when the item is clicked
   */
  @Output() itemClick = new EventEmitter<CustomEvent>();

  private clickListener?: (event: Event) => void;

  ngAfterViewInit(): void {
    this.clickListener = (event: Event) => {
      this.itemClick.emit(event as CustomEvent);
    };

    this.itemElement.nativeElement.addEventListener(
      'kds-button-group-item-click',
      this.clickListener
    );
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.itemElement.nativeElement.removeEventListener(
        'kds-button-group-item-click',
        this.clickListener
      );
    }
  }
}
