# Testing Guide

Before shipping a change, test the smallest affected surface first and then run the project's normal build and lint checks when available.

## Core cases

- Initial loading state
- Empty and invalid input
- Successful data response
- Network/API failure
- Authenticated and unauthenticated access where applicable
- Mobile and desktop layouts
- Keyboard navigation for interactive flows

For AI features, also verify the deterministic fallback path when the model provider is unavailable.