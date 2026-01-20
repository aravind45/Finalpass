# Asset Organization & Individual Follow-up Feature Specification

## Overview

Each asset in the estate should be treated as an **independent workflow** with its own:
- Status tracking
- Communication history
- Required forms library
- Follow-up schedule
- Document checklist
- Contact information

---

## 1. Asset Organization Structure

### Visual Hierarchy

```
Estate Dashboard
├── Financial Accounts (Category)
│   ├── Chase Checking - $15,000
│   │   ├── Status: In Progress
│   │   ├── Last Contact: 3 days ago
│   │   ├── Next Action: Submit death certificate
│   │   └── Forms: 2 available
│   ├── Ally Savings - $45,000
│   │   ├── Status: Contacted
│   │   ├── Last Contact: 7 days ago
│   │   ├── Next Action: Follow up on claim
│   │   └── Forms: 1 available
│   └── Marcus CD - $50,000
│       ├── Status: Pending
│       ├── Maturity Date: June 15, 2024
│       ├── Next Action: Wait for maturity
│       └── Forms: 0 available
│
├── Retirement Accounts (Category)
│   ├── Fidelity 401(k) - $425,000
│   │   ├── Status: Documents Submitted
│   │   ├── Last Contact: 10 days ago ⚠️
│   │   ├── Next Action: Follow up on review
│   │   └── Forms: 3 available
│   └── Vanguard IRA - $350,000
│       ├── Status: Approved
│       ├── Last Contact: 2 days ago
│       ├── Next Action: Complete distribution
│       └── Forms: 2 available
│
└── Insurance & Benefits (Category)
    ├── MetLife Life Insurance - $500,000
    │   ├── Status: Claim Filed
    │   ├── Last Contact: 5 days ago
    │   ├── Next Action: Check claim status
    │   └── Forms: 1 available
    └── Group Life Insurance - $150,000
        ├── Status: Contacted
        ├── Last Contact: 14 days ago 🚨
        ├── Next Action: ESCALATE - No response
        └── Forms: 2 available
```

---

## 2. Asset Detail Page Structure

### Individual Asset View

Each asset gets its own dedicated page with complete workflow tracking:

```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to Dashboard                                         │
│                                                              │
│ Fidelity 401(k)                          Asset Value        │
│ 401k                                     $425,000           │
│ [In Progress]                                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ ⚠️ Action Recommended                                       │
│ No response in 10 days. Consider following up.             │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Quick Stats                                                 │
│ ┌──────────────┬──────────────┬──────────────┐            │
│ │ Institution  │ Status       │ Value        │            │
│ │ Fidelity     │ In Progress  │ $425,000     │            │
│ │ 401k         │ Last: 1/26   │ As of death  │            │
│ └──────────────┴──────────────┴──────────────┘            │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Forms & Documents                    [Send Fax]            │
│                                                              │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ 📄 Fidelity Estate Settlement Packet                │   │
│ │    Complete packet for settling Fidelity accounts   │   │
│ │    8 pages • $0.56 to fax                           │   │
│ │    [Fill & Send] [Download]                         │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                              │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ 📄 Fidelity Account Transfer Request                │   │
│ │    Request to transfer or close accounts            │   │
│ │    3 pages • $0.21 to fax                           │   │
│ │    [Fill & Send] [Download]                         │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                              │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ 📄 401(k) Distribution Request Form                 │   │
│ │    Request distribution of 401(k) funds             │   │
│ │    2 pages • $0.14 to fax                           │   │
│ │    [Fill & Send] [Download]                         │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Communication History                  [+ Log Communication]│
│                                                              │
│ 0 interactions • Last contact today                         │
│                                                              │
│ 💬 No communications yet                                    │
│    Start by logging your first interaction with Fidelity.  │
│    This helps track progress and ensures nothing falls     │
│    through the cracks.                                      │
│    [Log First Communication]                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Database Schema Enhancement

### Asset Table (Enhanced)

```sql
CREATE TABLE assets (
  id UUID PRIMARY KEY,
  estate_id UUID REFERENCES estates(id),
  
  -- Basic Info
  institution VARCHAR(255) NOT NULL,
  account_type VARCHAR(100) NOT NULL, -- checking, 401k, life_insurance, etc.
  account_number VARCHAR(100),
  value DECIMAL(15, 2),
  
  -- Categorization
  category VARCHAR(50), -- financial, retirement, insurance, property
  priority VARCHAR(20), -- high, medium, low
  
  -- Status Tracking
  status VARCHAR(50) DEFAULT 'discovered',
  last_contact_date TIMESTAMP,
  next_follow_up_date TIMESTAMP,
  days_since_contact INTEGER GENERATED ALWAYS AS (
    EXTRACT(DAY FROM NOW() - last_contact_date)
  ) STORED,
  
  -- Contact Information
  institution_phone VARCHAR(50),
  institution_email VARCHAR(255),
  institution_fax VARCHAR(50),
  contact_person VARCHAR(255),
  
  -- Metadata
  metadata JSONB, -- flexible storage for asset-specific data
  requirements JSONB, -- required documents, forms, etc.
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_estate_id (estate_id),
  INDEX idx_status (status),
  INDEX idx_category (category),
  INDEX idx_next_follow_up (next_follow_up_date)
);
```

### Asset Forms Junction Table

```sql
CREATE TABLE asset_forms (
  id UUID PRIMARY KEY,
  asset_id UUID REFERENCES assets(id),
  form_id VARCHAR(255) NOT NULL, -- references form in forms library
  
  -- Status
  status VARCHAR(50) DEFAULT 'available', -- available, filled, sent, received
  filled_date TIMESTAMP,
  sent_date TIMESTAMP,
  received_date TIMESTAMP,
  
  -- Tracking
  fax_confirmation VARCHAR(100),
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_asset_id (asset_id),
  INDEX idx_form_id (form_id),
  INDEX idx_status (status)
);
```

### Asset Checklist Table

```sql
CREATE TABLE asset_checklists (
  id UUID PRIMARY KEY,
  asset_id UUID REFERENCES assets(id),
  
  -- Checklist Item
  item_type VARCHAR(100), -- document, form, action
  item_name VARCHAR(255),
  description TEXT,
  required BOOLEAN DEFAULT true,
  
  -- Status
  completed BOOLEAN DEFAULT false,
  completed_date TIMESTAMP,
  completed_by UUID REFERENCES users(id),
  
  -- Order
  sort_order INTEGER,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_asset_id (asset_id),
  INDEX idx_completed (completed)
);
```

---

## 4. Asset-Specific Forms Library

### Forms Metadata Structure

```json
{
  "forms": [
    {
      "id": "fidelity_estate_settlement_packet",
      "name": "Fidelity Estate Settlement Packet",
      "description": "Complete packet for settling Fidelity accounts",
      "institution": "Fidelity",
      "applicableAssetTypes": ["401k", "ira_traditional", "ira_roth", "brokerage_account"],
      "pageCount": 8,
      "faxCost": 0.56,
      "pdfPath": "/forms/fidelity/estate_settlement_packet.pdf",
      "fillableFields": [
        {
          "name": "deceased_name",
          "type": "text",
          "required": true,
          "autoFill": "estate.deceasedName"
        },
        {
          "name": "deceased_ssn",
          "type": "ssn",
          "required": true,
          "autoFill": "estate.deceasedSSN"
        },
        {
          "name": "account_number",
          "type": "text",
          "required": true,
          "autoFill": "asset.accountNumber"
        },
        {
          "name": "executor_name",
          "type": "text",
          "required": true,
          "autoFill": "user.name"
        },
        {
          "name": "executor_phone",
          "type": "phone",
          "required": true,
          "autoFill": "user.phone"
        },
        {
          "name": "date_of_death",
          "type": "date",
          "required": true,
          "autoFill": "estate.dateOfDeath"
        }
      ],
      "requiredDocuments": [
        "death_certificate_certified",
        "letters_testamentary"
      ],
      "instructions": "Complete all sections. Attach certified death certificate and letters testamentary. Fax to 1-800-544-0003.",
      "processingTime": "30-45 days",
      "tags": ["estate", "settlement", "401k", "ira"]
    },
    {
      "id": "chase_affidavit_of_death",
      "name": "Chase Affidavit of Death",
      "description": "Required form for closing Chase bank accounts",
      "institution": "Chase",
      "applicableAssetTypes": ["checking_account", "savings_account", "certificate_of_deposit"],
      "pageCount": 2,
      "faxCost": 0.14,
      "pdfPath": "/forms/chase/affidavit_of_death.pdf",
      "fillableFields": [
        {
          "name": "deceased_name",
          "type": "text",
          "required": true,
          "autoFill": "estate.deceasedName"
        },
        {
          "name": "account_number",
          "type": "text",
          "required": true,
          "autoFill": "asset.accountNumber"
        },
        {
          "name": "executor_name",
          "type": "text",
          "required": true,
          "autoFill": "user.name"
        }
      ],
      "requiredDocuments": [
        "death_certificate_certified",
        "letters_testamentary"
      ],
      "instructions": "Complete form and fax with death certificate to 1-800-935-9935.",
      "processingTime": "14-30 days",
      "tags": ["bank", "checking", "savings"]
    }
  ]
}
```

---

## 5. Follow-up System

### Automatic Follow-up Triggers

```typescript
interface FollowUpRule {
  assetType: string;
  status: string;
  daysSinceLastContact: number;
  action: 'remind' | 'escalate' | 'alert';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  message: string;
}

const followUpRules: FollowUpRule[] = [
  {
    assetType: 'all',
    status: 'contacted',
    daysSinceLastContact: 7,
    action: 'remind',
    priority: 'medium',
    message: 'It\'s been 7 days since you contacted {institution}. Consider following up on the status.'
  },
  {
    assetType: 'all',
    status: 'contacted',
    daysSinceLastContact: 14,
    action: 'escalate',
    priority: 'high',
    message: 'No response from {institution} in 14 days. Time to escalate with a formal letter.'
  },
  {
    assetType: 'all',
    status: 'documents_submitted',
    daysSinceLastContact: 10,
    action: 'remind',
    priority: 'medium',
    message: 'Documents submitted 10 days ago. Check on review status with {institution}.'
  },
  {
    assetType: 'all',
    status: 'documents_submitted',
    daysSinceLastContact: 21,
    action: 'escalate',
    priority: 'high',
    message: 'Documents under review for 21 days. This is longer than typical. Escalate to supervisor.'
  },
  {
    assetType: '401k',
    status: 'approved',
    daysSinceLastContact: 7,
    action: 'alert',
    priority: 'urgent',
    message: 'Distribution approved but not received. Contact {institution} immediately about transfer.'
  },
  {
    assetType: 'life_insurance',
    status: 'contacted',
    daysSinceLastContact: 30,
    action: 'escalate',
    priority: 'urgent',
    message: 'Life insurance claim pending 30 days. File complaint with state insurance commissioner.'
  }
];
```

### Follow-up Dashboard Widget

```typescript
interface FollowUpItem {
  assetId: string;
  institution: string;
  assetType: string;
  value: number;
  daysSinceContact: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  action: string;
  dueDate: Date;
}

// Example follow-up list
const followUps: FollowUpItem[] = [
  {
    assetId: '123',
    institution: 'Fidelity 401(k)',
    assetType: '401k',
    value: 425000,
    daysSinceContact: 14,
    priority: 'high',
    action: 'Escalate - No response in 14 days',
    dueDate: new Date('2024-01-30')
  },
  {
    assetId: '456',
    institution: 'MetLife Life Insurance',
    assetType: 'life_insurance',
    value: 500000,
    daysSinceContact: 7,
    priority: 'medium',
    action: 'Follow up on claim status',
    dueDate: new Date('2024-02-01')
  }
];
```

---

## 6. UI Components

### Asset Card Component (Dashboard)

```typescript
interface AssetCardProps {
  asset: {
    id: string;
    institution: string;
    accountType: string;
    value: number;
    status: string;
    lastContactDate: Date;
    daysSinceContact: number;
    formsAvailable: number;
    urgency: 'normal' | 'attention' | 'urgent';
  };
}

const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  const urgencyStyles = {
    normal: 'border-l-blue-500',
    attention: 'border-l-amber-500',
    urgent: 'border-l-red-500'
  };

  return (
    <Card className={`hover:bg-muted/50 cursor-pointer border-l-4 ${urgencyStyles[asset.urgency]}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg">{asset.institution}</h3>
            <p className="text-sm text-muted-foreground">{asset.accountType}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">${asset.value.toLocaleString()}</p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={asset.status === 'distributed' ? 'success' : 'default'}>
            {asset.status}
          </Badge>
          {asset.daysSinceContact > 14 && (
            <Badge variant="destructive">
              ⚠️ {asset.daysSinceContact} days
            </Badge>
          )}
        </div>

        {/* Last Contact */}
        <p className="text-sm text-muted-foreground mb-2">
          Last contact: {formatDistanceToNow(asset.lastContactDate, { addSuffix: true })}
        </p>

        {/* Forms Available */}
        {asset.formsAvailable > 0 && (
          <div className="flex items-center gap-2 text-sm text-primary">
            <FileText className="w-4 h-4" />
            <span>{asset.formsAvailable} forms available</span>
          </div>
        )}
      </div>
    </Card>
  );
};
```

### Asset Detail Page Component

```typescript
const AssetDetailPage: React.FC = () => {
  const { assetId } = useParams();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [forms, setForms] = useState<Form[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <AssetHeader asset={asset} />

      {/* Action Alert */}
      {asset.daysSinceContact > 14 && (
        <ActionAlert asset={asset} />
      )}

      {/* Quick Stats */}
      <AssetStats asset={asset} />

      {/* Forms Library */}
      <FormsSection 
        forms={forms} 
        assetId={asset.id}
        institution={asset.institution}
      />

      {/* Document Checklist */}
      <ChecklistSection 
        checklist={checklist}
        assetId={asset.id}
      />

      {/* Communication History */}
      <CommunicationSection 
        communications={communications}
        assetId={asset.id}
        institution={asset.institution}
      />

      {/* Follow-up Schedule */}
      <FollowUpSection 
        assetId={asset.id}
        lastContact={asset.lastContactDate}
      />
    </div>
  );
};
```

---

## 7. API Endpoints

### Asset Management

```typescript
// Get all assets for an estate (organized by category)
GET /api/estates/:estateId/assets
Response: {
  success: true,
  assets: {
    financial: [...],
    retirement: [...],
    insurance: [...]
  },
  summary: {
    totalValue: 1500000,
    totalAssets: 12,
    byStatus: {
      contacted: 5,
      in_progress: 4,
      distributed: 3
    }
  }
}

// Get single asset with full details
GET /api/assets/:assetId
Response: {
  success: true,
  asset: {
    id: '123',
    institution: 'Fidelity',
    accountType: '401k',
    value: 425000,
    status: 'contacted',
    lastContactDate: '2024-01-15',
    daysSinceContact: 11,
    ...
  },
  forms: [...],
  checklist: [...],
  communications: [...],
  followUps: [...]
}

// Get forms for specific asset
GET /api/assets/:assetId/forms
Response: {
  success: true,
  forms: [
    {
      id: 'fidelity_estate_settlement_packet',
      name: 'Fidelity Estate Settlement Packet',
      pageCount: 8,
      status: 'available',
      ...
    }
  ]
}

// Get checklist for asset
GET /api/assets/:assetId/checklist
Response: {
  success: true,
  checklist: [
    {
      id: '1',
      itemName: 'Obtain certified death certificate',
      required: true,
      completed: true,
      completedDate: '2024-01-10'
    },
    {
      id: '2',
      itemName: 'Get letters testamentary',
      required: true,
      completed: false
    }
  ],
  progress: {
    completed: 1,
    total: 5,
    percentage: 20
  }
}

// Update asset status
PATCH /api/assets/:assetId/status
Body: {
  status: 'documents_submitted',
  notes: 'Faxed estate settlement packet'
}

// Log communication for asset
POST /api/assets/:assetId/communications
Body: {
  type: 'phone_call',
  direction: 'outbound',
  contactPerson: 'John Smith',
  summary: 'Called to check on claim status',
  outcome: 'In review, expect response in 7 days',
  nextFollowUpDate: '2024-02-01'
}

// Get follow-up schedule
GET /api/assets/:assetId/follow-ups
Response: {
  success: true,
  followUps: [
    {
      date: '2024-02-01',
      action: 'Follow up on claim status',
      priority: 'medium',
      automated: true
    }
  ]
}
```

---

## 8. Implementation Priority

### Phase 1: Core Organization (Week 2)
- ✅ Asset categorization (financial, retirement, insurance)
- ✅ Individual asset detail pages
- ✅ Status tracking per asset
- ✅ Communication logging per asset

### Phase 2: Forms Integration (Week 3)
- 📋 Asset-specific forms library
- 📋 Form-to-asset mapping
- 📋 Auto-fill forms with asset data
- 📋 Track form submission status

### Phase 3: Follow-up Automation (Week 4)
- 📋 Automatic follow-up reminders
- 📋 Escalation triggers (14-day rule)
- 📋 Follow-up dashboard widget
- 📋 Email/SMS notifications

### Phase 4: Checklist System (Week 5)
- 📋 Asset-specific checklists
- 📋 Progress tracking
- 📋 Document requirements
- 📋 Completion tracking

---

## 9. User Workflows

### Workflow 1: Adding a New Asset

```
1. User uploads bank statement
   ↓
2. AI extracts: "Chase Checking - $15,000"
   ↓
3. System creates asset record
   ↓
4. System loads Chase-specific forms
   ↓
5. System generates checklist:
   - Obtain death certificate ✓
   - Get letters testamentary ⏳
   - Complete Chase affidavit ⏳
   - Fax documents to Chase ⏳
   ↓
6. User sees asset on dashboard
   ↓
7. User clicks asset → Asset detail page
   ↓
8. User sees 2 forms available for Chase
```

### Workflow 2: Following Up on Asset

```
1. Dashboard shows: "Fidelity 401(k) - 14 days since contact ⚠️"
   ↓
2. User clicks asset
   ↓
3. Asset detail page shows:
   - Status: Documents Submitted
   - Last Contact: 14 days ago
   - Action: Escalate - No response
   ↓
4. User clicks "Log Communication"
   ↓
5. User logs phone call:
   - Called Fidelity estate services
   - Spoke with Jane Doe
   - Claim is in review, expect response in 7 days
   ↓
6. System updates:
   - Last Contact: Today
   - Next Follow-up: 7 days from now
   - Status: In Review
   ↓
7. Asset no longer shows as urgent
```

### Workflow 3: Completing Asset Settlement

```
1. User receives distribution from Fidelity
   ↓
2. User goes to Fidelity 401(k) asset page
   ↓
3. User logs communication:
   - Type: Distribution Received
   - Amount: $425,000
   - Date: Today
   ↓
4. User updates status: "Distributed"
   ↓
5. System marks asset as complete
   ↓
6. Asset moves to "Completed" section
   ↓
7. Dashboard updates:
   - Total distributed: +$425,000
   - Assets remaining: 11 → 10
   - Progress: 8% → 17%
```

---

## 10. Benefits of This Approach

### For Executors
✅ **Clear organization** - Assets grouped by category
✅ **Individual tracking** - Each asset has its own workflow
✅ **Automatic reminders** - Never miss a follow-up
✅ **Forms at fingertips** - Right forms for each asset
✅ **Progress visibility** - See status at a glance

### For Platform
✅ **Scalable** - Easy to add new asset types
✅ **Flexible** - Asset-specific rules and forms
✅ **Trackable** - Complete audit trail per asset
✅ **Automatable** - Rules-based follow-ups
✅ **Valuable** - Core differentiator vs. spreadsheets

### For Institutions (Partnership Pitch)
✅ **Standardized** - Consistent form submission
✅ **Complete** - All required documents included
✅ **Trackable** - Confirmation of receipt
✅ **Efficient** - Reduces back-and-forth
✅ **Compliant** - Proper documentation

---

## Summary

This feature transforms ExpectedEstate from a simple tracker into a **comprehensive asset management system** where:

1. **Each asset is independent** - Own status, forms, communications
2. **Forms are asset-specific** - Right forms automatically loaded
3. **Follow-ups are automatic** - System reminds you when to act
4. **Progress is visible** - Clear view of what's done and what's next
5. **Nothing falls through cracks** - 14-day escalation rule

**This is the core value proposition** - preventing the "institutional black hole" by tracking every asset individually with automatic escalation.
