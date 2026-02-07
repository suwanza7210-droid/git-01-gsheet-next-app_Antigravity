import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// ป้องกัน cache — NextAuth ต้องรับ request แบบ dynamic
export const dynamic = 'force-dynamic';

const handler = NextAuth(authOptions);

// NextAuth v4 กับ App Router: ต้อง export ทั้ง GET และ POST
export { handler as GET, handler as POST };

