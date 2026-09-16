export class CartDebouncer {
  private timers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  debounce(key: string, fn: () => void, delay: number = 500) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key)!);
    }

    this.timers.set(
      key,
      setTimeout(() => {
        this.timers.delete(key);
        fn();
      }, delay)
    );
  }

  clear(key: string) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key)!);
      this.timers.delete(key);
    }
  }

  clearAll() {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
  }
}

export const cartDebouncer = new CartDebouncer();
