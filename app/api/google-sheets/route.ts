import { NextRequest, NextResponse } from 'next/server';
import { appendDataToSheet, getSheetData, getSheetHeaders, updateSheetRow, deleteSheetRow } from '@/lib/google-sheets';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Helper เพื่อลดความซ้ำซ้อนในการดึง session และ sheetId
async function getSessionAndSheetId() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.use_sheet) {
        return { sheetId: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
    }
    return { sheetId: session.user.use_sheet, error: null };
}

// GET - ดึงข้อมูลจาก Sheet ที่ระบุ (default: Customers) พร้อมกับ headers
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const tab = searchParams.get('tab') || 'Customers'; // Default tab

        const { sheetId, error: sessionError } = await getSessionAndSheetId();
        if (sessionError) return sessionError;

        // ดึงทั้ง headers และ data
        const headers = await getSheetHeaders(sheetId!, tab);
        const data = await getSheetData(sheetId!, tab);

        // ส่ง response เป็น object ที่มี headers และ data
        return NextResponse.json({
            headers,
            data
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch data' },
            { status: 500 }
        );
    }
}

// POST - เพิ่มข้อมูลใหม่
export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const tab = searchParams.get('tab') || 'Customers';

        const body = await request.json();
        const { sheetId, error: sessionError } = await getSessionAndSheetId();
        if (sessionError) return sessionError;

        // ดึงข้อมูลทั้งหมดเพื่อตรวจสอบรหัสซ้ำ (assumes first column is ID)
        const allData = await getSheetData(sheetId!, tab);
        const existingIds = allData.map(row => row[0].toLowerCase());

        // body.id might not exist for some forms, but assuming ID based forms for now
        if (body.id && existingIds.includes(body.id.toLowerCase())) {
            return NextResponse.json(
                { error: 'รหัสนี้มีอยู่แล้ว' },
                { status: 409 }
            );
        }

        let rowData: string[] = [];
        if (Array.isArray(body)) {
            rowData = body;
        } else {
            // Fallback for backward compatibility if possible, or expect specific fields
            if (body.values) {
                rowData = body.values;
            } else {
                // Backward compat (Employees/Customers)
                rowData = [
                    body.id?.trim() || '',
                    body.name?.trim() || '',
                    body.position?.trim() || body.phone?.trim() || '', // reuse field
                    body.department?.trim() || body.email?.trim() || '', // reuse field
                    new Date().toISOString(),
                    body.image?.trim() || '',
                ];
            }
        }

        await appendDataToSheet(sheetId!, tab, rowData);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error adding data:', error);
        return NextResponse.json(
            { error: 'Failed to add data' },
            { status: 500 }
        );
    }
}

// PATCH - แก้ไขข้อมูลพนักงาน
export async function PATCH(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const tab = searchParams.get('tab') || 'Customers';

        const { rowIndex, ...employeeData } = await request.json(); // rowIndex คือดัชนีของแถวที่ต้องการแก้ไข ใน google sheets
        const { sheetId, error: sessionError } = await getSessionAndSheetId();
        if (sessionError) return sessionError;

        let rowData: string[] = [];
        if (employeeData.values) {
            rowData = employeeData.values;
        } else {
            rowData = [
                employeeData.id?.trim() || '',
                employeeData.name?.trim() || '',
                employeeData.position?.trim() || employeeData.phone?.trim() || '',
                employeeData.department?.trim() || employeeData.email?.trim() || '',
                new Date().toISOString(),
                employeeData.image?.trim() || '',
            ];
        }

        await updateSheetRow(sheetId!, tab, rowIndex, rowData);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating employee:', error);
        return NextResponse.json(
            { error: 'Failed to update employee' },
            { status: 500 }
        );
    }
}

// DELETE - ลบข้อมูลพนักงาน (ลบจริงใน Google Sheets)
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const tab = searchParams.get('tab') || 'Customers';

        const { rowIndex } = await request.json(); // rowIndex คือดัชนีของแถวที่ต้องการลบ ใน google sheets
        const { sheetId, error: sessionError } = await getSessionAndSheetId();
        if (sessionError) return sessionError;

        await deleteSheetRow(sheetId!, tab, rowIndex);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting employee:', error);
        return NextResponse.json(
            { error: 'Failed to delete employee' },
            { status: 500 }
        );
    }
}