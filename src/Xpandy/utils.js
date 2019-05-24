const debounce = (func, wait, immediate) => {
  let timeout;

  return () => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      timeout = null;

      if (!immediate) func.apply(this, arguments);
    }, wait);

    if (immediate && !timeout) func.apply(this, arguments);
  };
};

const functionExists = func => typeof func === 'function';

export { debounce, functionExists };
