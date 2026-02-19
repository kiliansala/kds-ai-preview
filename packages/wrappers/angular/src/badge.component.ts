/**
 * @package @kds/angular
 * @component KdsBadgeComponent
 * @description Angular component wrapper for kds-badge web component
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
import type { BadgeSize, BadgeColor, BadgeIcon } from '@kds/web-components';

/**
 * Angular wrapper for the Badge web component
 *
 * @example
 * ```typescript
 * import { KdsBadgeComponent } from '@kds/angular';
 *
 * @Component({
 *   selector: 'app-example',
 *   template: `
 *     <kds-badge-wrapper
 *       size="sm"
 *       color="success"
 *     >
 *       Active
 *     </kds-badge-wrapper>
 *
 *     <kds-badge-wrapper
 *       icon="x-close"
 *       (badgeDismiss)="handleDismiss($event)"
 *     >
 *       Tag
 *     </kds-badge-wrapper>
 *   `
 * })
 * export class ExampleComponent {
 *   handleDismiss(event: CustomEvent) {
 *     console.log('Badge dismissed!', event);
 *   }
 * }
 * ```
 */
@Component({
  selector: 'kds-badge-wrapper',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <kds-badge
      #badgeElement
      [attr.size]="size"
      [attr.color]="color"
      [attr.icon]="icon"
      [attr.aria-label]="ariaLabel"
    >
      <ng-content></ng-content>
    </kds-badge>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class KdsBadgeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('badgeElement', { static: true }) badgeElement!: ElementRef<HTMLElement>;

  /**
   * Badge size
   * @default 'sm'
   */
  @Input() size: BadgeSize = 'sm';

  /**
   * Badge color variant
   * @default 'primary'
   */
  @Input() color: BadgeColor = 'primary';

  /**
   * Badge icon variant
   * @default 'false'
   */
  @Input() icon: BadgeIcon = 'false';

  /**
   * ARIA label for accessibility
   */
  @Input() ariaLabel?: string;

  /**
   * Emits when the badge dismiss button is clicked
   */
  @Output() badgeDismiss = new EventEmitter<CustomEvent>();

  private dismissListener?: (event: Event) => void;

  ngAfterViewInit(): void {
    this.dismissListener = (event: Event) => {
      this.badgeDismiss.emit(event as CustomEvent);
    };

    this.badgeElement.nativeElement.addEventListener(
      'kds-badge-dismiss',
      this.dismissListener
    );
  }

  ngOnDestroy(): void {
    if (this.dismissListener) {
      this.badgeElement.nativeElement.removeEventListener(
        'kds-badge-dismiss',
        this.dismissListener
      );
    }
  }
}
