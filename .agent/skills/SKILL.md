---
name: NextAdmin CRM Dashboard UI
description: สร้าง UI แบบ Modern Admin Dashboard ด้วย Next.js และ Tailwind CSS ตามสไตล์ NextAdmin
---

# Frontend Skill: NextAdmin CRM Dashboard UI

คำสั่งสำหรับสร้าง UI ด้วย Next.js & Tailwind CSS เลียนแบบสไตล์ [NextAdmin](https://nextadmin.co/) และ [CRM Dashboard](https://demo.nextadmin.co/crm)

---

## 🎨 Design System & Color Palette

### Primary Colors
```css
/* NextAdmin-style Color Palette */
--primary: #3B82F6;        /* Blue 500 - Primary actions */
--primary-dark: #2563EB;   /* Blue 600 - Hover states */
--secondary: #8B5CF6;      /* Violet 500 - Accent */
--success: #22C55E;        /* Green 500 - Success states */
--warning: #F59E0B;        /* Amber 500 - Warning */
--danger: #EF4444;         /* Red 500 - Error/Delete */
--info: #06B6D4;           /* Cyan 500 - Info */
```

### Background Colors
```css
/* Light Mode */
--bg-primary: #FFFFFF;
--bg-secondary: #F8FAFC;   /* Slate 50 */
--bg-tertiary: #F1F5F9;    /* Slate 100 */

/* Dark Mode */
--bg-dark-primary: #1E293B;   /* Slate 800 */
--bg-dark-secondary: #0F172A; /* Slate 900 */
--bg-dark-card: #334155;      /* Slate 700 */
```

### Text Colors
```css
--text-primary: #1E293B;      /* Slate 800 */
--text-secondary: #64748B;    /* Slate 500 */
--text-muted: #94A3B8;        /* Slate 400 */
--text-dark-primary: #F8FAFC; /* Slate 50 */
```

---

## 📐 Layout Structure

### Standard Dashboard Layout
```
┌─────────────────────────────────────────────────────────┐
│ Header (h-16, sticky top-0, shadow-sm)                  │
├─────────┬───────────────────────────────────────────────┤
│         │                                               │
│ Sidebar │  Main Content Area                            │
│ (w-64)  │  (flex-1, p-6, bg-slate-50)                   │
│         │                                               │
│         │  ┌─────────────────────────────────────────┐  │
│         │  │ Page Title + Breadcrumb                 │  │
│         │  ├─────────────────────────────────────────┤  │
│         │  │ Stat Cards (grid-cols-4)                │  │
│         │  ├─────────────────────────────────────────┤  │
│         │  │ Charts & Tables                         │  │
│         │  └─────────────────────────────────────────┘  │
│         │                                               │
└─────────┴───────────────────────────────────────────────┘
```

### Responsive Breakpoints
```javascript
// Tailwind Breakpoints (NextAdmin Standard)
sm: '640px'   // Mobile landscape
md: '768px'   // Tablet
lg: '1024px'  // Desktop
xl: '1280px'  // Large desktop
2xl: '1536px' // Extra large
```

---

## 🧩 Core Components

### 1. Stat Card
```tsx
// แนวคิด: Card แสดงข้อมูลสถิติ พร้อม Icon และ Trend
<div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 
                flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
        <p className="text-sm font-medium text-gray-500">Label</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">1,234</p>
        <p className="text-xs text-green-500 mt-2 flex items-center">
            <ArrowUpIcon className="w-3 h-3 mr-1" />
            +12.5% from last month
        </p>
    </div>
    <div className="bg-blue-100 p-3 rounded-full text-blue-600">
        <Icon className="w-8 h-8" />
    </div>
</div>
```

### 2. Data Table
```tsx
// แนวคิด: Table แบบ Modern พร้อม Pagination, Search, Filter
<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    {/* Table Header */}
    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Table Title</h3>
        <div className="flex space-x-2">
            <SearchInput />
            <FilterButton />
        </div>
    </div>
    
    {/* Table Content */}
    <table className="w-full">
        <thead className="bg-gray-50">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium 
                              text-gray-500 uppercase tracking-wider">
                    Column
                </th>
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
            {/* Rows */}
        </tbody>
    </table>
    
    {/* Pagination */}
    <div className="px-6 py-4 border-t border-gray-100">
        <Pagination />
    </div>
</div>
```

### 3. Sidebar Navigation
```tsx
// แนวคิด: Sidebar แบบ Collapsible พร้อม Active State และ Icons
const navItems = [
    { name: 'Dashboard', icon: HomeIcon, href: '/dashboard' },
    { name: 'Customers', icon: UsersIcon, href: '/customers' },
    { name: 'Appointments', icon: CalendarIcon, href: '/appointments' },
];

<nav className="w-64 bg-white border-r border-gray-200 h-screen fixed">
    {navItems.map((item) => (
        <Link 
            href={item.href}
            className={cn(
                "flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50",
                "transition-colors border-l-4 border-transparent",
                isActive && "bg-blue-50 border-l-blue-500 text-blue-600"
            )}
        >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
        </Link>
    ))}
</nav>
```

### 4. Form Elements
```tsx
// Input Field
<div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">Label</label>
    <input 
        type="text"
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  placeholder-gray-400 transition-colors"
        placeholder="Enter value..."
    />
</div>

// Button Variants
<button className="px-4 py-2 bg-blue-500 text-white rounded-lg 
                  hover:bg-blue-600 transition-colors font-medium">
    Primary
</button>
<button className="px-4 py-2 bg-white text-gray-700 rounded-lg border 
                  border-gray-300 hover:bg-gray-50 transition-colors font-medium">
    Secondary
</button>
```

---

## 📊 CRM Dashboard Specific Components

### Lead Pipeline Card
```tsx
<div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Lead Pipeline</h3>
    <div className="space-y-4">
        {stages.map((stage) => (
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${stage.color} mr-3`} />
                    <span className="text-gray-700">{stage.name}</span>
                </div>
                <span className="font-semibold text-gray-800">{stage.count}</span>
            </div>
        ))}
    </div>
</div>
```

### Activity Timeline
```tsx
<div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
    <div className="space-y-4">
        {activities.map((activity) => (
            <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center 
                              justify-center text-blue-600 shrink-0">
                    <ActivityIcon className="w-5 h-5" />
                </div>
                <div className="ml-4">
                    <p className="text-sm text-gray-800">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
            </div>
        ))}
    </div>
</div>
```

---

## ✅ Development Guidelines

### การตั้งชื่อ Classes
- ใช้ Tailwind utility classes โดยตรง
- หลีกเลี่ยง custom CSS ยกเว้นจำเป็น
- ใช้ `@apply` ใน CSS สำหรับ reusable patterns

### Responsive Design
- Mobile-first approach
- ใช้ `lg:` prefix สำหรับ desktop layouts
- Sidebar ซ่อนบน mobile (`lg:block hidden`)

### Animation & Transitions
```css
/* Standard Transitions */
transition-colors     /* สำหรับ hover states */
transition-shadow     /* สำหรับ card hover */
transition-transform  /* สำหรับ scale effects */

/* Duration */
duration-150  /* Fast (buttons) */
duration-200  /* Medium (cards) */
duration-300  /* Slow (modals) */
```

### Dark Mode Support
```tsx
// ใช้ dark: prefix
<div className="bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100">
    Content
</div>
```

---

## 📁 Project Structure
```
app/
├── dashboard/
│   ├── page.tsx          # Main Dashboard
│   ├── customers/        # Customer management
│   ├── appointments/     # Appointments
│   └── layout.tsx        # Dashboard layout with sidebar
components/
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── Table.tsx
├── dashboard/
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   └── StatCard.tsx
└── charts/
    └── LineChart.tsx
```

---

## 🔗 References
- [NextAdmin Demo](https://demo.nextadmin.co/crm)
- [NextAdmin Components](https://nextadmin.co/components)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Heroicons](https://heroicons.com/) - Icon library
