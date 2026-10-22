import { Redis } from '@upstash/redis'

// Automatically loads UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
export const redis = Redis.fromEnv()
