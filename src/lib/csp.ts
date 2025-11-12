import { NextResponse } from 'next/server';


export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Buffer.from(array).toString('base64');
}

/**
 * Builds the Content Security Policy header value
 * @param nonce - The nonce value to include in script-src and style-src
 * @param isDevelopment - Whether the app is in development mode
 */
export function buildCSPHeader(nonce: string, isDevelopment: boolean = false): string {
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      `'nonce-${nonce}'`,
      ...(isDevelopment ? ["'unsafe-eval'"] : []),
    ],
    'style-src': [
      "'self'",
      `'nonce-${nonce}'`,
      "'unsafe-hashes'",
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https://lh3.googleusercontent.com',
      'https://avatars.githubusercontent.com',
    ],
    'font-src': ["'self'"],
    'connect-src': [
      "'self'",
      'https://api.stripe.com',
      'https://checkout.stripe.com',
      'https://app.posthog.com',
      'https://us.i.posthog.com',
      'https://openidconnect.googleapis.com',
      'https://accounts.google.com',
      'https://github.com',
      'https://api.github.com',
      'https://*.ingest.sentry.io',
      'https://*.sentry.io',
    ],
    'frame-src': [
      'https://checkout.stripe.com',
      'https://js.stripe.com',
    ],
    'frame-ancestors': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
  };

  if (!isDevelopment) {
    directives['upgrade-insecure-requests'] = [];
  }

  return Object.entries(directives)
    .map(([key, values]) => {
      if (values.length === 0) {
        return key;
      }
      return `${key} ${values.join(' ')}`;
    })
    .join('; ');
}

/**
 * Sets CSP headers on a NextResponse
 * @param response - The NextResponse to modify
 * @param nonce - The nonce value for this request
 * @param isDevelopment - Whether the app is in development mode
 */
export function setCSPHeaders(
  response: NextResponse,
  nonce: string,
  isDevelopment: boolean = false
): void {
  const cspHeader = buildCSPHeader(nonce, isDevelopment);
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('x-nonce', nonce);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
}

export function getNonceFromHeaders(headers: Headers): string | null {
  return headers.get('x-nonce');
}
