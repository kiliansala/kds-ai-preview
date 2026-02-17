/**
 * React Example - KDS Button Integration
 *
 * This example demonstrates how to integrate @kds/react in a React application.
 */

import { useState } from 'react';
import { Button } from '@kds/react';
import '@kds/web-components/tokens.css';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setCount(count + 1);
  };

  const handleAsyncAction = async () => {
    setIsLoading(true);
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    alert('Action completed!');
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete?')) {
      alert('Item deleted');
    }
  };

  return (
    <div className="app">
      <header>
        <h1>KDS React Button Examples</h1>
        <p>Kapsch Design System - React Integration</p>
      </header>

      <main>
        {/* Basic Buttons */}
        <section>
          <h2>Button Sizes</h2>
          <div className="button-group">
            <Button size="sm" hierarchy="primary">Small</Button>
            <Button size="md" hierarchy="primary">Medium</Button>
            <Button size="lg" hierarchy="primary">Large</Button>
            <Button size="xl" hierarchy="primary">Extra Large</Button>
          </div>
        </section>

        {/* Hierarchies */}
        <section>
          <h2>Button Hierarchies</h2>
          <div className="button-group">
            <Button hierarchy="primary">Primary</Button>
            <Button hierarchy="secondary-color">Secondary Color</Button>
            <Button hierarchy="secondary-gray">Secondary Gray</Button>
            <Button hierarchy="tertiary-color">Tertiary Color</Button>
            <Button hierarchy="tertiary-gray">Tertiary Gray</Button>
            <Button hierarchy="link-color">Link Color</Button>
            <Button hierarchy="link-gray">Link Gray</Button>
          </div>
        </section>

        {/* Interactive Example */}
        <section>
          <h2>Interactive Counter</h2>
          <div className="counter">
            <p>Count: <strong>{count}</strong></p>
            <Button
              size="lg"
              hierarchy="primary"
              onClick={handleClick}
            >
              Increment Counter
            </Button>
          </div>
        </section>

        {/* Async Action */}
        <section>
          <h2>Async Action</h2>
          <Button
            hierarchy="secondary-color"
            disabled={isLoading}
            onClick={handleAsyncAction}
          >
            {isLoading ? 'Loading...' : 'Start Async Action'}
          </Button>
        </section>

        {/* Destructive Action */}
        <section>
          <h2>Destructive Actions</h2>
          <div className="button-group">
            <Button
              hierarchy="primary"
              destructive
              onClick={handleDelete}
            >
              Delete Item
            </Button>
            <Button
              hierarchy="secondary-color"
              destructive
              onClick={handleDelete}
            >
              Remove Account
            </Button>
          </div>
        </section>

        {/* Disabled States */}
        <section>
          <h2>Disabled States</h2>
          <div className="button-group">
            <Button disabled>Disabled Primary</Button>
            <Button hierarchy="secondary-color" disabled>Disabled Secondary</Button>
            <Button hierarchy="link-color" disabled>Disabled Link</Button>
          </div>
        </section>

        {/* Icon Buttons */}
        <section>
          <h2>Buttons with Icons</h2>
          <div className="button-group">
            <Button
              size="md"
              hierarchy="primary"
              iconPosition="leading"
            >
              <svg slot="icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
              </svg>
              Add Item
            </Button>

            <Button
              size="md"
              hierarchy="secondary-color"
              iconPosition="trailing"
            >
              Next
              <svg slot="icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Button>

            <Button
              size="md"
              hierarchy="tertiary-gray"
              iconPosition="only"
              ariaLabel="Settings"
            >
              <svg slot="icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </Button>
          </div>
        </section>

        {/* Form Example */}
        <section>
          <h2>Form Submission</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Form submitted!');
            }}
            className="form-example"
          >
            <input type="text" placeholder="Enter your name" required />
            <input type="email" placeholder="Enter your email" required />
            <div className="button-group">
              <Button type="submit" hierarchy="primary" size="lg">
                Submit
              </Button>
              <Button type="reset" hierarchy="secondary-gray">
                Reset
              </Button>
            </div>
          </form>
        </section>
      </main>

      <footer>
        <p>Built with <strong>@kds/react</strong> - Kapsch Design System</p>
      </footer>
    </div>
  );
}

export default App;
