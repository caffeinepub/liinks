/**
 * UPI payment utilities for generating payment links and handling app intents
 */

export interface UpiPaymentParams {
  payeeVpa: string; // UPI ID
  payeeName: string;
  amount: number;
  transactionNote?: string;
}

/**
 * Generates a standard UPI payment link
 * Format: upi://pay?pa=<VPA>&pn=<Name>&am=<Amount>&tn=<Note>
 */
export function generateUpiLink(params: UpiPaymentParams): string {
  const { payeeVpa, payeeName, amount, transactionNote = 'Subscription Payment' } = params;
  
  const upiParams = new URLSearchParams({
    pa: payeeVpa,
    pn: payeeName,
    am: amount.toString(),
    tn: transactionNote,
    cu: 'INR',
  });

  return `upi://pay?${upiParams.toString()}`;
}

/**
 * Attempts to open Google Pay with the UPI payment link
 * Returns a promise that resolves to true if successful, false if failed
 */
export async function openGooglePay(upiLink: string): Promise<boolean> {
  try {
    // Google Pay deep link format
    const gpayLink = `tez://upi/pay?${upiLink.split('?')[1]}`;
    
    // Try to open the app
    window.location.href = gpayLink;
    
    // Wait a short time to see if the app opened
    return await new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve(false);
      }, 1500);

      // If the page is hidden (app opened), consider it successful
      const handleVisibilityChange = () => {
        if (document.hidden) {
          clearTimeout(timeout);
          resolve(true);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
    });
  } catch (error) {
    console.error('Failed to open Google Pay:', error);
    return false;
  }
}

/**
 * Attempts to open PhonePe with the UPI payment link
 * Returns a promise that resolves to true if successful, false if failed
 */
export async function openPhonePe(upiLink: string): Promise<boolean> {
  try {
    // PhonePe deep link format
    const phonePeLink = `phonepe://pay?${upiLink.split('?')[1]}`;
    
    // Try to open the app
    window.location.href = phonePeLink;
    
    // Wait a short time to see if the app opened
    return await new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve(false);
      }, 1500);

      // If the page is hidden (app opened), consider it successful
      const handleVisibilityChange = () => {
        if (document.hidden) {
          clearTimeout(timeout);
          resolve(true);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
    });
  } catch (error) {
    console.error('Failed to open PhonePe:', error);
    return false;
  }
}

/**
 * Copies text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
