// accept generic fun T extends:constrains accept args and return void
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T, // T => (accept any ary) => void
  delay: number,
) {
  // to make it cross to work in all env (node js :  NodeJS.Timeout , browser : number)
  let timer: ReturnType<typeof setTimeout> | null = null;


  // closure fun will remember timer and fn and delay
  const debounced = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };

  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
  };

  // جديدة بتتأخر في التنفيذ function ترجع
  return debounced;
}
