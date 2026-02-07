import { useRef, useEffect, useState, useCallback } from 'react';

// hooks/useIdleFetch.ts

interface UseIdleFetchOptions {
    /** เวลาที่รอเพื่อจะนับว่าผู้ใช้ idle (ms) */
    idleThreshold?: number;
    /** Cooldown ระหว่างการ fetch เพื่อป้องกันการเรียก API ถี่เกินไป (ms) */
    fetchCooldown?: number;
    /** ดึงข้อมูลเมื่อ component โหลดเสร็จหรือไม่ */
    onMount?: boolean;
    /** ดึงข้อมูลเมื่อผู้ใช้หยุดใช้งาน (idle) หรือไม่ */
    onIdle?: boolean;
    /** ดึงข้อมูลเมื่อผู้ใช้กลับมาใช้งาน (active) หรือไม่ */
    onActive?: boolean;
}

/**
 * Custom hook ที่ดึงข้อมูลตามสถานะการใช้งานของผู้ใช้ โดยสามารถเลือกเปิด/ปิดการทำงานแต่ละส่วนได้
 * @param fetchFn ฟังก์ชันสำหรับดึงข้อมูล
 * @param options ตัวเลือกสำหรับปรับแต่งการทำงาน
 */
export function useIdleFetch(
    fetchFn: () => void,
    options: UseIdleFetchOptions = {}
): boolean {
    const {
        idleThreshold = 5000,
        fetchCooldown = 5000,
        onMount = true,
        onIdle = true,
        onActive = true,
    } = options;

    const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isIdle, setIsIdle] = useState(false);
    const isMounted = useRef(false);
    const lastFetchTime = useRef(0);

    const fetchFnRef = useRef(fetchFn);
    useEffect(() => {
        fetchFnRef.current = fetchFn;
    }, [fetchFn]);

    const throttledFetch = useCallback(() => {
        const now = Date.now();
        if (now - lastFetchTime.current > fetchCooldown) {
            lastFetchTime.current = now;
            fetchFnRef.current();
        }
    }, [fetchCooldown]);

    // Effect ที่จะทำงานเมื่อสถานะ idle เปลี่ยนแปลง
    useEffect(() => {
        if (!isMounted.current) return;

        // ดึงข้อมูลเมื่อผู้ใช้ idle (ถ้าเปิดใช้งาน)
        if (isIdle && onIdle) {
            throttledFetch();
        }
        // ดึงข้อมูลเมื่อผู้ใช้ active (ถ้าเปิดใช้งาน)
        if (!isIdle && onActive) {
            throttledFetch();
        }
    }, [isIdle, onIdle, onActive, throttledFetch]);

    const handleIdle = useCallback(() => {
        setIsIdle(true);
    }, []);

    const handleActivity = useCallback(() => {
        if (isIdle) {
            setIsIdle(false);
        }
        if (idleTimer.current) {
            clearTimeout(idleTimer.current);
        }
        idleTimer.current = setTimeout(handleIdle, idleThreshold);
    }, [isIdle, handleIdle, idleThreshold]);

    // Effect หลักสำหรับจัดการ event listeners และการ fetch ตอน mount
    useEffect(() => {
        // ดึงข้อมูลครั้งแรกเมื่อ mount (ถ้าเปิดใช้งาน)
        if (onMount) {
            throttledFetch();
        }
        isMounted.current = true;

        const events: (keyof WindowEventMap)[] = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
        handleActivity();
        events.forEach(evt => window.addEventListener(evt, handleActivity, { capture: true, passive: true }));

        return () => {
            if (idleTimer.current) clearTimeout(idleTimer.current);
            events.forEach(evt => window.removeEventListener(evt, handleActivity, { capture: true }));
        };
    }, [handleActivity, onMount, throttledFetch]);

    return isIdle;
}