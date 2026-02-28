# WYSHKIT 2026: Supabase SQL Backup

Backup of SQL used by the app. Run in **Supabase Dashboard > SQL Editor**.

## Files

| File | Purpose |
|------|---------|
| `01_partner_flow.fsql` | Partner/vendor linking: `resolve_user_permissions`, `get_vendor_from_session`, `vendor_users` |
| `02_app_queries_backup.fsql` | Reference of all GET/POST operations (SELECT, INSERT, UPDATE, DELETE) used by the app |
| `03_transition_order_partner_fix.fsql` | Fix for `transition_order` if it fails on `users.role` (use `user_roles` instead) |
| `04_schema_tables_columns.fsql` | All tables with column names and types (comment format) |
| `05_create_tables_reference.fsql` | Executable CREATE TABLE statements for fresh DB or reference |
| `06_fix_otp_signup_handle_new_user.fsql` | Fixes "Database error saving new user" on OTP/phone signup |

## Order to Run

1. **01_partner_flow.fsql** – Restore partner RPCs and vendor_users logic
2. **03_transition_order_partner_fix.fsql** – Only if order status changes fail with role errors

## Adding a Partner to a Vendor

```sql
INSERT INTO public.vendor_users (user_id, vendor_id, role)
VALUES ('USER_UUID'::UUID, 'VENDOR_UUID'::UUID, 'partner')
ON CONFLICT (user_id, vendor_id) DO NOTHING;
```

Ensure `vendor_users` has `UNIQUE(user_id, vendor_id)` if using ON CONFLICT.
