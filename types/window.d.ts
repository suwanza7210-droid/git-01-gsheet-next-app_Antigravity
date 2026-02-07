
// This file tells TypeScript that the global Window object will have
// an 'api' property, which is defined in our preload.js script.

// Define the shape of the API that we are exposing from the preload script
export interface IElectronAPI {
  getEmployees: () => Promise<string[][] | { error: string }>;
  addEmployee: (employeeData: unknown) => Promise<{ success: boolean; error?: string }>;
  updateEmployee: (employeeData: unknown) => Promise<{ success: boolean; error?: string }>;
  deleteEmployee: (rowIndex: number) => Promise<{ success: boolean; error?: string }>;
}

// Extend the global Window interface
declare global {
  interface Window {
    api: IElectronAPI;
  }
}
