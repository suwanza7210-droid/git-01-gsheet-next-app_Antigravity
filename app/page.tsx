//- ใช้ Google Sheet เป็นฐานข้อมูลสำหรับจัดการพนักงาน ในบัญชีนี้ 
// Google API   บัญชี wanprosoft@gmail.com ที่ https://console.cloud.google.com/
// Google Sheet บัญชี wanprosoft@gmail.com ที่พาท GoogleSheets/NEXTjs/ข้อมูลพนักงาน 
// ----------------------------------------------------------------------------

// Google API   บัญชี suwanza7210@gmail.com ที่ https://console.cloud.google.com/
// Google Sheet บัญชี suwanza7210@gmail.com ที่พาท ไดรฟ์ของฉัน/Programming/ProjNEXTjs/GoogleSheets/SDentDB/รหัสผู้ใช้โปรแกรม_SDent_ทั้งหมด 
// ----------------------------------------------------------------------------

//ตั้งค่าใน google sheet ไม่ให้ column:A  สามารถบันทึกข้อมูลซ้ำได้
//ถาม AI : Gemini "ใน google sheet ต้องการไม่ให้บันทึกข้อมูลซ้ำเฉพาะ column : A เท่านั้น อธิบายแบบละเอียดครับ"

// import Image from "next/image";
import { redirect } from "next/navigation";

export default function RootLayout() {
  redirect('/login'); // เปลี่ยนเส้นทางไปยังหน้า login
  return null; // ไม่ต้องแสดงอะไรในหน้า home
}
