/**
 * @package @kds/angular
 * @module KdsButtonModule
 * @description Angular module for KDS Button component
 */

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KdsButtonComponent } from './button.component';

// Import web components
import '@kds/web-components';

/**
 * Module that provides KDS Button component for Angular
 *
 * @example
 * ```typescript
 * import { KdsButtonModule } from '@kds/angular';
 *
 * @NgModule({
 *   imports: [KdsButtonModule],
 *   // ...
 * })
 * export class AppModule { }
 * ```
 */
@NgModule({
  imports: [
    CommonModule,
    KdsButtonComponent // Standalone component
  ],
  exports: [KdsButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KdsButtonModule {}
