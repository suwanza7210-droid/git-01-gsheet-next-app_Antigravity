//หน้านี้ใช้สำหรับจัดการข้อมูลพนักงานใน Google Sheets
import { NextRequest, NextResponse } from 'next/server';
import { getSheetData, updateSheetRow, deleteSheetRow } from '@/lib/google-sheets';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';

type EmployeeRow = [string, string, string, string, string, string];

// Helper เพื่อลดความซ้ำซ้อนในการดึง session และ sheetId
async function getSessionAndSheetId() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.use_sheet) {
        return { session: null, sheetId: null, error: NextResponse.json({ error: 'Unauthorized or Sheet ID not found' }, { status: 401 }) };
    }
    return { session, sheetId: session.user.use_sheet, error: null };
}

export async function GET(
    request: NextRequest,
    // context: { params: { employeeId: string } }
    { params }: { params: Promise<{ employeeId: string }> }
): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const tab = searchParams.get('tab') || 'Customers';

        // 1. ดึง employeeId ออกมาก่อน (sync)
        const { employeeId } = await params; // ดึง employeeId จาก params
        const { sheetId, error } = await getSessionAndSheetId();
        if (error) return error;

        // 2. แล้วค่อย await ใดๆ ต่อไป
        const values = await getSheetData(sheetId!, tab); // ใช้ helper function

        // ค้นหาพนักงานตาม ID
        const employee = values.find((row: string[]) => row[0].trim() === employeeId.trim());

        if (!employee) {
            return NextResponse.json({ error: 'Data not found' }, { status: 404 });
        }

        return NextResponse.json(employee as EmployeeRow);

    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

// อัปเดตข้อมูลพนักงาน  
export async function PUT(
    request: NextRequest,
    // context: { params: { employeeId: string } }
    { params }: { params: Promise<{ employeeId: string }> }
): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const tab = searchParams.get('tab') || 'Customers';

        // 1. ดึง employeeId ออกมาก่อน (sync)
        const { employeeId } = await params; // ดึง employeeId จาก params
        // 2. แล้วค่อย await ใดๆ ต่อไป
        const { sheetId, error: sessionError } = await getSessionAndSheetId();
        if (sessionError) return sessionError;

        // อัปเดตข้อมูลพนักงาน
        const updatedData = await request.json();

        const values = await getSheetData(sheetId!, tab);

        // ค้นหาดัชนีของพนักงาน
        const employeeIndex = values.findIndex((row: string[]) => row[0].trim() === employeeId.trim());

        if (employeeIndex === -1) {
            return NextResponse.json({ error: 'Data not found' }, { status: 404 });
        }

        // 3. อัปเดต logic ตามต้องการ
        // ปรับปรุง: ใช้ updateSheetRow เพื่อแก้ไขเฉพาะแถวที่มีประสิทธิภาพกว่า
        // Assuming updatedData matches structure or passing values
        let rowData: string[] = [];
        if (updatedData.values) {
            rowData = updatedData.values;
        } else {
            rowData = [
                updatedData.id?.trim() || values[employeeIndex][0], // keep original ID if missing
                updatedData.name?.trim() || '',
                updatedData.position?.trim() || updatedData.phone?.trim() || '',
                updatedData.department?.trim() || updatedData.email?.trim() || '',
                updatedData.createdAt || new Date().toISOString(),
                updatedData.image?.trim() || '',
            ];
        }

        await updateSheetRow(sheetId!, tab, employeeIndex, rowData);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error updating data:', error);
        return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
    }
}

// เพิ่ม DELETE method ; ลบข้อมูลพนักงานตาม ID
// ใช้ Next.js API route เพื่อจัดการลบข้อมูลพนักงานตาม ID
export async function DELETE(
    request: NextRequest,
    // context: { params: { employeeId: string } }
    { params }: { params: Promise<{ employeeId: string }> }
): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const tab = searchParams.get('tab') || 'Customers';

        // 1. ดึง employeeId ออกมาก่อน (sync)
        const { employeeId } = await params; // ดึง employeeId จาก params
        // 2. แล้วค่อย await ใดๆ ต่อไป

        const { sheetId, error: sessionError } = await getSessionAndSheetId();
        if (sessionError) return sessionError;

        const values = await getSheetData(sheetId!, tab);

        // ค้นหาดัชนีของพนักงาน
        const employeeIndex = values.findIndex((row: string[]) => row[0].trim() === employeeId.trim());

        if (employeeIndex === -1) {
            return NextResponse.json({ error: 'Data not found' }, { status: 404 });
        }

        // ปรับปรุง: ใช้ deleteSheetRow เพื่อลบแถวอย่างถูกต้องและมีประสิทธิภาพ
        await deleteSheetRow(sheetId!, tab, employeeIndex);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error deleting data:', error);
        return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
    }
}