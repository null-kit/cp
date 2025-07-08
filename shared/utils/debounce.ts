export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(func: F, ms: number = 300) => {
  let timeout: NodeJS.Timeout;

  const debounced = (...args: Parameters<F>) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => func(...args), ms);
  };

  return debounced;
};
