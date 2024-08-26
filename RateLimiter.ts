class RateLimiter {
  private attempts: Map<string, number[]>;
  private maxAttempts: number;
  private timeFrameMilliseconds: number;

  constructor(maxAttempts: number = 5, timeFrame: number = 60 * 1000) {
    this.attempts = new Map();
    this.maxAttempts = maxAttempts;
    this.timeFrameMilliseconds = timeFrame;
  }

  public isAllowed(userId: string): boolean {
    const currentTime = Date.now();

    if (!this.attempts.has(userId)) {
      this.attempts.set(userId, [currentTime]);
      return true;
    }

    const userAttempts = this.attempts.get(userId) as number[];

    const recentAttempts = userAttempts.filter(
      time => currentTime - time <= this.timeFrameMilliseconds
    );

    if (recentAttempts.length < this.maxAttempts) {
      recentAttempts.push(currentTime);
      this.attempts.set(userId, recentAttempts);
      return true;
    }

    return false;
  }
}
// 3 attempts allowed per 60 seconds
const rateLimiter = new RateLimiter(3, 60 * 1000); 

console.log(rateLimiter.isAllowed('user1')); // true
console.log(rateLimiter.isAllowed('user1')); // true
console.log(rateLimiter.isAllowed('user1')); // true
console.log(rateLimiter.isAllowed('user1')); // false
