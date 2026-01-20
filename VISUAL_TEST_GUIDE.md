# Visual Test Guide - Navigation & UI

## Current Server Status

✅ **Backend:** Running on http://localhost:3000 (Process ID: 3)
✅ **Frontend:** Running on http://localhost:5174 (Process ID: 5)

## Test Credentials

```
Email: demo@example.com
Password: password123
```

## Quick Visual Test Checklist

### 1. Login Page Test (No Sidebar Expected)
**URL:** http://localhost:5174/login

**Expected:**
- [ ] Clean login form centered on page
- [ ] No sidebar visible (this is correct!)
- [ ] "ExpectedEstate" logo at top
- [ ] Email and password fields
- [ ] "Sign In" button
- [ ] Link to register page

**Why no sidebar?** Authentication pages are standalone by design.

---

### 2. Dashboard Test (Sidebar Should Appear)
**URL:** http://localhost:5174/dashboard (after login)

**Expected Desktop View (≥1024px):**
- [ ] **Left Sidebar (288px width):**
  - [ ] "ExpectedEstate" logo at top
  - [ ] 9 navigation menu items with icons
  - [ ] "Overview" highlighted in blue (active state)
  - [ ] User avatar and name at bottom
  - [ ] "Sign Out" button at bottom
  
- [ ] **Main Content Area:**
  - [ ] Header with "Overview" title
  - [ ] User avatar dropdown in top-right
  - [ ] Estate cards showing data
  - [ ] Generous spacing (32px padding)
  - [ ] Soft colors (calm blue, gentle green)

**Expected Mobile View (<1024px):**
- [ ] **No sidebar visible** (collapsed)
- [ ] **Hamburger menu** button in top-left
- [ ] **Header** with page title
- [ ] **User avatar** in top-right
- [ ] **Full-width content** area

---

### 3. Navigation Menu Items Test

Click each menu item and verify:

#### 3.1 Overview (/dashboard)
- [ ] LayoutDashboard icon visible
- [ ] Blue background when active
- [ ] Shows estate summary cards
- [ ] Shows asset counts

#### 3.2 Scan Intake (/intake)
- [ ] FolderOpen icon visible
- [ ] Page loads without errors
- [ ] Upload interface visible

#### 3.3 Assets (/assets)
- [ ] Grid icon visible
- [ ] Asset list displays
- [ ] Can click on assets

#### 3.4 Digital Vault (/digital-assets)
- [ ] Lock icon visible
- [ ] Digital assets page loads

#### 3.5 Detective (/discovery)
- [ ] Search icon visible
- [ ] Discovery interface loads

#### 3.6 Checklist (/checklist)
- [ ] CheckSquare icon visible
- [ ] Checklist items display

#### 3.7 Documents (/documents)
- [ ] FileText icon visible
- [ ] Document list displays

#### 3.8 Communications (/communications)
- [ ] MessageSquare icon visible
- [ ] Communication log displays

#### 3.9 Family & Updates (/family)
- [ ] Users icon visible
- [ ] Family page loads

---

### 4. Mobile Menu Test

**Steps:**
1. Resize browser to mobile width (<768px)
2. Click hamburger menu (☰) in top-left
3. Verify sidebar slides in from left
4. Click a menu item
5. Verify sidebar closes
6. Verify page navigates

**Expected:**
- [ ] Hamburger menu button visible on mobile
- [ ] Sidebar slides in smoothly (Sheet component)
- [ ] All 9 menu items visible in mobile menu
- [ ] Clicking menu item closes sidebar
- [ ] Navigation works correctly

---

### 5. User Dropdown Test

**Steps:**
1. Click user avatar in top-right corner
2. Verify dropdown menu appears
3. Check menu items

**Expected:**
- [ ] Dropdown appears below avatar
- [ ] Shows user name: "Executor Person"
- [ ] Shows user email: "demo@example.com"
- [ ] "Profile" option visible
- [ ] "Log out" option visible (red text)
- [ ] Clicking "Log out" redirects to /login

---

### 6. Asset Detail Page Test (With Forms)

**URL:** http://localhost:5174/assets/1 (or any asset ID)

**Expected:**
- [ ] Sidebar still visible
- [ ] Asset information card
- [ ] Communication log section
- [ ] Forms library section (NEW!)
- [ ] "Send Fax" buttons for forms
- [ ] Generous spacing throughout

---

### 7. Empathetic Design Verification

#### Color Palette Check:
- [ ] **Primary blue:** Calm, not aggressive (hsl(237 84% 60%))
- [ ] **Background:** Clean white with soft gray accents
- [ ] **Text:** Dark gray, not harsh black
- [ ] **Success green:** Gentle, not bright
- [ ] **No harsh reds** or bright oranges

#### Spacing Check:
- [ ] **Cards:** 32px padding (generous)
- [ ] **Sections:** 48px spacing between
- [ ] **Menu items:** Comfortable padding
- [ ] **No cramped layouts**

#### Typography Check:
- [ ] **Base font:** 16px (comfortable reading)
- [ ] **Line height:** 1.5 (generous)
- [ ] **Clear hierarchy:** Headings stand out
- [ ] **No tiny text**

#### Language Check:
- [ ] **Supportive tone:** "We're here to help"
- [ ] **No harsh language:** No "ERROR!" or "FAILED!"
- [ ] **Clear instructions:** Plain language
- [ ] **Encouraging messages**

---

## Common Issues & Solutions

### Issue 1: Sidebar Not Showing
**Symptom:** No sidebar on dashboard
**Solution:** 
1. Verify you're logged in (not on /login or /register)
2. Check browser console for errors
3. Verify Tailwind is processing (check Network tab for CSS)
4. Hard refresh (Ctrl+Shift+R)

### Issue 2: Styles Not Applied
**Symptom:** Components look unstyled
**Solution:**
1. Verify frontend server is running (port 5174)
2. Check `tailwind.config.js` exists
3. Check `postcss.config.js` exists
4. Restart frontend server

### Issue 3: Icons Not Showing
**Symptom:** Menu items have no icons
**Solution:**
1. Verify `lucide-react` is installed
2. Check browser console for import errors
3. Verify icon imports in Layout.tsx

### Issue 4: Mobile Menu Not Working
**Symptom:** Hamburger menu doesn't open
**Solution:**
1. Verify Radix UI Sheet component is installed
2. Check browser console for errors
3. Verify Shadcn UI components are properly configured

---

## Browser DevTools Checks

### Console Tab:
- [ ] No red errors
- [ ] No missing module warnings
- [ ] No 404 errors for assets

### Network Tab:
- [ ] CSS files loading (check for Tailwind classes)
- [ ] API calls succeeding (200 status)
- [ ] No CORS errors

### Elements Tab:
- [ ] Sidebar has class `lg:fixed lg:inset-y-0`
- [ ] Main content has class `lg:pl-72`
- [ ] Tailwind classes are applied (not raw class names)

---

## Performance Checks

### Page Load:
- [ ] Dashboard loads in <2 seconds
- [ ] No layout shift (CLS)
- [ ] Smooth transitions

### Navigation:
- [ ] Menu items respond instantly
- [ ] Page transitions are smooth
- [ ] No flickering or jumping

### Interactions:
- [ ] Hover states work smoothly
- [ ] Click feedback is immediate
- [ ] Animations are subtle (200-300ms)

---

## Accessibility Checks

### Keyboard Navigation:
- [ ] Tab through menu items
- [ ] Enter key activates links
- [ ] Focus indicators visible (blue ring)
- [ ] Can navigate entire app with keyboard

### Screen Reader:
- [ ] Menu items have proper labels
- [ ] Icons have aria-labels
- [ ] Headings are semantic (h1, h2, etc.)
- [ ] Form fields have labels

### Color Contrast:
- [ ] Text meets WCAG AA (4.5:1)
- [ ] Links are distinguishable
- [ ] Focus states are visible

---

## Success Criteria

✅ **Navigation Working:**
- Sidebar visible on authenticated pages
- All 9 menu items clickable
- Active states working
- Mobile menu functional

✅ **Empathetic Design:**
- Calm, soft colors
- Generous spacing
- Clear hierarchy
- Supportive language

✅ **Technical:**
- No console errors
- Tailwind classes applied
- Shadcn components rendering
- API calls succeeding

✅ **Accessibility:**
- Keyboard navigation works
- Focus states visible
- Color contrast sufficient
- Screen reader friendly

---

## Final Verification Command

Run this PowerShell command to verify both servers:

```powershell
# Check backend
Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Method GET

# Check frontend (should return HTML)
Invoke-WebRequest -Uri "http://localhost:5174" -Method GET
```

---

## Report Issues

If you find any issues, check:
1. Browser console for errors
2. Network tab for failed requests
3. `NAVIGATION_FIX_REPORT.md` for troubleshooting
4. `EMPATHETIC_DESIGN_GUIDE.md` for design principles

---

**Status:** Ready for testing
**Last Updated:** January 16, 2026
**Servers:** Backend (3000) + Frontend (5174) both running
