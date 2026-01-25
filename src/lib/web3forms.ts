/**
 * Web3Forms Email Notification Service
 *
 * Used to notify the Varity team of new app submissions.
 * Documentation: https://web3forms.com/
 */

// API key from environment variables (server-side or client-side)
const WEB3FORMS_API_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ||
  process.env.WEB3FORMS_ACCESS_KEY;

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const DEFAULT_RECIPIENT = "team@varity.so";
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

/**
 * Web3Forms API response structure
 */
export interface Web3FormsResponse {
  success: boolean;
  message: string;
}

/**
 * App submission data for email notification
 */
export interface AppSubmissionEmailData {
  // Required fields
  appName: string;
  description: string;
  appUrl: string;
  category: string;
  developerAddress: string;

  // Optional fields
  logoUrl?: string;
  chainId?: number;
  githubUrl?: string;
  builtWithVarity?: boolean;
  screenshots?: string[];

  // Company information
  companyName?: string;
  websiteUrl?: string;

  // Social links
  twitterHandle?: string;
  linkedinUrl?: string;

  // Legal documents
  privacyPolicyUrl?: string;
  supportEmail?: string;
  termsOfServiceUrl?: string;
}

/**
 * Configuration options for sending emails
 */
export interface SendEmailOptions {
  /** Override the default recipient */
  to?: string;
  /** Custom subject line (default: "New App Submission: {appName}") */
  subject?: string;
  /** Number of retry attempts on failure */
  maxRetries?: number;
}

/**
 * Delay utility for retry logic
 */
const delay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Format the email body with app submission details
 */
function formatEmailBody(data: AppSubmissionEmailData): string {
  const lines: string[] = [
    "New app submitted to Varity App Store:",
    "",
    "=== APPLICATION DETAILS ===",
    `App Name: ${data.appName}`,
    `Category: ${data.category}`,
    `App URL: ${data.appUrl}`,
    `Logo URL: ${data.logoUrl || "Not provided"}`,
    `Chain ID: ${data.chainId || 33529}`,
    `GitHub URL: ${data.githubUrl || "Not provided"}`,
    `Built with Varity: ${data.builtWithVarity ? "Yes" : "No"}`,
    "",
    "=== DESCRIPTION ===",
    data.description,
    "",
    "=== DEVELOPER INFO ===",
    `Wallet Address: ${data.developerAddress}`,
  ];

  // Add company information if provided
  if (data.companyName || data.websiteUrl) {
    lines.push("");
    lines.push("=== COMPANY INFORMATION ===");
    if (data.companyName) lines.push(`Company Name: ${data.companyName}`);
    if (data.websiteUrl) lines.push(`Website: ${data.websiteUrl}`);
  }

  // Add social links if provided
  if (data.twitterHandle || data.linkedinUrl) {
    lines.push("");
    lines.push("=== SOCIAL LINKS ===");
    if (data.twitterHandle) lines.push(`Twitter: @${data.twitterHandle}`);
    if (data.linkedinUrl) lines.push(`LinkedIn: ${data.linkedinUrl}`);
  }

  // Add legal documents if provided
  if (data.privacyPolicyUrl || data.supportEmail || data.termsOfServiceUrl) {
    lines.push("");
    lines.push("=== LEGAL & SUPPORT ===");
    if (data.supportEmail) lines.push(`Support Email: ${data.supportEmail}`);
    if (data.privacyPolicyUrl) lines.push(`Privacy Policy: ${data.privacyPolicyUrl}`);
    if (data.termsOfServiceUrl) lines.push(`Terms of Service: ${data.termsOfServiceUrl}`);
  }

  // Add screenshots if provided
  if (data.screenshots && data.screenshots.length > 0) {
    lines.push("");
    lines.push("=== SCREENSHOTS ===");
    data.screenshots.forEach((url, i) => {
      lines.push(`${i + 1}. ${url}`);
    });
  }

  // Footer
  lines.push("");
  lines.push("---");
  lines.push("Review at: https://developer.varity.so/admin");

  return lines.join("\n");
}

/**
 * Send an app submission notification email via Web3Forms
 *
 * @param data - The app submission data to include in the email
 * @param options - Optional configuration for the email
 * @returns Promise with the Web3Forms API response
 *
 * @example
 * ```typescript
 * const result = await sendAppSubmissionEmail({
 *   appName: "My DeFi App",
 *   description: "A decentralized finance application",
 *   appUrl: "https://mydefi.app",
 *   category: "DeFi",
 *   developerAddress: "0x1234...",
 * });
 *
 * if (result.success) {
 *   console.log("Email sent successfully");
 * }
 * ```
 */
export async function sendAppSubmissionEmail(
  data: AppSubmissionEmailData,
  options: SendEmailOptions = {}
): Promise<Web3FormsResponse> {
  // Check if Web3Forms is configured
  if (!WEB3FORMS_API_KEY) {
    console.warn("[Web3Forms] API key not configured. Set NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY or WEB3FORMS_ACCESS_KEY environment variable.");
    return {
      success: false,
      message: "Email notifications not configured - missing API key"
    };
  }

  const {
    to = DEFAULT_RECIPIENT,
    subject = `New App Submission: ${data.appName}`,
    maxRetries = MAX_RETRIES,
  } = options;

  const payload = {
    access_key: WEB3FORMS_API_KEY,
    subject,
    from_name: "Varity App Store",
    to,
    message: formatEmailBody(data),
    // Include structured data for easier parsing
    app_name: data.appName,
    category: data.category,
    app_url: data.appUrl,
    developer_address: data.developerAddress,
  };

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result: Web3FormsResponse = await response.json();

      if (result.success) {
        return result;
      }

      // Non-retryable error (e.g., invalid API key)
      if (response.status === 401 || response.status === 403) {
        console.error("[Web3Forms] Authentication failed:", result.message);
        return result;
      }

      lastError = new Error(result.message);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`[Web3Forms] Attempt ${attempt + 1} failed:`, lastError.message);
    }

    // Wait before retrying (except on last attempt)
    if (attempt < maxRetries) {
      await delay(RETRY_DELAY_MS * (attempt + 1)); // Exponential backoff
    }
  }

  console.error("[Web3Forms] All retry attempts failed:", lastError?.message);
  return {
    success: false,
    message: lastError?.message || "Failed to send email after multiple attempts",
  };
}

/**
 * Check if Web3Forms is configured and ready to use
 *
 * @returns true if the API key is configured
 */
export function isWeb3FormsConfigured(): boolean {
  return !!WEB3FORMS_API_KEY;
}

/**
 * Get the current Web3Forms configuration status
 * Useful for debugging and showing users if notifications are enabled
 */
export function getWeb3FormsStatus(): {
  configured: boolean;
  endpoint: string;
  defaultRecipient: string;
} {
  return {
    configured: isWeb3FormsConfigured(),
    endpoint: WEB3FORMS_ENDPOINT,
    defaultRecipient: DEFAULT_RECIPIENT,
  };
}
