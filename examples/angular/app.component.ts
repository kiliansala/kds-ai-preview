/**
 * Angular Example - KDS Button Integration
 *
 * This example demonstrates how to integrate @kds/angular in an Angular application.
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KdsButtonComponent } from '@kds/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, KdsButtonComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'KDS Angular Button Examples';
  count = 0;
  isLoading = false;
  formData = {
    name: '',
    email: ''
  };

  // Counter example
  incrementCounter(): void {
    this.count++;
    console.log('Counter incremented:', this.count);
  }

  // Async action example
  async handleAsyncAction(): Promise<void> {
    this.isLoading = true;
    console.log('Starting async action...');

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 2000));

    this.isLoading = false;
    alert('Action completed!');
  }

  // Destructive action example
  handleDelete(): void {
    if (confirm('Are you sure you want to delete?')) {
      alert('Item deleted');
      console.log('Item deleted');
    }
  }

  // Form submission
  handleSubmit(): void {
    console.log('Form submitted:', this.formData);
    alert(`Form submitted!\nName: ${this.formData.name}\nEmail: ${this.formData.email}`);
  }

  // Form reset
  handleReset(): void {
    this.formData = { name: '', email: '' };
    console.log('Form reset');
  }

  // Generic click handler
  handleClick(label: string): void {
    console.log(`Button clicked: ${label}`);
  }
}
