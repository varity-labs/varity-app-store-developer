/**
 * Security utilities for Varity Developer Portal
 *
 * This module provides comprehensive security functions for:
 * - Input sanitization (XSS prevention)
 * - URL validation and sanitization
 * - Safe redirect URL checking
 * - Form data sanitization
 * - Wallet address validation
 * - Rate limiting awareness
 * - Secure storage helpers
 */

import DOMPurify from "isomorphic-dompurify";

// ============================================================================
// Input Sanitization
// ============================================================================

/**
 * Sanitize user input to prevent XSS attacks
 * Strips all HTML tags and trims whitespace
 * @param input - Raw user input string
 * @returns Sanitized string with no HTML tags
 */
export function sanitizeInput(input: string): string {
  if (!input) return "";
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] }).trim();
}

/**
 * Sanitize HTML content while allowing safe formatting tags
 * Use this for rich text content that needs basic formatting
 * @param html - Raw HTML string
 * @returns Sanitized HTML with only safe tags
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li"],
    ALLOWED_ATTR: ["href", "target", "rel"],
    // Force all links to open in new tab with security attributes
    ADD_ATTR: ["target", "rel"],
    FORBID_TAGS: ["script", "style", "iframe", "form", "input"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
  });
}

/**
 * Sanitize text content for display
 * Escapes HTML entities but preserves newlines
 * @param text - Raw text content
 * @returns HTML-escaped text safe for rendering
 */
export function sanitizeTextForDisplay(text: string): string {
  if (!text) return "";
  // First sanitize, then convert newlines to <br> for display
  const sanitized = DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
  return sanitized;
}

// ============================================================================
// URL Validation & Sanitization
// ============================================================================

/**
 * Allowed URL protocols for security
 */
const ALLOWED_PROTOCOLS = ["https:", "http:"];

/**
 * Dangerous URL patterns to block
 */
const DANGEROUS_URL_PATTERNS = [
  /^javascript:/i,
  /^data:/i,
  /^vbscript:/i,
  /^file:/i,
];

/**
 * Validate and sanitize a URL
 * Returns null if the URL is invalid or potentially dangerous
 * @param url - Raw URL string
 * @returns Sanitized URL or null if invalid
 */
export function sanitizeUrl(url: string): string | null {
  if (!url || typeof url !== "string") return null;

  const trimmedUrl = url.trim();

  // Block dangerous URL patterns
  for (const pattern of DANGEROUS_URL_PATTERNS) {
    if (pattern.test(trimmedUrl)) {
      return null;
    }
  }

  try {
    const parsed = new URL(trimmedUrl);

    // Only allow http and https protocols
    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
      return null;
    }

    return parsed.href;
  } catch {
    return null;
  }
}

/**
 * Check if a URL is safe for external redirect
 * More strict than sanitizeUrl - requires HTTPS
 * @param url - URL to check
 * @returns True if safe for redirect
 */
export function isSafeRedirectUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;

  const trimmedUrl = url.trim().toLowerCase();

  // Block dangerous URL patterns
  for (const pattern of DANGEROUS_URL_PATTERNS) {
    if (pattern.test(trimmedUrl)) {
      return false;
    }
  }

  try {
    const parsed = new URL(url);

    // Only allow HTTPS for redirects
    if (parsed.protocol !== "https:") {
      return false;
    }

    // Block localhost and internal IPs in production
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("172.")
    ) {
      // Allow in development
      if (process.env.NODE_ENV === "production") {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Validate URL without modifying it
 * @param url - URL to validate
 * @returns True if URL is valid
 */
export function isValidUrl(url: string): boolean {
  return sanitizeUrl(url) !== null;
}

/**
 * Check if URL is a valid image URL
 * @param url - URL to check
 * @returns True if URL appears to be an image
 */
export function isValidImageUrl(url: string): boolean {
  const sanitized = sanitizeUrl(url);
  if (!sanitized) return false;

  try {
    const parsed = new URL(sanitized);
    const pathname = parsed.pathname.toLowerCase();
    const validExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"];
    return validExtensions.some((ext) => pathname.endsWith(ext));
  } catch {
    return false;
  }
}

// ============================================================================
// Form Data Sanitization
// ============================================================================

/**
 * Sanitize form data before submission
 * Automatically detects and sanitizes URL fields vs text fields
 * @param data - Form data object
 * @returns Sanitized form data
 */
export function sanitizeFormData<T extends Record<string, unknown>>(data: T): T {
  const sanitized = { ...data } as Record<string, unknown>;

  for (const key in sanitized) {
    const value = sanitized[key];

    if (typeof value === "string") {
      // Check if it's a URL field (by key name or content)
      const isUrlField =
        key.toLowerCase().includes("url") ||
        key.toLowerCase().includes("link") ||
        key.toLowerCase().includes("website");

      if (isUrlField) {
        const sanitizedUrl = sanitizeUrl(value);
        sanitized[key] = sanitizedUrl || "";
      } else if (key.toLowerCase().includes("email")) {
        // Email fields - basic sanitization
        sanitized[key] = sanitizeInput(value);
      } else {
        // Regular text fields
        sanitized[key] = sanitizeInput(value);
      }
    } else if (Array.isArray(value)) {
      // Handle arrays (like screenshots)
      sanitized[key] = value.map((item) => {
        if (typeof item === "string") {
          // Assume array of strings in URL fields are URLs
          if (key.toLowerCase().includes("screenshot") || key.toLowerCase().includes("url")) {
            return sanitizeUrl(item) || "";
          }
          return sanitizeInput(item);
        }
        return item;
      });
    }
  }

  return sanitized as T;
}

// ============================================================================
// Wallet Address Validation
// ============================================================================

/**
 * Ethereum address regex pattern
 */
const ETH_ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;

/**
 * Validate Ethereum wallet address format
 * @param address - Address to validate
 * @returns True if valid Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  if (!address || typeof address !== "string") return false;
  return ETH_ADDRESS_PATTERN.test(address);
}

/**
 * Sanitize and validate a wallet address
 * @param address - Address to sanitize
 * @returns Lowercase address or null if invalid
 */
export function sanitizeAddress(address: string): `0x${string}` | null {
  if (!isValidAddress(address)) return null;
  return address.toLowerCase() as `0x${string}`;
}

// ============================================================================
// Rate Limiting Awareness
// ============================================================================

/**
 * Rate limiter configuration
 */
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

/**
 * Rate limit state for client-side tracking
 */
interface RateLimitState {
  count: number;
  resetTime: number;
}

/**
 * In-memory rate limit store (per action)
 */
const rateLimitStore = new Map<string, RateLimitState>();

/**
 * Default rate limit configurations
 */
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  submit: { maxRequests: 5, windowMs: 60 * 1000 }, // 5 per minute
  update: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 per minute
  api: { maxRequests: 30, windowMs: 60 * 1000 }, // 30 per minute
};

/**
 * Check if an action is rate limited on the client side
 * This is a soft limit - actual enforcement should be server-side
 * @param action - Action identifier
 * @param config - Rate limit configuration
 * @returns Object with isLimited flag and remaining time
 */
export function checkRateLimit(
  action: string,
  config: RateLimitConfig = RATE_LIMITS.api
): { isLimited: boolean; remainingMs: number; remainingRequests: number } {
  const now = Date.now();
  const key = `rate_limit_${action}`;
  let state = rateLimitStore.get(key);

  // Reset if window has passed
  if (!state || now > state.resetTime) {
    state = {
      count: 0,
      resetTime: now + config.windowMs,
    };
  }

  const isLimited = state.count >= config.maxRequests;
  const remainingMs = isLimited ? Math.max(0, state.resetTime - now) : 0;
  const remainingRequests = Math.max(0, config.maxRequests - state.count);

  return { isLimited, remainingMs, remainingRequests };
}

/**
 * Increment the rate limit counter for an action
 * @param action - Action identifier
 * @param config - Rate limit configuration
 */
export function incrementRateLimit(
  action: string,
  config: RateLimitConfig = RATE_LIMITS.api
): void {
  const now = Date.now();
  const key = `rate_limit_${action}`;
  let state = rateLimitStore.get(key);

  if (!state || now > state.resetTime) {
    state = {
      count: 1,
      resetTime: now + config.windowMs,
    };
  } else {
    state.count++;
  }

  rateLimitStore.set(key, state);
}

// ============================================================================
// Secure Storage Helpers
// ============================================================================

/**
 * Storage key prefix for security
 */
const STORAGE_PREFIX = "varity_secure_";

/**
 * Securely store a value in localStorage with optional expiration
 * Sensitive data should NOT be stored in localStorage - use this only for
 * non-sensitive preferences and state
 * @param key - Storage key
 * @param value - Value to store
 * @param expiresInMs - Optional expiration time in milliseconds
 */
export function secureStore(
  key: string,
  value: string,
  expiresInMs?: number
): void {
  if (typeof window === "undefined") return;

  const storageKey = `${STORAGE_PREFIX}${key}`;
  const data = {
    value,
    expires: expiresInMs ? Date.now() + expiresInMs : null,
  };

  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch {
    // Storage might be full or disabled
    console.warn("Failed to store value in localStorage");
  }
}

/**
 * Retrieve a securely stored value from localStorage
 * Returns null if expired or not found
 * @param key - Storage key
 * @returns Stored value or null
 */
export function secureRetrieve(key: string): string | null {
  if (typeof window === "undefined") return null;

  const storageKey = `${STORAGE_PREFIX}${key}`;

  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return null;

    const data = JSON.parse(stored);

    // Check expiration
    if (data.expires && Date.now() > data.expires) {
      localStorage.removeItem(storageKey);
      return null;
    }

    return data.value;
  } catch {
    return null;
  }
}

/**
 * Remove a securely stored value
 * @param key - Storage key
 */
export function secureRemove(key: string): void {
  if (typeof window === "undefined") return;
  const storageKey = `${STORAGE_PREFIX}${key}`;
  localStorage.removeItem(storageKey);
}

/**
 * Clear all securely stored values
 */
export function secureClearAll(): void {
  if (typeof window === "undefined") return;

  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => localStorage.removeItem(key));
}

// ============================================================================
// Content Security Helpers
// ============================================================================

/**
 * Check if content contains potentially dangerous patterns
 * @param content - Content to check
 * @returns True if content appears safe
 */
export function isContentSafe(content: string): boolean {
  if (!content) return true;

  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
    /on\w+\s*=/i, // Event handlers like onclick=, onerror=
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<form/i,
  ];

  return !dangerousPatterns.some((pattern) => pattern.test(content));
}

/**
 * Validate contract call parameters
 * Ensures parameters meet expected format and constraints
 * @param params - Object with parameters to validate
 * @param schema - Validation schema
 * @returns Validation result
 */
export function validateContractParams(
  params: Record<string, unknown>,
  schema: Record<string, { type: string; maxLength?: number; required?: boolean }>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const [key, rules] of Object.entries(schema)) {
    const value = params[key];

    // Check required fields
    if (rules.required && (value === undefined || value === null || value === "")) {
      errors.push(`${key} is required`);
      continue;
    }

    // Skip validation if not required and not provided
    if (value === undefined || value === null) continue;

    // Type checking
    if (rules.type === "string" && typeof value !== "string") {
      errors.push(`${key} must be a string`);
    } else if (rules.type === "number" && typeof value !== "number") {
      errors.push(`${key} must be a number`);
    } else if (rules.type === "boolean" && typeof value !== "boolean") {
      errors.push(`${key} must be a boolean`);
    } else if (rules.type === "address" && !isValidAddress(value as string)) {
      errors.push(`${key} must be a valid Ethereum address`);
    } else if (rules.type === "url" && !isValidUrl(value as string)) {
      errors.push(`${key} must be a valid URL`);
    }

    // Length checking for strings
    if (rules.maxLength && typeof value === "string" && value.length > rules.maxLength) {
      errors.push(`${key} exceeds maximum length of ${rules.maxLength}`);
    }
  }

  return { valid: errors.length === 0, errors };
}
