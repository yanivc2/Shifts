# CLAUDE.md — Shifts

## כללי עבודה (חובה)
- לא מוחקים קבצים, נתונים או רשומות בלי אישור מפורש של המשתמש.
- לא משנים קוד בלי אישור מפורש. קודם אבחון והצעה, ורק אז עריכה.
- שינויי DB ב-Supabase: רק תוספות (טבלה/פונקציה חדשה). לשנות או למחוק אובייקט קיים רק באישור.
- תשובות קצרות וענייניות. אם לא בטוחים — לשאול, לא לנחש.

## מבנה הפרויקט
- אפליקציית PWA בקובץ אחד: `index.html` (HTML + CSS + JS inline, בלי build).
- `welcome.html`, `guide.html` — דפי עובד והדרכה. `sw.js`, `manifest.json` — PWA.
- `index 2.html` — גרסה ישנה, לא בשימוש פעיל.
- Backend: Supabase (פרויקט `ejdchhqnsckvaleoklnq`). פונקציות ה-SQL (RPC) **לא נמצאות בריפו** — לקרוא אותן מה-DB (`pg_get_functiondef`).

## נתונים
- `store_data.data` (jsonb) לכל סניף: `employees`, `sched[week][cell]`, `fixed[cell]`, `avail`, `name`.
- `cell` = `"<יום 0-6>-<m|e|n>"`. `fixed` = תבנית משמרות קבועות (📌) שממלאת כל שבוע שאין לו ערך מפורש.
- כתיבה מהלקוח דרך RPC: `set_sched_cell`, `set_fixed_cell`, `set_avail_cell` (כל חבר סניף), `set_employees` (בעלים), `mgr_set_employees` (שותף/מנהל — חוסם מחיקה).

## תפקידים והרשאות
- `store_members.role`: `owner` (בעלים), `coowner` (שותף), `manager` (מנהל).
- מחיקת עובד: בעלים, או משתמש שיש לו שורה ב-`emp_delete_grants` לאותו סניף.
  - בדיקה בשרת: `can_delete_emps(store)`. מחיקה למי שאינו בעלים: RPC `delete_employee(store, emp_id)` — מסיר את העובד מ-`employees`, מ-`fixed` ומכל השבועות ב-`sched`.
  - בלקוח: `canDeleteEmps(locId)` ב-`index.html`, נטען מ-`emp_delete_grants` בזמן הטעינה.
  - הרשאה קיימת: אלעד (`elad2024`) בסניף "גוניור".
  - הענקת הרשאה (SQL Editor):
    ```sql
    insert into public.emp_delete_grants(store_id,user_id)
    select m.store_id, m.user_id from public.store_members m
      join auth.users u on u.id=m.user_id join public.stores s on s.id=m.store_id
     where u.email='<username>@shifts.local' and s.name='<שם הסניף>';
    ```

## בדיקות
- אין בדיקות אוטומטיות. לפני commit: לחלץ את ה-`<script>` ולהריץ `node --check`, ולבדוק התנהגות ב-Playwright (מותקן מראש).
