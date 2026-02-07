/**
 * จัดรูปแบบวันที่ให้เป็นรูปแบบภาษาไทย
 * @param dateString วันที่ในรูปแบบ ISO string
 * @returns วันที่ในรูปแบบ "วัน เดือน ปี พ.ศ. เวลา"
 */
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    // ตัวย่อเดือนภาษาไทย
    const thaiMonths = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.',
        'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.',
        'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];

    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543;
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day} ${month} ${year} ${hours}:${minutes}`;
};
/**
 * แปลงวันที่เป็นรูปแบบที่เข้าใจง่าย
 * @param dateString วันที่ในรูปแบบ ISO string
 * @returns วันที่ในรูปแบบ "วัน เดือน ปี"
 */
