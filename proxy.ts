import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// ตรวจสอบว่ามีการตั้งค่า Upstash Redis หรือไม่
const hasUpstashEnv =
    !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

const ratelimit = hasUpstashEnv
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(5, '1 m'), // จำกัด 5 requests ต่อ 1 นาที ต่อ IP
        analytics: true,
        prefix: 'rl:auth',
    })
    : null;

// ต้องใช้ชื่อฟังก์ชันว่า proxy
export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Guard เฉพาะ POST requests ที่อยู่ใต้ /api/auth/*
    if (req.method !== 'POST') return NextResponse.next();
    if (!pathname.startsWith('/api/auth/')) return NextResponse.next();

    // ถ้าไม่มี Upstash config → ปล่อยผ่าน (ใช้ใน dev/local)
    if (!ratelimit) return NextResponse.next();

    // อ่าน IP ของ client จาก headers
    const ipHeader =
        req.headers.get('x-forwarded-for') ||
        req.headers.get('cf-connecting-ip') ||
        req.headers.get('x-real-ip') ||
        '';
    const ip = ipHeader.split(',')[0]?.trim() || 'unknown';

    const key = `ip:${ip}`;
    let result;
    try {
        result = await ratelimit.limit(key);
    } catch (err) {
        console.warn('[proxy] Rate limit check failed, allowing request:', (err as Error)?.message);
        return NextResponse.next();
    }

    // ถ้าเกิน limit → ส่ง 429 พร้อม Retry-After
    if (!result.success) {
        const retryAfterSec = Math.max(
            1,
            Math.ceil((result.reset - Date.now()) / 1000)
        );
        return new NextResponse(
            JSON.stringify({ message: 'Too many login attempts. Please try again later.' }),
            {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': String(retryAfterSec),
                },
            }
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/api/auth/:path*'],
};
