// lib/auth.ts
// 1. นำเข้า dependencies
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { google } from 'googleapis';
import bcrypt from 'bcrypt';

// สร้าง client สำหรับเชื่อมต่อ Google Sheets เพียงครั้งเดียวเพื่อประสิทธิภาพที่ดีกว่า
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// ขีดจำกัดความยาว input เพื่อลดความเสี่ยง DoS และ overflow
const MAX_USERNAME_LENGTH = 100;
const MAX_PASSWORD_LENGTH = 128;

// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้จาก Google Sheets
async function getUserFromSheet(username: string) {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_USER_ID,
            range: 'Users!A:G', // คอลัมน์ A: id, B: passwordHash, C: name, D: use_sheet, E: image, F: address, G: role
        });

        const users = response.data.values || [];
        const userRow = users.find(row => row[0] === username);

        if (userRow) {
            return {
                id: userRow[0],
                passwordHash: userRow[1],
                name: userRow[2],
                use_sheet: userRow[3],
                image: userRow[4],
                address: userRow[5],
                role: userRow[6],
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching user from Google Sheet:', error);
        // โยน error ออกไปเพื่อให้ authorize function จัดการ
        throw new Error('Could not connect to the user database.');
    }
}

// 2. ประกาศ authOptions
export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    // ใน production ใช้ secure cookie เมื่อ deploy บน HTTPS
    useSecureCookies: process.env.NODE_ENV === 'production',
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }

                const username = credentials.username.trim();
                const password = credentials.password;

                if (username.length === 0 || username.length > MAX_USERNAME_LENGTH) {
                    return null;
                }
                if (password.length === 0 || password.length > MAX_PASSWORD_LENGTH) {
                    return null;
                }

                try {
                    const user = await getUserFromSheet(username);

                    if (!user || !user.passwordHash) {
                        // ไม่พบผู้ใช้
                        return null;
                    }

                    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

                    if (isPasswordValid) {
                        // ถ้าสำเร็จ, return object ที่จะถูกเก็บใน JWT (มี name สำหรับ defaultToken ของ NextAuth)
                        return {
                            id: user.id,
                            name: user.name ?? user.id,
                            use_sheet: user.use_sheet,
                            image: user.image,
                            address: user.address,
                            role: user.role,
                        };
                    }

                    return null; // รหัสผ่านไม่ถูกต้อง
                } catch (error) {
                    console.error("Authorize error:", error);
                    return null; // ส่งคืน null เมื่อเกิดข้อผิดพลาดในการเชื่อมต่อ
                }
            }
        })
    ],
    session: {
        strategy: 'jwt',
        maxAge: parseInt(process.env.NEXTAUTH_JWT_MAXAGE || '28800'), // 8 hours
    },
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async signIn() {
            // Credentials provider ไม่มี OAuth callback — ต้อง return true เพื่อให้ flow ทำงาน
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.use_sheet = user.use_sheet;
                token.picture = user.image; // Map image to standard JWT picture field
                token.address = user.address;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.id && token.use_sheet) {
                session.user.id = token.id;
                session.user.use_sheet = token.use_sheet;
                session.user.image = token.picture;
                session.user.address = token.address;
                session.user.role = token.role;
            }
            return session;
        },
    },
};

// 3. ส่งออก handler หลังประกาศทั้งหมด
export default NextAuth(authOptions);

