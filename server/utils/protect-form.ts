import type { H3Event } from 'h3';

type ProtectFormOptions = {
  /** Form name, used as the rate-limit bucket, e.g. `contact`. */
  form: string;
  /** reCAPTCHA v3 token sent by the client (`useRecaptcha().validate()`). */
  token: unknown;
  /** Submissions allowed per IP per window. Default 5. */
  max?: number;
  /** Window length in milliseconds. Default 10 minutes. */
  windowMs?: number;
  /** Minimum reCAPTCHA score. Default 0.5. */
  minScore?: number;
  /** Expected reCAPTCHA action. Default `submit`. */
  action?: string;
  /** Form field the error is shown under. Default `email`. */
  path?: string;
};

type SiteVerify = {
  success: boolean;
  score?: number;
  action?: string;
};

/**
 * Guards a public form endpoint: per-IP rate limit plus server-side reCAPTCHA v3 verification.
 * Call it before anything is sent (email, Slack), otherwise bots can post straight to the API.
 * Reads `runtimeConfig.recaptchaSecret`.
 *
 * @example
 * const data = validateSchema(formContactSchema.safeParse(body));
 * await protectForm(event, { form: 'contact', token: body.recaptcha });
 */
export const protectForm = async (event: H3Event, options: ProtectFormOptions) => {
  const { form, token, max = 5, windowMs = 10 * 60_000, minScore = 0.5, action = 'submit', path = 'email' } = options;

  const reject = (status: number, message: string) => {
    throw createError({
      status,
      statusMessage: status === 400 ? 'Bad Request' : 'Forbidden',
      data: [{ path, message }]
    });
  };

  rateLimit(event, { key: `form:${form}`, max, windowMs, path });

  const recaptchaSecret = useRuntimeConfig(event).recaptchaSecret as string | undefined;

  if (!recaptchaSecret) {
    console.error('[cp] RECAPTCHA_SECRET_KEY is not configured, rejecting form submission');

    throw createError({ status: 500, statusMessage: 'Form is temporarily unavailable' });
  }

  if (typeof token !== 'string' || !token) {
    return reject(400, 'Verification failed, please reload the page and try again');
  }

  const verify = await $fetch<SiteVerify>('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret: recaptchaSecret, response: token, remoteip: getClientIP(event) })
  }).catch(() => ({ success: false }) as SiteVerify);

  if (!verify.success || (verify.score ?? 0) < minScore || verify.action !== action) {
    reject(403, 'Verification failed, please try again');
  }
};
