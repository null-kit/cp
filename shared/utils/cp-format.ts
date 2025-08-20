type NumberOptions = {
  currency?: string;
  options?: Intl.NumberFormatOptions;
  locale?: string;
};

type DateOptions = {
  format?: 'short' | 'long' | 'iso';
  time?: boolean;
  year?: boolean;
  options?: Intl.DateTimeFormatOptions;
  locale?: string;
};

export const formatNumber = (value: number | string, { currency, options, locale = 'en-US' }: NumberOptions = {}) => {
  const defaultOptions: Intl.NumberFormatOptions = currency ? { style: 'currency', currency } : {};

  return new Intl.NumberFormat(locale, options || defaultOptions).format(Number(value));
};

export const formatDate = (
  date: Date | string | null,
  { format = 'short', time = false, year = true, options, locale = 'en-US' }: DateOptions = {}
): Date => {
  if (!date) return 'N/A' as unknown as Date;

  const dateObject = date instanceof Date ? date : new Date(date);

  if (format === 'iso') {
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}` as unknown as Date;
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    hourCycle: 'h24',
    month: format === 'long' ? 'long' : 'short',
    day: 'numeric',
    ...(time ? { hour: 'numeric', minute: 'numeric' } : {}),
    ...(year ? { year: 'numeric' } : {})
  };

  return new Intl.DateTimeFormat(locale, options || defaultOptions).format(dateObject) as unknown as Date;
};
