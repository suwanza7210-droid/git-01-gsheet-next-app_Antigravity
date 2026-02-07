import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { getSheetData, appendDataToSheet, updateSheetRow, deleteSheetRow } from './lib/google-sheets';

const isDev = process.env.NODE_ENV === 'development';

// Hardcoded for now. We will replace this with a proper session management later.
const MOCKED_SESSION = {
  sheetId: process.env.GOOGLE_SHEET_ID || 'YOUR_FALLBACK_SHEET_ID_HERE' // Replace with a real Sheet ID for testing
};

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js') // Use the preload script
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    const url = new URL(path.join(__dirname, 'out', 'index.html'), 'file:');
    win.loadURL(url.toString());
    // win.webContents.openDevTools(); // You can uncomment this for debugging the production build
  }
}

// --- IPC Handlers for Google Sheets --- 

ipcMain.handle('get-employees', async () => {
  try {
    const data = await getSheetData(MOCKED_SESSION.sheetId);
    return data;
  } catch (error) {
    console.error('IPC Error - get-employees:', error);
    return { error: 'Failed to fetch data' };
  }
});

ipcMain.handle('add-employee', async (event, employeeData) => {
  try {
    await appendDataToSheet(MOCKED_SESSION.sheetId, [
      employeeData.id,
      employeeData.name,
      employeeData.position,
      employeeData.department,
      new Date().toISOString(),
      employeeData.image,
    ]);
    return { success: true };
  } catch (error) {
    console.error('IPC Error - add-employee:', error);
    return { error: 'Failed to add employee' };
  }
});

ipcMain.handle('update-employee', async (event, { rowIndex, ...employeeData }) => {
  try {
    await updateSheetRow(MOCKED_SESSION.sheetId, rowIndex, [
      employeeData.id,
      employeeData.name,
      employeeData.position,
      employeeData.department,
      new Date().toISOString(),
      employeeData.image,
    ]);
    return { success: true };
  } catch (error) {
    console.error('IPC Error - update-employee:', error);
    return { error: 'Failed to update employee' };
  }
});

ipcMain.handle('delete-employee', async (event, rowIndex) => {
  try {
    await deleteSheetRow(MOCKED_SESSION.sheetId, rowIndex);
    return { success: true };
  } catch (error) {
    console.error('IPC Error - delete-employee:', error);
    return { error: 'Failed to delete employee' };
  }
});


app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// No need to manage a separate server process anymore
app.on('before-quit', () => {});
