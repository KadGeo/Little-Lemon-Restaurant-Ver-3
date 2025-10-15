# Testing Guide for Little Lemon Restaurant

This guide explains how to run and write tests for the Little Lemon Restaurant application.

## Table of Contents

- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Test Structure](#test-structure)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

All testing dependencies are already installed:
- **Vitest**: Test framework (fast, Vite-native)
- **@testing-library/react**: React component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Custom matchers for DOM assertions
- **jsdom**: DOM implementation for Node.js

### Test Setup

The testing environment is configured in:
- `vitest.config.js` - Vitest configuration
- `src/test/setup.js` - Global test setup

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (re-runs on file changes)
```bash
npm test -- --watch
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run specific test file
```bash
npm test -- BookingForm.test.jsx
```

### Run tests matching a pattern
```bash
npm test -- --grep="validates"
```

## Writing Tests

### Test File Location

Place test files in `src/components/__tests__/` directory:
```
src/
  components/
    __tests__/
      BookingForm.test.jsx
      YourComponent.test.jsx
    BookingForm.jsx
    YourComponent.jsx
```

### Using the Test Template

A comprehensive test template is provided at:
```
src/components/__tests__/ComponentTemplate.test.jsx
```

To use it:
1. Copy the file
2. Rename to `YourComponent.test.jsx`
3. Replace `ComponentName` with your component name
4. Update tests based on your component's functionality

### Basic Test Structure

```jsx
import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import YourComponent from '../YourComponent';

describe('YourComponent', () => {
  test('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText(/expected text/i)).toBeInTheDocument();
  });

  test('handles user interaction', async () => {
    const user = userEvent.setup();
    const mockFn = vi.fn();

    render(<YourComponent onClick={mockFn} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockFn).toHaveBeenCalled();
  });
});
```

## Test Structure

### Recommended Test Suites

Each component should have tests organized into these categories:

1. **Rendering Tests**
   - Component renders without errors
   - Renders with correct props
   - Renders all required elements

2. **User Interaction Tests**
   - Click events
   - Form inputs
   - Keyboard navigation

3. **State Management Tests**
   - State updates correctly
   - Props trigger re-renders

4. **Validation Tests** (for forms)
   - Valid input scenarios
   - Invalid input scenarios
   - Error messages display

5. **Accessibility Tests**
   - ARIA labels present
   - Keyboard navigation works
   - Screen reader support

6. **Edge Cases**
   - Empty data
   - Large datasets
   - Special characters

### Example: Form Component Tests

```jsx
describe('BookingForm', () => {
  describe('HTML5 Attributes Validation', () => {
    test('date input has correct attributes', () => {
      render(<BookingForm {...mockProps} />);
      const input = screen.getByLabelText(/choose date/i);

      expect(input).toHaveAttribute('type', 'date');
      expect(input).toHaveAttribute('required');
      expect(input).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('Valid Validation Scenarios', () => {
    test('accepts valid date', async () => {
      render(<BookingForm {...mockProps} />);
      const input = screen.getByLabelText(/choose date/i);

      fireEvent.change(input, { target: { value: '2025-12-25' } });
      fireEvent.blur(input);

      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });

  describe('Invalid Validation Scenarios', () => {
    test('shows error for past date', async () => {
      render(<BookingForm {...mockProps} />);
      const input = screen.getByLabelText(/choose date/i);

      fireEvent.change(input, { target: { value: '2020-01-01' } });
      fireEvent.blur(input);

      expect(screen.getByText(/date cannot be in the past/i)).toBeInTheDocument();
    });
  });
});
```

## Best Practices

### 1. Use Testing Library Queries

Prefer queries in this order:
1. `getByRole` - Most accessible
2. `getByLabelText` - Good for forms
3. `getByPlaceholderText`
4. `getByText`
5. `getByTestId` - Last resort

```jsx
// ✅ Good
const button = screen.getByRole('button', { name: /submit/i });
const input = screen.getByLabelText(/email/i);

// ❌ Avoid
const button = screen.getByTestId('submit-button');
```

### 2. Test User Behavior

Focus on what the user sees and does:

```jsx
// ✅ Good - Tests user interaction
test('submits form when user clicks submit', async () => {
  const user = userEvent.setup();
  render(<BookingForm onSubmit={mockSubmit} />);

  await user.type(screen.getByLabelText(/date/i), '2025-12-25');
  await user.click(screen.getByRole('button', { name: /submit/i }));

  expect(mockSubmit).toHaveBeenCalled();
});

// ❌ Avoid - Tests implementation details
test('sets state when handleSubmit is called', () => {
  const { result } = renderHook(() => useState());
  // Testing internal state
});
```

### 3. Mock External Dependencies

```jsx
import { vi } from 'vitest';

// Mock API calls
vi.mock('../utils/api', () => ({
  fetchAPI: vi.fn(() => ['17:00', '18:00']),
  submitAPI: vi.fn(() => true)
}));

// Mock router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}));
```

### 4. Use Async Utilities

For async operations, use `waitFor` or `findBy*` queries:

```jsx
// ✅ Good
await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});

// or
const successMessage = await screen.findByText(/success/i);
expect(successMessage).toBeInTheDocument();

// ❌ Avoid - May fail on slow machines
const successMessage = screen.getByText(/success/i);
```

### 5. Clean Up After Tests

The test setup file (`src/test/setup.js`) automatically cleans up after each test using `cleanup()` from Testing Library.

### 6. Test Accessibility

Always include accessibility tests:

```jsx
test('has proper ARIA attributes', () => {
  render(<BookingForm />);
  const input = screen.getByLabelText(/date/i);

  expect(input).toHaveAttribute('aria-required', 'true');
  expect(input).toHaveAttribute('aria-invalid', 'false');
});

test('error messages have role="alert"', async () => {
  render(<BookingForm />);
  // Trigger error
  const error = await screen.findByRole('alert');
  expect(error).toHaveTextContent(/required/i);
});
```

## Troubleshooting

### Common Issues

#### 1. "Cannot find module" errors

Make sure the import path is correct:
```jsx
// Correct
import BookingForm from '../BookingForm';

// Wrong
import BookingForm from './BookingForm';
```

#### 2. "Element not found" errors

Use `screen.debug()` to see the rendered output:
```jsx
render(<Component />);
screen.debug(); // Prints the DOM
```

Or use `findBy*` for async elements:
```jsx
const element = await screen.findByText(/text/i);
```

#### 3. Date input tests failing

Date inputs should use `fireEvent.change()` instead of `userEvent.type()`:
```jsx
// ✅ Works with date inputs
fireEvent.change(dateInput, { target: { value: '2025-12-25' } });

// ❌ May not work properly
await user.type(dateInput, '2025-12-25');
```

#### 4. Router-dependent tests

Mock `react-router-dom` for components using routing:
```jsx
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children, to }) => <a href={to}>{children}</a>
}));
```

### Getting Help

- **Vitest Docs**: https://vitest.dev/
- **Testing Library**: https://testing-library.com/react
- **React Testing Best Practices**: https://kentcdodds.com/blog/common-mistakes-with-react-testing-library

## Test Coverage Goals

Aim for:
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

Focus on testing user-facing functionality rather than achieving 100% coverage.

## Running Tests in CI/CD

For continuous integration, run:
```bash
npm test -- --run
```

This runs tests once without watch mode.
