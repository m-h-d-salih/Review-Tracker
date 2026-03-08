# 📋 Intern Review Tracker

A Next.js 14 + TypeScript + Supabase app for SDE reviewers to track intern/student review sessions with monthly PDF exports.

---

## ✨ Features

| Feature | Detail |
|---|---|
| **Entry types** | Review (default), Single Session, Group Session, Group Project |
| **Stats cards** | Live counts per type for the selected month |
| **Month/Year picker** | Navigate any historical month |
| **PDF export** | Downloads a formatted report for the selected month |
| **Delete** | Hover a row → Delete button appears |

---

## 🚀 Setup

### 1. Clone & install

```bash
git clone <your-repo>
cd intern-review-tracker
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**
2. Open **SQL Editor** → paste the contents of `supabase/schema.sql` → Run

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Find these values in: **Supabase Dashboard → Settings → API**

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
intern-review-tracker/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main dashboard
│   └── globals.css         # Tailwind + global styles
├── components/
│   ├── StatsCards.tsx      # 4 summary stat cards
│   ├── ReviewTable.tsx     # Sortable data table
│   ├── AddReviewModal.tsx  # Add-entry form modal
│   └── MonthYearPicker.tsx # Month/year navigation
├── lib/
│   ├── supabase.ts         # Supabase client
│   └── exportPDF.ts        # jsPDF PDF export
├── types/
│   └── index.ts            # Shared TypeScript types
└── supabase/
    └── schema.sql          # Database schema
```

---

## 🏗️ Database Schema

```sql
reviews (
  id           uuid PRIMARY KEY,
  intern_name  text NOT NULL,
  type         text CHECK (type IN ('review','session','group_session','group_project')),
  advisor_name text NOT NULL,
  review_date  date NOT NULL DEFAULT current_date,
  notes        text,
  created_at   timestamptz DEFAULT now()
)
```

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `next` | React framework |
| `@supabase/supabase-js` | Database client |
| `jspdf` + `jspdf-autotable` | PDF generation |
| `tailwindcss` | Styling |
