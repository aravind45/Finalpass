# Estate Settlement Platform MVP - Ground Truth Specification

## Core Insight: You're Building a Workflow Engine for Legal Process Failure

**Not:** Generic estate software
**Actually:** Asset-centric tracking system for the most failure-prone consumer finance process

## Phase-by-Phase MVP Requirements

### Phase 1: Estate Triggered (Day 0-30)
**The Paralysis Problem:** Executors don't know what they can do without legal authority

#### MVP Features:
```javascript
// Jurisdiction-aware Day 0-30 checklist
const dayZeroChecklist = {
  jurisdiction: "California", // Auto-detected from death certificate
  legalAuthority: false,
  urgentActions: [
    {
      task: "Order death certificates (10+ certified copies)",
      deadline: "Within 72 hours",
      canDoNow: true,
      reason: "Required for all institutions"
    },
    {
      task: "Secure physical property",
      deadline: "Immediately", 
      canDoNow: true,
      reason: "Prevent theft/damage"
    },
    {
      task: "Forward mail to executor address",
      deadline: "Within 1 week",
      canDoNow: true,
      reason: "Capture bills and statements"
    },
    {
      task: "Contact banks/brokers",
      deadline: "After Letters Testamentary",
      canDoNow: false,
      reason: "They will refuse without legal authority"
    }
  ]
}
```

#### UX Principle:
**Guided progression, not free-form dashboards**
- Green: "Do this now"
- Yellow: "Prepare for later" 
- Red: "Wait for legal authority"

### Phase 2: Probate Opened (Authority Granted)
**The Authority Problem:** Institutions have different requirements for legal documents

#### MVP Features:
```javascript
// Authority status toggle with dependency engine
const authorityStatus = {
  probateOpened: true,
  lettersTestamentary: {
    received: true,
    date: "2024-01-15",
    copies: {
      certified: 8,
      regular: 12
    }
  },
  institutionRequirements: {
    "Fidelity": {
      requires: "original_letters",
      status: "can_contact",
      lastUpdated: "2024-01-15"
    },
    "Chase_Bank": {
      requires: "certified_copy",
      status: "can_contact", 
      lastUpdated: "2024-01-15"
    },
    "Invesco": {
      requires: "certified_copy",
      status: "waiting_for_authority",
      reason: "Need original death certificate + letters"
    }
  }
}
```

#### Dependency Engine Logic:
```javascript
// Cannot contact institution until requirements met
function canContactInstitution(institution, documents) {
  const requirements = institutionRequirements[institution];
  return requirements.every(req => documents.includes(req));
}
```

### Phase 3: Asset Discovery & Inventory (The Black Hole)
**The Core Problem:** Institutions go silent, executors lose track

#### MVP Features: Asset-Centric Tracking (NOT Task-Centric)
```javascript
// Each asset becomes a tracked record
const assetRecord = {
  id: "fidelity_401k_12345",
  institution: "Fidelity",
  accountType: "401k",
  accountNumber: "12345",
  estimatedValue: 150000,
  
  // Status tracking
  status: "in_review", // contacted, docs_submitted, in_review, rejected, completed
  
  // Communication log
  communications: [
    {
      date: "2024-01-20",
      type: "initial_contact",
      method: "secure_email",
      content: "Estate settlement packet submitted",
      response: null,
      responseDate: null
    },
    {
      date: "2024-01-27", 
      type: "follow_up",
      method: "phone",
      content: "Status inquiry - 7 days no response",
      response: "Processing, no timeline available",
      responseDate: "2024-01-27"
    }
  ],
  
  // Escalation tracking
  escalation: {
    level: 1, // 0=none, 1=supervisor, 2=regulatory
    nextAction: "2024-02-03",
    reason: "14 days no substantive response"
  },
  
  // Required documents
  requiredDocs: [
    {
      type: "death_certificate",
      status: "submitted",
      date: "2024-01-20"
    },
    {
      type: "letters_testamentary", 
      status: "submitted",
      date: "2024-01-20"
    },
    {
      type: "beneficiary_forms",
      status: "pending",
      reason: "Waiting for Fidelity to provide forms"
    }
  ]
}
```

#### AI Follow-up Engine:
```javascript
// Auto-generate escalation emails based on timeline
function generateFollowUp(asset, daysSinceLastContact) {
  if (daysSinceLastContact >= 14 && asset.escalation.level === 0) {
    return {
      type: "supervisor_escalation",
      template: "fidelity_supervisor_escalation",
      urgency: "high",
      ccAttorney: true
    };
  }
  
  if (daysSinceLastContact >= 7 && asset.escalation.level === 0) {
    return {
      type: "status_inquiry", 
      template: "fidelity_status_followup",
      urgency: "medium"
    };
  }
}
```

### Phase 4: Debt & Claims Waiting Periods
**The Liability Problem:** Executors don't know when distribution is safe

#### MVP Features: Jurisdiction-Specific Timers
```javascript
const waitingPeriods = {
  jurisdiction: "California",
  creditorNotice: {
    published: "2024-01-25",
    publicationPeriod: 90, // days
    claimDeadline: "2024-04-25",
    daysRemaining: 45,
    status: "active"
  },
  warnings: [
    {
      type: "liability_warning",
      message: "Distribution before April 25, 2024 creates personal liability for executor",
      severity: "high"
    }
  ],
  safeToDistribute: false,
  reason: "Creditor claim period still active"
}
```

### Phase 5: Tax Filings
**The Coordination Problem:** CPAs and attorneys operate in silos

#### MVP Features: Conditional Tax Checklist
```javascript
const taxRequirements = {
  estateValue: 800000,
  requirements: [
    {
      type: "final_personal_return",
      required: true,
      deadline: "2024-04-15",
      assignedTo: "cpa",
      status: "in_progress",
      documentsNeeded: ["W2s", "1099s", "bank_statements"]
    },
    {
      type: "estate_income_tax", 
      required: true, // Estate earned income > $600
      deadline: "2024-04-15",
      assignedTo: "cpa",
      status: "pending",
      reason: "Waiting for final account statements"
    },
    {
      type: "federal_estate_tax",
      required: false, // Under $12.92M threshold
      reason: "Estate value below federal exemption"
    }
  ]
}
```

### Phase 6: Asset Distribution
**The Audit Trail Problem:** Disputes arise from lack of transparency

#### MVP Features: Distribution Ledger
```javascript
const distributionLedger = {
  totalEstate: 750000,
  distributions: [
    {
      beneficiary: "John Smith",
      plannedAmount: 375000,
      completedAmount: 0,
      assets: [
        {
          type: "cash",
          source: "Chase_checking",
          amount: 50000,
          status: "ready",
          releaseDate: null
        },
        {
          type: "investment",
          source: "Fidelity_401k", 
          amount: 325000,
          status: "pending_transfer",
          expectedDate: "2024-03-15"
        }
      ],
      receipts: {
        signed: false,
        method: "docusign",
        status: "pending"
      }
    }
  ]
}
```

### Phase 7: Estate Closure
**The Completeness Problem:** Missing one document reopens the process

#### MVP Features: Close-Readiness Checklist
```javascript
const closeReadiness = {
  requirements: [
    {
      item: "All assets transferred",
      status: "complete",
      completedDate: "2024-03-20"
    },
    {
      item: "Final tax returns filed",
      status: "complete", 
      completedDate: "2024-04-15"
    },
    {
      item: "Beneficiary receipts signed",
      status: "pending",
      missing: ["John Smith receipt"]
    },
    {
      item: "Final accounting prepared",
      status: "in_progress",
      assignedTo: "attorney"
    }
  ],
  readyToClose: false,
  blockers: ["Beneficiary receipts", "Final accounting"]
}
```

## MVP Database Schema

### Core Tables:
```sql
-- Estates
CREATE TABLE estates (
  id UUID PRIMARY KEY,
  deceased_name VARCHAR(255),
  date_of_death DATE,
  jurisdiction VARCHAR(100),
  executor_id UUID,
  attorney_id UUID,
  status VARCHAR(50),
  created_at TIMESTAMP
);

-- Assets (The Core Entity)
CREATE TABLE assets (
  id UUID PRIMARY KEY,
  estate_id UUID REFERENCES estates(id),
  institution VARCHAR(255),
  account_type VARCHAR(100),
  account_number VARCHAR(100),
  estimated_value DECIMAL(12,2),
  status VARCHAR(50),
  last_contact_date DATE,
  next_action_date DATE,
  escalation_level INTEGER DEFAULT 0
);

-- Communications Log
CREATE TABLE communications (
  id UUID PRIMARY KEY,
  asset_id UUID REFERENCES assets(id),
  date DATE,
  type VARCHAR(100),
  method VARCHAR(50),
  content TEXT,
  response TEXT,
  response_date DATE
);

-- Document Tracking
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  estate_id UUID REFERENCES estates(id),
  asset_id UUID REFERENCES assets(id),
  document_type VARCHAR(100),
  status VARCHAR(50),
  file_path VARCHAR(500),
  submitted_date DATE
);
```

## MVP User Interface Priorities

### 1. Asset Dashboard (Primary View)
```
Estate: John Doe (Died: Jan 1, 2024)
Status: Asset Discovery Phase

Assets (5 total):
┌─────────────────────────────────────────────────────┐
│ 🔴 Fidelity 401k - $150k                          │
│    Status: In Review (14 days)                     │
│    Next: Supervisor escalation (Due: Feb 3)        │
│    Last: "Processing, no timeline" (Jan 27)        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 🟡 Chase Checking - $25k                           │
│    Status: Docs Submitted (7 days)                 │
│    Next: Follow-up call (Due: Feb 1)               │
│    Last: "Received documents" (Jan 25)             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 🟢 Invesco IRA - $75k                              │
│    Status: Completed                                │
│    Transferred: Jan 30, 2024                       │
└─────────────────────────────────────────────────────┘
```

### 2. Jurisdiction-Aware Checklist
```
California Estate Checklist:
✅ Death certificates ordered (10 copies)
✅ Letters Testamentary received
🔄 Creditor notice published (45 days remaining)
⏳ Asset discovery (3 of 5 complete)
❌ Tax returns (waiting for final statements)
```

### 3. Communication Timeline
```
Fidelity 401k Timeline:
Jan 20: Initial packet submitted
Jan 27: Status inquiry call → "Processing"
Feb 3:  Supervisor escalation (SCHEDULED)
Feb 10: Regulatory complaint (IF NO RESPONSE)
```

## Technical Architecture (MVP)

### Backend: Node.js/Express + PostgreSQL
```javascript
// Core API endpoints
app.post('/api/estates', createEstate);
app.get('/api/estates/:id/assets', getAssets);
app.post('/api/assets/:id/communications', logCommunication);
app.get('/api/assets/:id/next-actions', getNextActions);
app.post('/api/communications/send', sendAutomatedFollowup);
```

### Frontend: React + Real-time Updates
```javascript
// Asset status component
function AssetCard({ asset }) {
  const daysWaiting = daysSince(asset.lastContactDate);
  const urgency = daysWaiting > 14 ? 'high' : daysWaiting > 7 ? 'medium' : 'low';
  
  return (
    <div className={`asset-card urgency-${urgency}`}>
      <h3>{asset.institution} {asset.accountType}</h3>
      <StatusBadge status={asset.status} />
      <Timeline communications={asset.communications} />
      <NextAction action={asset.nextAction} />
    </div>
  );
}
```

## Key Success Metrics

### User Engagement:
- **Daily active usage** during asset discovery phase
- **Communication logging rate** (>80% of interactions tracked)
- **Escalation success rate** (>90% response within 7 days)

### Business Impact:
- **Time to settlement** (target: 50% reduction)
- **Executor satisfaction** (target: 4.5+ stars)
- **Attorney efficiency** (target: 3x more estates per staff)

## What NOT to Build (MVP Discipline)

### Delay for Later:
- ❌ Bank API integrations (manual entry is fine)
- ❌ Concierge services (automation first)
- ❌ International support (US-only)
- ❌ Mobile app (responsive web)
- ❌ Advanced reporting (basic status only)
- ❌ Multi-language support (English only)

### Focus Ruthlessly On:
- ✅ Asset-centric tracking
- ✅ Communication logging
- ✅ Escalation timers
- ✅ Document vault
- ✅ Jurisdiction checklists

This MVP directly addresses the "black hole phase" where Reddit complaints are concentrated, creating immediate value for the highest-pain part of the process.