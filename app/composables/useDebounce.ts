export function useDebounce<T>(source: Ref<T>, delay = 400) {
  const debounced = ref<T>(source.value) as Ref<T>;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  watch(source, (newValue) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      debounced.value = newValue;
    }, delay);
  });

  onScopeDispose(() => {
    if (timeout) clearTimeout(timeout);
  });

  return debounced;
}
