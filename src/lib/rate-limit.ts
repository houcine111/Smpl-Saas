export class RateLimiter {
    private static instance: RateLimiter
    private stores: Map<string, { count: number; lastReset: number }> = new Map()

    private constructor() {
        // Nettoyage périodique pour éviter les fuites mémoire
        setInterval(() => {
            const now = Date.now()
            for (const [key, value] of this.stores.entries()) {
                if (now - value.lastReset > 600000) { // 10 minutes
                    this.stores.delete(key)
                }
            }
        }, 300000) // Toutes les 5 minutes
    }

    public static getInstance() {
        if (!RateLimiter.instance) {
            RateLimiter.instance = new RateLimiter()
        }
        return RateLimiter.instance
    }

    public isRateLimited(identifier: string, limit: number = 5, windowMsSize: number = 60000): boolean {
        const now = Date.now()
        const record = this.stores.get(identifier) || { count: 0, lastReset: now }

        if (now - record.lastReset > windowMsSize) {
            record.count = 1
            record.lastReset = now
            this.stores.set(identifier, record)
            return false
        }

        record.count += 1
        this.stores.set(identifier, record)
        return record.count > limit
    }
}
