"use client"

/**
 * Admin Data Cache - avoids redundant API calls across admin pages.
 * 
 * When the admin layout mounts, it kicks off all API fetches in parallel.
 * Child pages call `useAdminData(url)` which returns the cached promise
 * instead of starting a new fetch. This eliminates the 5-7 second delay
 * caused by sequential: session check → page render → useEffect fetch → API auth → DB query.
 */

const cache = new Map<string, Promise<any>>()

/** Start fetching a URL (deduplicates in-flight requests) */
export function prefetch(url: string): Promise<any> {
  if (cache.has(url)) return cache.get(url)!
  
  const promise = fetch(url, { cache: "no-store" })
    .then(async res => {
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Request failed")
      return data
    })
    .catch(err => {
      // Remove from cache on error so it can be retried
      cache.delete(url)
      throw err
    })
  
  cache.set(url, promise)
  return promise
}

/** Invalidate a cached URL so next call re-fetches */
export function invalidate(url: string) {
  cache.delete(url)
}

/** Prefetch all common admin endpoints in parallel */
export function prefetchAllAdminData() {
  const urls = [
    "/api/students",
    "/api/batches",
    "/api/buyer",
    "/api/supplier",
    "/api/contact",
    "/api/blog",
    "/api/demo-class/config",
    "/api/class-links",
    "/api/class-recordings",
  ]
  urls.forEach(url => prefetch(url))
}
