# Estate Settlement Platform - Sitemap

**Last Updated:** January 15, 2026  
**Version:** 1.0.0  
**Branch:** `feature/proper-mvp-implementation`

---

## Visual Sitemap

```
┌─────────────────────────────────────────────────────────────────┐
│                         PUBLIC PAGES                             │
└─────────────────────────────────────────────────────────────────┘
    │
    ├── / (Landing Page) [PLANNED]
    │   └── Features, Pricing, Testimonials, CTA
    │
    ├── /login ✅
    │   └── Email/Password or Google OAuth
    │
    ├── /register ✅
    │   └── Create Account
    │
    └── /role-selection ✅
        └── Choose: Executor, Beneficiary, Professional

┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATED PAGES                           │
└─────────────────────────────────────────────────────────────────┘
    │
    ├── /dashboard ✅
    │   ├── Estate Overview
    │   ├── Asset Summary Cards
    │   ├── Progress Indicators
    │   └── Quick Actions
    │
    ├── /intake ✅ [NEEDS WORK]
    │   └── Estate Creation Wizard
    │       ├── Step 1: Deceased Information
    │       ├── Step 2: Executor Information
    │       ├── Step 3: Jurisdiction
    │       └── Step 4: Initial Assets
    │
    ├── /assets ✅
    │   ├── Asset List View
    │   ├── Filter by Status/Type
    │   ├── Add New Asset
    │   └── Bulk Actions
    │
    ├── /assets/:assetId ✅
    │   ├── Asset Details
    │   ├── Communication History
    │   ├── Forms Library ✅ NEW
    │   ├── Document Uploads
    │   ├── Status Timeline
    │   └── Next Actions
    │
    ├── /assets/:assetId/close [PLANNED]
    │   └── Asset Closure Workflow
    │       ├── Final Documentation
    │       ├── Distribution Details
    │       └── Confirmation
    │
    ├── /communications ✅
    │   ├── All Communications
    │   ├── Filter by Asset/Type
    │   ├── Escalation Alerts
    │   └── Fax History ✅ NEW
    │
    ├── /documents ✅
    │   ├── Document Vault
    │   ├── Upload Documents
    │   ├── AI Extraction Status
    │   ├── Categories
    │   └── Search/Filter
    │
    ├── /checklist ✅ [NEEDS WORK]
    │   ├── Jurisdiction-Specific Tasks
    │   ├── Progress Tracking
    │   ├── Task Dependencies
    │   └── Completion Status
    │
    ├── /family ✅ [NEEDS WORK]
    │   ├── Beneficiary List
    │   ├── Contact Information
    │   ├── Distribution Tracking
    │   └── Communication Log
    │
    ├── /forms [PLANNED]
    │   ├── Form Library
    │   ├── Filter by Institution
    │   ├── Recently Used
    │   └── Saved Drafts
    │
    ├── /forms/:formId/fill [PLANNED]
    │   └── Form Filling Interface
    │       ├── Auto-populated Fields
    │       ├── Manual Entry
    │       ├── Preview
    │       └── Download/Fax Options
    │
    ├── /probate [PLANNED]
    │   ├── Probate Status
    │   ├── Court Information
    │   ├── Filing Checklist
    │   ├── Letters Testamentary
    │   └── Timeline
    │
    ├── /reports [PLANNED]
    │   ├── Estate Summary Report
    │   ├── Asset Valuation Report
    │   ├── Distribution Report
    │   ├── Tax Documentation
    │   └── Export Options (PDF, Excel)
    │
    ├── /settings [PLANNED]
    │   ├── Profile Settings
    │   ├── Notification Preferences
    │   ├── Security Settings
    │   ├── Billing (if premium)
    │   └── Estate Settings
    │
    └── /help [PLANNED]
        ├── Knowledge Base
        ├── Video Tutorials
        ├── FAQ
        ├── Contact Support
        └── Live Chat

┌─────────────────────────────────────────────────────────────────┐
│                    BENEFICIARY PORTAL                            │
└─────────────────────────────────────────────────────────────────┘
    │
    ├── /beneficiary/dashboard [PLANNED]
    │   ├── Estate Progress
    │   ├── Expected Distribution
    │   ├── Updates from Executor
    │   └── Documents Shared
    │
    ├── /beneficiary/updates [PLANNED]
    │   └── Timeline of Estate Progress
    │
    └── /beneficiary/documents [PLANNED]
        └── Shared Documents (Read-only)

┌─────────────────────────────────────────────────────────────────┐
│                    PROFESSIONAL PORTAL                           │
└─────────────────────────────────────────────────────────────────┘
    │
    ├── /professional/clients [PLANNED]
    │   ├── Client List
    │   ├── Active Estates
    │   └── Add New Client
    │
    ├── /professional/estate/:estateId [PLANNED]
    │   └── Full Estate Management
    │
    └── /professional/billing [PLANNED]
        └── Time Tracking & Invoicing

┌─────────────────────────────────────────────────────────────────┐
│                         ADMIN PORTAL                             │
└─────────────────────────────────────────────────────────────────┘
    │
    ├── /admin/dashboard [PLANNED]
    │   ├── Platform Metrics
    │   ├── User Statistics
    │   └── System Health
    │
    ├── /admin/users [PLANNED]
    │   └── User Management
    │
    ├── /admin/estates [PLANNED]
    │   └── Estate Oversight
    │
    └── /admin/forms [PLANNED]
        └── Form Library Management

┌─────────────────────────────────────────────────────────────────┐
│                         API ENDPOINTS                            │
└─────────────────────────────────────────────────────────────────┘
    │
    ├── /api/auth
    │   ├── POST /register
    │   ├── POST /login
    │   ├── POST /logout
    │   └── POST /refresh
    │
    ├── /api/estates
    │   ├── GET /dashboard
    │   ├── POST /create
    │   ├── GET /:estateId
    │   ├── PUT /:estateId
    │   └── DELETE /:estateId
    │
    ├── /api/assets
    │   ├── GET /
    │   ├── POST /
    │   ├── GET /:assetId
    │   ├── PUT /:assetId
    │   ├── DELETE /:assetId
    │   ├── GET /:assetId/communications
    │   ├── POST /:assetId/communications
    │   ├── GET /:assetId/next-actions
    │   └── GET /:assetId/communications/stats
    │
    ├── /api/forms ✅ NEW
    │   ├── GET /
    │   ├── GET /institution/:institution
    │   ├── GET /:formId
    │   ├── POST /:formId/auto-populate
    │   ├── POST /:formId/fill
    │   ├── POST /:formId/fax
    │   ├── GET /fax/:faxId
    │   ├── GET /fax/asset/:assetId
    │   └── POST /fax/:faxId/retry
    │
    ├── /api/documents
    │   ├── GET /
    │   ├── POST /upload
    │   ├── GET /:documentId
    │   ├── DELETE /:documentId
    │   └── POST /:documentId/extract
    │
    ├── /api/communication
    │   ├── GET /
    │   ├── POST /
    │   ├── GET /:communicationId
    │   └── PUT /:communicationId
    │
    └── /api/ai
        ├── POST /extract
        ├── POST /analyze
        └── POST /generate

```

---

## Page Details

### ✅ Implemented Pages

#### `/login`
- **Purpose:** User authentication
- **Features:**
  - Email/password login
  - Google OAuth (planned)
  - Remember me
  - Forgot password link
- **Status:** ✅ Complete

#### `/register`
- **Purpose:** New user registration
- **Features:**
  - Email/password signup
  - Google OAuth (planned)
  - Terms acceptance
  - Email verification
- **Status:** ✅ Complete

#### `/role-selection`
- **Purpose:** Choose user role
- **Options:**
  - Executor (primary)
  - Beneficiary
  - Professional (attorney/advisor)
- **Status:** ✅ Complete

#### `/dashboard`
- **Purpose:** Main overview of estate
- **Features:**
  - Estate summary stats
  - Asset cards with status
  - Progress indicators
  - Quick actions
  - Recent activity
- **Design:** Empathetic, calm, spacious
- **Status:** ✅ Complete with empathetic redesign

#### `/assets`
- **Purpose:** List all assets
- **Features:**
  - Grid/list view
  - Filter by status/type
  - Sort options
  - Add new asset
  - Bulk actions
- **Status:** ✅ Complete

#### `/assets/:assetId`
- **Purpose:** Detailed asset view
- **Features:**
  - Asset information
  - Communication history ✅
  - Forms library ✅ NEW
  - Next action alerts ✅
  - Status timeline
  - Document uploads
- **Design:** Empathetic with generous spacing
- **Status:** ✅ Complete with forms feature

#### `/communications`
- **Purpose:** All communications across assets
- **Features:**
  - Timeline view
  - Filter by asset/type
  - Escalation alerts
  - Fax history ✅ NEW
- **Status:** ✅ Complete

#### `/documents`
- **Purpose:** Document management
- **Features:**
  - Upload documents
  - Categorization
  - AI extraction status
  - Search/filter
  - Preview
- **Status:** ✅ Basic implementation

#### `/checklist`
- **Purpose:** Task management
- **Features:**
  - Jurisdiction-specific tasks
  - Progress tracking
  - Task dependencies
- **Status:** ✅ Basic implementation (needs enhancement)

#### `/family`
- **Purpose:** Beneficiary management
- **Features:**
  - Beneficiary list
  - Contact information
  - Distribution tracking
- **Status:** ✅ Basic implementation (needs enhancement)

#### `/intake`
- **Purpose:** Estate creation wizard
- **Features:**
  - Multi-step form
  - Deceased information
  - Executor information
  - Jurisdiction selection
- **Status:** ✅ Basic implementation (needs enhancement)

---

### ⏳ Planned Pages

#### `/` (Landing Page)
- **Purpose:** Marketing and conversion
- **Sections:**
  - Hero with value proposition
  - Key features
  - How it works
  - Pricing
  - Testimonials
  - FAQ
  - CTA
- **Priority:** Medium
- **Timeline:** Week 10-11

#### `/forms`
- **Purpose:** Form library hub
- **Features:**
  - All available forms
  - Filter by institution
  - Recently used
  - Saved drafts
  - Quick fax
- **Priority:** High
- **Timeline:** Week 2-3

#### `/forms/:formId/fill`
- **Purpose:** Standalone form filling
- **Features:**
  - Full-page form interface
  - Auto-save drafts
  - Preview mode
  - Download/fax options
- **Priority:** Medium
- **Timeline:** Week 3-4

#### `/probate`
- **Purpose:** Probate process tracking
- **Features:**
  - Filing status
  - Court information
  - Document checklist
  - Letters Testamentary upload
  - Timeline
- **Priority:** High
- **Timeline:** Week 10

#### `/reports`
- **Purpose:** Generate estate reports
- **Features:**
  - Estate summary
  - Asset valuation
  - Distribution report
  - Tax documentation
  - Export (PDF, Excel)
- **Priority:** Medium
- **Timeline:** Week 11

#### `/settings`
- **Purpose:** User and estate settings
- **Sections:**
  - Profile settings
  - Notification preferences
  - Security (2FA, password)
  - Billing (if premium)
  - Estate settings
- **Priority:** High
- **Timeline:** Week 4

#### `/help`
- **Purpose:** User support
- **Features:**
  - Knowledge base
  - Video tutorials
  - FAQ
  - Contact support
  - Live chat
- **Priority:** Medium
- **Timeline:** Week 12

#### `/beneficiary/dashboard`
- **Purpose:** Beneficiary view of estate
- **Features:**
  - Estate progress
  - Expected distribution
  - Updates from executor
  - Shared documents
- **Priority:** High
- **Timeline:** Week 9

#### `/professional/clients`
- **Purpose:** Professional user management
- **Features:**
  - Client list
  - Active estates
  - Add new client
  - Billing
- **Priority:** Low
- **Timeline:** Post-MVP

---

## User Flows

### Primary User Flow (Executor)

```
1. Register/Login
   ↓
2. Role Selection (Executor)
   ↓
3. Intake Wizard
   ├── Deceased Information
   ├── Executor Information
   ├── Jurisdiction
   └── Initial Assets
   ↓
4. Dashboard
   ├── View Estate Overview
   ├── See Asset Status
   └── Check Next Actions
   ↓
5. Asset Management
   ├── Click Asset
   ├── View Details
   ├── Log Communications
   ├── Fill & Fax Forms ✅ NEW
   └── Upload Documents
   ↓
6. Track Progress
   ├── Communication Log
   ├── Checklist
   └── Reports
   ↓
7. Close Estate
   └── Final Distribution
```

### Form Filling Flow ✅ NEW

```
1. Asset Detail Page
   ↓
2. Forms Library Section
   ├── View Available Forms
   └── See Cost Estimates
   ↓
3. Click "Send Fax"
   ↓
4. Select Form
   └── Choose Estate Settlement Packet
   ↓
5. Fill Form
   ├── Auto-populated Fields
   └── Manual Entry
   ↓
6. Review
   ├── Confirm Data
   ├── Add Cover Notes
   └── See Final Cost
   ↓
7. Send Fax
   ↓
8. Confirmation
   ├── Fax ID
   ├── Delivery Tracking
   └── Communication Log Entry
```

### Beneficiary Flow

```
1. Register/Login
   ↓
2. Role Selection (Beneficiary)
   ↓
3. Beneficiary Dashboard
   ├── View Estate Progress
   ├── See Expected Distribution
   └── Read Updates
   ↓
4. View Shared Documents
   ↓
5. Receive Distribution
```

---

## Navigation Structure

### Main Navigation (Executor)

```
┌─────────────────────────────────────────────────────┐
│  Logo    Dashboard  Assets  Docs  Checklist  Family │
│                                          [Profile ▼] │
└─────────────────────────────────────────────────────┘
```

**Primary Nav Items:**
- Dashboard
- Assets
- Documents
- Checklist
- Family

**Secondary Nav (Profile Dropdown):**
- Settings
- Help
- Logout

### Asset Detail Navigation

```
┌─────────────────────────────────────────────────────┐
│  ← Back to Dashboard                                 │
│                                                       │
│  [Overview] [Communications] [Forms] [Documents]     │
└─────────────────────────────────────────────────────┘
```

**Tabs:**
- Overview (default)
- Communications
- Forms ✅ NEW
- Documents

---

## Mobile Considerations

### Mobile Navigation

```
┌─────────────────────────┐
│  ☰  Logo        [👤]    │
└─────────────────────────┘
```

**Hamburger Menu:**
- Dashboard
- Assets
- Documents
- Checklist
- Family
- Settings
- Help
- Logout

### Mobile-Optimized Pages

**Priority for mobile optimization:**
1. ✅ Dashboard
2. ✅ Asset Detail
3. ✅ Communications
4. ✅ Forms (SendFaxModal)
5. Documents
6. Checklist

---

## URL Structure

### Pattern
```
/[resource]/[id]/[action]
```

### Examples
```
/assets/123e4567-e89b-12d3-a456-426614174000
/assets/123e4567-e89b-12d3-a456-426614174000/close
/forms/fidelity_estate_packet/fill
/documents/456e7890-e89b-12d3-a456-426614174000/preview
```

### Query Parameters
```
/assets?status=CONTACTED&type=401k
/communications?asset=123e4567&type=escalation
/documents?category=death_certificate&status=verified
```

---

## Breadcrumbs

### Example Breadcrumbs

```
Dashboard > Assets > Fidelity 401(k)

Dashboard > Assets > Fidelity 401(k) > Communications

Dashboard > Forms > Fidelity Estate Settlement Packet

Dashboard > Documents > Death Certificate
```

---

## Page States

### Loading States
- Skeleton screens
- Spinner for actions
- Progress bars for uploads

### Empty States
- No assets yet
- No communications yet
- No documents uploaded
- No forms available

### Error States
- 404 - Page not found
- 403 - Access denied
- 500 - Server error
- Network error

### Success States
- Asset created
- Communication logged
- Fax sent ✅
- Document uploaded

---

## Accessibility

### WCAG 2.1 AA Compliance

**Requirements:**
- Keyboard navigation
- Screen reader support
- Color contrast (4.5:1 minimum)
- Focus indicators
- Alt text for images
- ARIA labels
- Skip links

**Testing:**
- Lighthouse audits
- Screen reader testing
- Keyboard-only navigation
- Color blindness simulation

---

## SEO Considerations

### Public Pages
- Meta titles and descriptions
- Open Graph tags
- Schema.org markup
- Sitemap.xml
- Robots.txt

### Authenticated Pages
- No-index for private pages
- Canonical URLs
- Proper heading hierarchy

---

## Analytics & Tracking

### Key Events to Track

**User Journey:**
- Registration
- Estate creation
- Asset added
- Communication logged
- Form filled ✅ NEW
- Fax sent ✅ NEW
- Document uploaded
- Checklist completed

**Engagement:**
- Time on page
- Pages per session
- Feature usage
- Drop-off points

**Business Metrics:**
- Conversion rate
- Retention rate
- Feature adoption
- Support tickets

---

## Future Expansion

### Planned Sections

**Phase 2 (Weeks 5-8):**
- `/probate` - Probate tracking
- `/reports` - Estate reports
- `/settings` - User settings

**Phase 3 (Weeks 9-12):**
- `/beneficiary/*` - Beneficiary portal
- `/help` - Help center
- Landing page

**Post-MVP:**
- `/professional/*` - Professional portal
- `/admin/*` - Admin portal
- `/marketplace` - Service marketplace
- `/education` - Learning center

---

## Status Legend

- ✅ **Complete** - Fully implemented and tested
- ⏳ **In Progress** - Currently being developed
- 🔄 **Needs Work** - Implemented but needs enhancement
- 📋 **Planned** - Designed but not yet implemented
- 💡 **Idea** - Concept stage

---

## Implementation Priority

### Week 1-2 (Current)
- ✅ Dashboard
- ✅ Asset Detail
- ✅ Communications
- ✅ Forms & Faxing

### Week 3-4
- 🔄 Intake Wizard (enhance)
- 🔄 Checklist (enhance)
- 📋 Settings
- 📋 Forms Library Page

### Week 5-8
- 📋 Probate Tracking
- 📋 Reports
- 🔄 Documents (enhance)
- 🔄 Family (enhance)

### Week 9-12
- 📋 Beneficiary Portal
- 📋 Help Center
- 📋 Landing Page
- 📋 Admin Tools

---

**Last Updated:** January 15, 2026  
**Maintained By:** Development Team  
**Review Frequency:** Weekly
