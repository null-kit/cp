declare global {
  interface Window {
    grecaptcha: {
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
 */
export const useRecaptcha = () => {
  const recaptchaSite = useRuntimeConfig().public.recaptchaSite as string | undefined;

  if (!recaptchaSite) throw new Error('reCaptcha site key is not configured.');

  const validate = async (action = 'submit') => {
    await new Promise<void>((resolve) => {
      const init = () => {
        if (typeof window.grecaptcha !== 'undefined') return window.grecaptcha.ready(resolve);

        useHead({ script: [{ src: `https://google.com/recaptcha/api.js?render=${recaptchaSite}`, async: true }] });

        setTimeout(init, 50);
      };

      init();
    });

    const token = await window.grecaptcha.execute(recaptchaSite, { action });

    if (!token) throw new Error('No token received from ReCaptcha');

    return token;
  };

  return {
    validate
  };
};
