import { google } from 'googleapis';

// สร้างตัวแปร auth สำหรับการเข้าถึง Google Sheets API แบบต่างๆ
//=> จาก DeepSeek
// const auth = new google.auth.JWT(
//     process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
//     undefined,
//     process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//     ['https://www.googleapis.com/auth/spreadsheets']
// );
// ...existing code...

//=> การยืนยันตัวตน (auth)  จาก Gimini
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL, // อีเมลของ Service Account
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'), // ต้องแทนที่ \n ด้วย \n จริงๆ
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'], // สิทธิ์ที่ต้องการเข้าถึง Google Sheets
});

//=> การยืนยันตัวตน (auth) จาก Copilot
// const auth = new google.auth.GoogleAuth({
//     keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS, // path to your service account json
//     scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// });

// ============================================================ 

export const sheets = google.sheets({ version: 'v4', auth });

//appendDataToSheet ใช้เพิ่มข้อมูลใหม่ลงใน Google Sheets
export const appendDataToSheet = async (spreadsheetId: string, sheetName: string, data: string[]) => {
    const response = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A2:F`, // ใช้ sheetName ที่ส่งมา
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [data] },
    });
    return response.data;
};

//getSheetHeaders ใช้ดึงแถวแรก (headers) จาก Google Sheets
export const getSheetHeaders = async (spreadsheetId: string, sheetName: string) => {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A1:Z1`, // ดึงแค่แถวแรก
    });
    return response.data.values?.[0] || [];
};

//getSheetData ใช้ดึงข้อมูลจาก Google Sheets
export const getSheetData = async (spreadsheetId: string, sheetName: string) => {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A2:Z`, // ดึงข้อมูลกว้างขึ้นรองรับหลายคอลัมน์
    });
    return response.data.values || [];
};

// updateSheetRow ใช้แก้ไขข้อมูลในแถวที่ระบุ
// rowIndex คือดัชนีของแถวที่ต้องการแก้ไข (เริ่มจาก 0)
export const updateSheetRow = async (spreadsheetId: string, sheetName: string, rowIndex: number, data: string[]) => {
    const range = `${sheetName}!A${rowIndex + 2}`; // +2 เพราะแถวแรกเป็น header
    const response = await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [data] },
    });
    return response.data;
}

// deleteSheetRow ใช้ลบข้อมูลในแถวที่ระบุ
export const deleteSheetRow = async (spreadsheetId: string, sheetName: string, rowIndex: number) => {
    // ต้องหา sheetId (GID) ของ sheetName ก่อน เพราะ batchUpdate ใช้ sheetId เป็น number ไม่ใช่ชื่อ string
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const sheet = spreadsheet.data.sheets?.find(s => s.properties?.title === sheetName);

    if (!sheet || typeof sheet.properties?.sheetId !== 'number') {
        throw new Error(`Sheet with name "${sheetName}" not found or invalid`);
    }

    const sheetId = sheet.properties.sheetId;

    await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
            requests: [
                {
                    deleteDimension: {
                        range: {
                            sheetId: sheetId,
                            dimension: 'ROWS',
                            startIndex: rowIndex + 1, // +1 ถ้าแถวแรกเป็น header
                            endIndex: rowIndex + 2,
                        },
                    },
                },
            ],
        },
    });
};