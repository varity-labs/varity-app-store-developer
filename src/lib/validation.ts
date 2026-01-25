/**
 * Form validation utilities for Varity App Store
 */

import { VALIDATION } from "./constants";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates a URL string
 * @param url - The URL to validate
 * @returns Error message or null if valid
 */
export function validateUrl(url: string): string | null {
  if (!url) return null; // Optional field - empty is valid
  try {
    new URL(url);
    return null;
  } catch {
    return "Please enter a valid URL";
  }
}

/**
 * Validates an email address
 * @param email - The email to validate
 * @param required - Whether the field is required
 * @returns Error message or null if valid
 */
export function validateEmail(email: string, required = false): string | null {
  if (!email) {
    return required ? "Email is required" : null;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return null;
}

/**
 * Validates a required field
 * @param value - The value to validate
 * @param fieldName - The display name for error messages
 * @returns Error message or null if valid
 */
export function validateRequired(value: string, fieldName: string): string | null {
  if (!value?.trim()) {
    return `${fieldName} is required`;
  }
  return null;
}

/**
 * Validates a field with maximum length
 * @param value - The value to validate
 * @param maxLength - Maximum allowed length
 * @param fieldName - The display name for error messages
 * @returns Error message or null if valid
 */
export function validateMaxLength(
  value: string,
  maxLength: number,
  fieldName: string
): string | null {
  if (value && value.length > maxLength) {
    return `${fieldName} must be ${maxLength} characters or less`;
  }
  return null;
}

/**
 * Validates a Twitter handle
 * @param handle - The Twitter handle (with or without @)
 * @returns Error message or null if valid
 */
export function validateTwitterHandle(handle: string): string | null {
  if (!handle) return null; // Optional field
  // Remove @ if present
  const cleanHandle = handle.startsWith("@") ? handle.slice(1) : handle;
  // Twitter handles: 1-15 characters, alphanumeric and underscores only
  const handleRegex = /^[a-zA-Z0-9_]{1,15}$/;
  if (!handleRegex.test(cleanHandle)) {
    return "Please enter a valid Twitter handle (1-15 characters, letters, numbers, and underscores only)";
  }
  return null;
}

/**
 * Form data interface for app submission
 * Includes index signature for compatibility with sanitizeFormData
 */
export interface AppFormData {
  name: string;
  description: string;
  appUrl: string;
  logoUrl: string;
  category: string;
  chainId: number;
  builtWithVarity: boolean;
  githubUrl: string;
  screenshots: string[];
  companyName: string;
  websiteUrl: string;
  twitterHandle: string;
  linkedinUrl: string;
  privacyPolicyUrl: string;
  supportEmail: string;
  termsOfServiceUrl: string;
  // Index signature for compatibility with sanitizeFormData
  [key: string]: string | number | boolean | string[];
}

/**
 * Validates the complete app submission form
 * @param data - The form data to validate
 * @returns Validation result with errors
 */
export function validateAppSubmission(data: AppFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // Required fields
  const nameError = validateRequired(data.name, "App name");
  if (nameError) errors.name = nameError;

  const descriptionError = validateRequired(data.description, "Description");
  if (descriptionError) errors.description = descriptionError;

  const appUrlRequiredError = validateRequired(data.appUrl, "Application URL");
  if (appUrlRequiredError) {
    errors.appUrl = appUrlRequiredError;
  } else {
    const appUrlError = validateUrl(data.appUrl);
    if (appUrlError) errors.appUrl = appUrlError;
  }

  const categoryError = validateRequired(data.category, "Category");
  if (categoryError) errors.category = categoryError;

  // Max length validations
  const nameLengthError = validateMaxLength(
    data.name,
    VALIDATION.NAME_MAX_LENGTH,
    "App name"
  );
  if (nameLengthError && !errors.name) errors.name = nameLengthError;

  const descLengthError = validateMaxLength(
    data.description,
    VALIDATION.DESCRIPTION_MAX_LENGTH,
    "Description"
  );
  if (descLengthError && !errors.description) errors.description = descLengthError;

  // Optional URL validations
  const logoUrlError = validateUrl(data.logoUrl);
  if (logoUrlError) errors.logoUrl = logoUrlError;

  const websiteUrlError = validateUrl(data.websiteUrl);
  if (websiteUrlError) errors.websiteUrl = websiteUrlError;

  const githubUrlError = validateUrl(data.githubUrl);
  if (githubUrlError) errors.githubUrl = githubUrlError;

  const linkedinUrlError = validateUrl(data.linkedinUrl);
  if (linkedinUrlError) errors.linkedinUrl = linkedinUrlError;

  const privacyPolicyUrlError = validateUrl(data.privacyPolicyUrl);
  if (privacyPolicyUrlError) errors.privacyPolicyUrl = privacyPolicyUrlError;

  const termsOfServiceUrlError = validateUrl(data.termsOfServiceUrl);
  if (termsOfServiceUrlError) errors.termsOfServiceUrl = termsOfServiceUrlError;

  // Email validation
  const emailError = validateEmail(data.supportEmail);
  if (emailError) errors.supportEmail = emailError;

  // Twitter handle validation
  const twitterError = validateTwitterHandle(data.twitterHandle);
  if (twitterError) errors.twitterHandle = twitterError;

  // Screenshot URL validations
  data.screenshots.forEach((url, index) => {
    const screenshotError = validateUrl(url);
    if (screenshotError) {
      errors[`screenshot_${index}`] = `Screenshot ${index + 1}: ${screenshotError}`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Form data interface for app update (edit form)
 */
export interface AppUpdateFormData {
  description: string;
  appUrl: string;
  screenshots: string[];
  // Index signature for compatibility with sanitizeFormData
  [key: string]: string | string[];
}

/**
 * Validates the app update form
 * @param data - The form data to validate
 * @returns Validation result with errors
 */
export function validateAppUpdate(data: AppUpdateFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // Required fields
  const descriptionError = validateRequired(data.description, "Description");
  if (descriptionError) errors.description = descriptionError;

  const appUrlRequiredError = validateRequired(data.appUrl, "Application URL");
  if (appUrlRequiredError) {
    errors.appUrl = appUrlRequiredError;
  } else {
    const appUrlError = validateUrl(data.appUrl);
    if (appUrlError) errors.appUrl = appUrlError;
  }

  // Max length validation
  const descLengthError = validateMaxLength(
    data.description,
    VALIDATION.DESCRIPTION_MAX_LENGTH,
    "Description"
  );
  if (descLengthError && !errors.description) errors.description = descLengthError;

  // Screenshot URL validations
  data.screenshots.forEach((url, index) => {
    const screenshotError = validateUrl(url);
    if (screenshotError) {
      errors[`screenshot_${index}`] = `Screenshot ${index + 1}: ${screenshotError}`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
