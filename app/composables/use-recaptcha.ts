declare global {
  interface Window {
    grecaptcha?: {
      ready(callback: () => void): void;
      execute(siteKey: string, options?: { action?: string }): Promise<string>;
    };
  }
}

/**
 * reCAPTCHA v3 client. `validate()` returns a token to send with the form body,
 * which the endpoint verifies with `protectForm()`. Tokens are single-use.
 * Reads `runtimeConfig.public.recaptchaSite`.
 *
 * @example
 * const recaptcha = await useRecaptcha().validate();
 * await $fetch('/api/forms/contact', { method: 'POST', body: { ...formData, recaptcha } });
 *
 * // optional: preload the script on first interaction
 * <form @mouseover.once="useRecaptcha().init">
 */
export const useRecaptcha = () => {
  const recaptchaSite = useRuntimeConfig().public.recaptchaSite as string | undefined;

  if (!recaptchaSite) throw new Error('reCaptcha site key is not configured.');

  /** Injects the reCAPTCHA script once. Safe to call repeatedly. */
  const init = () => {
    if (window.grecaptcha || document.querySelector('script[data-recaptcha]')) return;

    const script = document.createElement('script');

    script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSite}`;
    script.async = true;
    script.dataset.recaptcha = '';

    document.head.appendChild(script);
  };

  /**
   * Never throws: on failure (script blocked, timeout) it returns an empty token, so the form
   * request still goes out and the server answers with a visible "verification failed" error
   * instead of the form hanging in its loading state.
   */
  const validate = async (action = 'submit') => {
    try {
      init();

      await new Promise<void>((resolve, reject) => {
        const startedAt = Date.now();

        const wait = () => {
          if (window.grecaptcha?.ready) return window.grecaptcha.ready(resolve);

          if (Date.now() - startedAt > 10_000) return reject(new Error('reCaptcha failed to load'));

          setTimeout(wait, 50);
        };

        wait();
      });

      return (await window.grecaptcha!.execute(recaptchaSite, { action })) || '';
    } catch (error) {
      console.error('[reCaptcha]', error);

      return '';
    }
  };

  return {
    init,
    validate
  };
};
