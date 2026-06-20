import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import App from '../App';
import { STORAGE_KEYS } from '../constants/storage';

describe('App Component', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.clear();
  });

  it('handles invalid JSON in localStorage gracefully', () => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_DATA, "{ invalid json }");

    // Attempting to render with corrupted data
    expect(() => render(<App />)).not.toThrow();

    // Expect warning to be logged
    expect(console.warn).toHaveBeenCalledWith(
      "Could not pre-populate from localStorage:",
      expect.any(SyntaxError)
    );
  });
});
