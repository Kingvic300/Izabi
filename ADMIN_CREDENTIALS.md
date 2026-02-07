# Admin Panel Login Credentials

## ✅ Admin Account Status: ACTIVE & VERIFIED

The admin account has been successfully created in the database and is ready to use!

---

## Default Admin Account

### Email
```
admin@izabi.com
```

### Password
```
IzabiAdmin@2024
```

---

## Admin Panel Access

1. **Login URL**: Navigate to `/login` in your application
2. **Enter the credentials above**
3. **Automatic Redirect**: You will be automatically redirected to `/dashboard/admin`
   - Admin users are detected by their `ADMIN` role
   - Regular users go to `/dashboard`
   - Admin users go to `/dashboard/admin`
4. **Protected Route**: Only users with ADMIN role can access the admin dashboard
   - Regular users trying to access `/dashboard/admin` will be redirected to `/dashboard`

---

## Important Notes

### ✅ Account Details
- **Role**: ADMIN
- **Status**: Verified
- **Name**: System Administrator
- **Created**: Successfully seeded in MongoDB

### Security Recommendations
- ⚠️ **Change the default password immediately in production**
- 🔒 Use a strong,unique password for live environments
- 🔐 Enable two-factor authentication when available
- 📝 Keep credentials in a secure password manager
- 🚫 **Never commit this file to public repositories**

### Admin Permissions
The admin account has full access to:
- ✅ User management and monitoring
- ✅ System statistics and analytics
- ✅ API key inventory
- ✅ Security logs and audit trails
- ✅ Full database operations
- ✅ Admin Dashboard at `/admin/dashboard`

### Re-seeding Admin Account
If you need to recreate the admin account:
```bash
cd izabi-backend
npm run seed:admin
```

This will create the admin user if it doesn't exist, or verify/update it if it does.

---

**Last Updated**: February 7, 2026  
**Environment**: Development  
**Status**: ✅ ACTIVE
