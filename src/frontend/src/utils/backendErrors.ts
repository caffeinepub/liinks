/**
 * Backend error normalization utilities
 * Converts backend trap messages into user-friendly, actionable guidance
 */

export interface ErrorGuidance {
  message: string;
  action?: 'login' | 'signup' | 'verify-phone' | 'retry' | 'contact-admin';
  navigateTo?: string;
}

/**
 * Normalizes backend errors into safe, user-friendly English messages
 * with actionable guidance for the user
 */
export function normalizeBackendError(error: any): ErrorGuidance {
  const errorMessage = error?.message || String(error);
  const lowerMessage = errorMessage.toLowerCase();

  // Registration/profile errors
  if (
    lowerMessage.includes('profile not found') ||
    lowerMessage.includes('please register') ||
    lowerMessage.includes('not registered') ||
    lowerMessage.includes('registration required')
  ) {
    return {
      message: 'Please complete signup to access this feature.',
      action: 'signup',
      navigateTo: '/signup?reason=registration-required',
    };
  }

  // Phone verification errors
  if (
    lowerMessage.includes('phone') &&
    (lowerMessage.includes('not verified') || lowerMessage.includes('verify'))
  ) {
    return {
      message: 'Please verify your phone number to continue.',
      action: 'verify-phone',
      navigateTo: '/verify-phone',
    };
  }

  // Authentication errors
  if (
    lowerMessage.includes('anonymous') ||
    lowerMessage.includes('not authenticated') ||
    lowerMessage.includes('please log in')
  ) {
    return {
      message: 'Please log in to access this feature.',
      action: 'login',
    };
  }

  // Admin/role assignment errors (configuration issues)
  if (
    lowerMessage.includes('only admins can assign') ||
    lowerMessage.includes('admin') && lowerMessage.includes('role')
  ) {
    return {
      message: 'There was a configuration issue with your registration. Please try again or contact support if the problem persists.',
      action: 'retry',
    };
  }

  // Authorization errors (general)
  if (lowerMessage.includes('unauthorized') || lowerMessage.includes('permission')) {
    return {
      message: 'You do not have permission to perform this action.',
      action: 'contact-admin',
    };
  }

  // Subscription errors
  if (lowerMessage.includes('subscription') && lowerMessage.includes('required')) {
    return {
      message: 'This feature requires an active subscription. Please upgrade to continue.',
      action: 'retry',
      navigateTo: '/pricing',
    };
  }

  // Already registered
  if (lowerMessage.includes('already registered')) {
    return {
      message: 'You already have an account. Please continue to the app.',
      action: 'retry',
      navigateTo: '/templates',
    };
  }

  // OTP errors
  if (lowerMessage.includes('otp') || lowerMessage.includes('invalid code')) {
    return {
      message: errorMessage, // Keep original message for OTP errors
      action: 'retry',
    };
  }

  // Generic fallback
  return {
    message: errorMessage || 'An unexpected error occurred. Please try again.',
    action: 'retry',
  };
}

/**
 * Checks if an error is related to missing prerequisites for creating a bio page
 */
export function isPrerequisiteError(error: any): boolean {
  const errorMessage = error?.message || String(error);
  const lowerMessage = errorMessage.toLowerCase();

  return (
    lowerMessage.includes('profile not found') ||
    lowerMessage.includes('not registered') ||
    lowerMessage.includes('phone') && lowerMessage.includes('not verified') ||
    lowerMessage.includes('unauthorized')
  );
}
