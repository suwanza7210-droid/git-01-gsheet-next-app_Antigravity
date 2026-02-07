
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Renderer to Main
  getEmployees: () => ipcRenderer.invoke('get-employees'),
  addEmployee: (employeeData) => ipcRenderer.invoke('add-employee', employeeData),
  updateEmployee: (employeeData) => ipcRenderer.invoke('update-employee', employeeData),
  deleteEmployee: (rowIndex) => ipcRenderer.invoke('delete-employee', rowIndex),

  // Add any other functions you need to expose
});
