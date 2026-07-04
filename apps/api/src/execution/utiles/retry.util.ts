export enum RetryStrategy {
  FIXED = 'FIXED',
  LINEAR = 'LINEAR',
  EXPONENTIAL = 'EXPONENTIAL',
}

export function calculateNextRetry(
  strategy: RetryStrategy,
  delay: number,
  attempt: number,
): Date {
  let wait = delay;

  switch (strategy) {
    case RetryStrategy.FIXED:
      wait = delay;
      break;

    case RetryStrategy.LINEAR:
      wait = delay * attempt;
      break;

    case RetryStrategy.EXPONENTIAL:
      wait = delay * Math.pow(2, attempt - 1);
      break;

    default:
      wait = delay;
  }

  return new Date(Date.now() + wait);
}