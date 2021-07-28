export default function throttle (callback: (...rest: any[]) => Promise<any> | void, limit: number) {
    var wait = false;                  // Initially, we're not waiting
    return function (...rest: any[]) {               // We return a throttled function
        if (!wait) {                   // If we're not waiting
            wait = true;               // Prevent future invocations
            setTimeout(function () {   // After a period of time
                wait = false;          // And allow future invocations
                callback(...rest);     // Execute users function
            }, limit);
        }
    }
}