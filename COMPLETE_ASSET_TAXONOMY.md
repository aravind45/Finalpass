# Complete Asset Taxonomy for Estate Settlement

## Overview

This document defines all asset types that ExpectedEstate tracks during estate settlement, organized by category with specific handling requirements for each.

---

## 1. Banking Assets

### 1.1 Checking Accounts

**Description:** Day-to-day transaction accounts with check-writing privileges

**Typical Value:** $2,000 - $50,000

**Common Institutions:**
- Chase, Bank of America, Wells Fargo, Citibank
- Credit unions (Navy Federal, PenFed)
- Regional banks

**Required Documents:**
- Death certificate (certified copy)
- Letters testamentary/administration
- Account statements
- Signature cards (if joint account)

**Processing Time:** 14-30 days

**Special Considerations:**
- **Joint accounts:** May pass directly to surviving account holder
- **Payable on Death (POD):** Bypasses probate, goes to named beneficiary
- **Automatic payments:** Must be stopped (utilities, subscriptions)
- **Outstanding checks:** Must clear before closing

**ExpectedEstate Tracking:**
```typescript
{
  assetType: 'checking_account',
  institution: 'Chase Bank',
  accountNumber: '****1234',
  value: 15000,
  ownership: 'individual', // or 'joint', 'pod'
  status: 'CONTACTED',
  lastContact: '2024-01-15',
  nextAction: 'Submit death certificate'
}
```

---

### 1.2 Savings Accounts

**Description:** Interest-bearing deposit accounts for saving money

**Typical Value:** $5,000 - $100,000

**Common Institutions:**
- Same as checking (Chase, BofA, Wells Fargo)
- Online banks (Ally, Marcus, Discover)
- High-yield savings (American Express, Capital One)

**Required Documents:**
- Death certificate (certified copy)
- Letters testamentary/administration
- Account statements
- Beneficiary designation (if applicable)

**Processing Time:** 14-30 days

**Special Considerations:**
- **Higher balances** than checking typically
- **POD/TOD designations** common
- **Joint ownership** rules vary by state
- **Interest accrual** continues until account closed

**ExpectedEstate Tracking:**
```typescript
{
  assetType: 'savings_account',
  institution: 'Ally Bank',
  accountNumber: '****5678',
  value: 45000,
  interestRate: 4.5,
  ownership: 'individual',
  status: 'IN_PROGRESS',
  documentsSubmitted: ['death_cert', 'letters_testamentary']
}
```

---

### 1.3 Certificates of Deposit (CDs)

**Description:** Time-deposit accounts with fixed interest rate and maturity date

**Typical Value:** $10,000 - $250,000

**Common Institutions:**
- Banks (Chase, BofA, Wells Fargo)
- Credit unions
- Online banks (Ally, Marcus, Discover)

**Required Documents:**
- Death certificate (certified copy)
- Letters testamentary/administration
- CD certificates
- Beneficiary designation (if applicable)

**Processing Time:** 14-45 days (may need to wait for maturity)

**Special Considerations:**
- **Early withdrawal penalties** may apply if cashed before maturity
- **Maturity dates** - may be better to wait
- **Laddered CDs** - multiple CDs with different maturity dates
- **POD designations** bypass probate
- **FDIC insured** up to $250,000 per depositor

**ExpectedEstate Tracking:**
```typescript
{
  assetType: 'certificate_of_deposit',
  institution: 'Marcus by Goldman Sachs',
  accountNumber: '****9012',
  value: 50000,
  interestRate: 5.0,
  maturityDate: '2024-06-15',
  earlyWithdrawalPenalty: 180, // days of interest
  status: 'CONTACTED',
  recommendation: 'Wait for maturity to avoid penalty'
}
```

---

### 1.4 Money Market Accounts

**Description:** Interest-bearing accounts with check-writing and debit card access

**Typical Value:** $10,000 - $200,000

**Common Institutions:**
- Banks (Chase, BofA, Wells Fargo)
- Brokerage firms (Fidelity, Schwab, Vanguard)
- Credit unions

**Required Documents:**
- Death certificate (certified copy)
- Letters testamentary/administration
- Account statements
- Beneficiary designation (if applicable)

**Processing Time:** 14-30 days

**Special Considerations:**
- **Higher interest rates** than regular savings
- **Minimum balance requirements** (typically $10K-$25K)
- **Limited transactions** (6 per month federal limit, though relaxed)
- **FDIC/SIPC insured** depending on institution type
- **May be at brokerage** (different handling than bank)

**ExpectedEstate Tracking:**
```typescript
{
  assetType: 'money_market_account',
  institution: 'Fidelity Investments',
  accountNumber: '****3456',
  value: 75000,
  interestRate: 4.8,
  minimumBalance: 25000,
  status: 'CONTACTED',
  institutionType: 'brokerage' // vs 'bank'
}
```

---

## 2. Investment Assets

### 2.1 Brokerage Accounts (Taxable)

**Description:** Investment accounts for buying/selling stocks, bonds, ETFs, mutual funds

**Typical Value:** $25,000 - $1,000,000+

**Common Institutions:**
- Fidelity, Charles Schwab, Vanguard
- E*TRADE, TD Ameritrade, Merrill Lynch
- Interactive Brokers, Robinhood

**Required Documents:**
- Death certificate (certified copy)
- Letters testamentary/administration
- Account statements
- Transfer on Death (TOD) designation (if applicable)
- Tax basis documentation

**Processing Time:** 30-60 days

**Special Considerations:**
- **Step-up in basis** for tax purposes (cost basis = date of death value)
- **TOD designations** bypass probate
- **Joint accounts** may pass to survivor
- **Margin accounts** - outstanding loans must be settled
- **Options/futures** - may need immediate action
- **Dividend/interest** continues to accrue
- **Market volatility** - timing of liquidation matters

**ExpectedEstate Tracking:**
```typescript
{
  assetType: 'brokerage_account',
  institution: 'Charles Schwab',
  accountNumber: '****7890',
  value: 450000,
  holdings: [
    { symbol: 'VTI', shares: 1000, value: 250000 },
    { symbol: 'BND', shares: 2000, value: 150000 },
    { type: 'cash', value: 50000 }
  ],
  ownership: 'individual',
  todBeneficiary: 'spouse',
  status: 'IN_PROGRESS',
  taxBasisDate: '2024-01-10'
}
```

---

### 2.2 Retirement Accounts - IRA (Traditional & Roth)

**Description:** Individual Retirement Accounts with tax advantages

**Typical Value:** $50,000 - $500,000

**Common Institutions:**
- Fidelity, Vanguard, Charles Schwab
- TD Ameritrade, E*TRADE
- Banks (Chase, BofA)

**Required Documents:**
- Death certificate (certified copy)
- Letters testamentary/administration (sometimes)
- Beneficiary designation forms
- Distribution request forms
- Tax documentation

**Processing Time:** 28-45 days

**Special Considerations:**
- **Beneficiary designation OVERRIDES will** (critical!)
- **Spouse beneficiaries** have special options (spousal rollover)
- **Non-spouse beneficiaries** must take distributions (10-year rule)
- **Traditional IRA** - distributions taxable as ordinary income
- **Roth IRA** - distributions generally tax-free
- **Required Minimum Distributions (RMDs)** - year of death RMD must be taken
- **Inherited IRA** - special account type with distribution rules
- **Multiple beneficiaries** - account can be split

**ExpectedEstate Tracking:**
```typescript
{
  assetType: 'ira_traditional',
  institution: 'Vanguard',
  accountNumber: '****2345',
  value: 350000,
  beneficiaries: [
    { name: 'Spouse', relationship: 'spouse', percentage: 100 }
  ],
  rmdRequired: true,
  rmdAmount: 14000,
  status: 'CONTACTED',
  distributionOptions: ['spousal_rollover', 'inherited_ira', 'lump_sum']
}
```

---

### 2.3 Retirement Accounts - 401(k), 403(b), 457

**Description:** Employer-sponsored retirement plans

**Typical Value:** $50,000 - $500,000+

**Common Institutions:**
- Fidelity, Vanguard, Principal Financial
- TIAA-CREF, Empower Retirement
- ADP, Paychex (small business plans)

**Required Documents:**
- Death certificate (certified copy)
- Letters testamentary/administration
- Beneficiary designation forms
- Distribution request forms
- Employment verification

**Processing Time:** 28-60 days

**Special Considerations:**
- **Beneficiary designation OVERRIDES will**
- **Spouse has special rights** (ERISA protection)
- **Vesting schedules** - employer match may not be fully vested
- **Outstanding loans** - must be repaid or treated as distribution
- **Multiple employers** - separate 401(k) at each job
- **Rollover options** - can roll to inherited IRA
- **Tax withholding** - mandatory 20% if lump sum distribution
- **ERISA rules** apply (federal law)

**ExpectedEstate Tracking:**
```typescript
{
  assetType: '401k',
  institution: 'Fidelity',
  employer: 'Tech Company Inc',
  accountNumber: '****6789',
  value: 425000,
  employeeContributions: 300000,
  employerMatch: 125000,
  vestedPercentage: 100,
  outstandingLoan: 0,
  beneficiaries: [
    { name: 'Spouse', relationship: 'spouse', percentage: 100 }
  ],
  status: 'CONTACTED',
  lastEmploymentDate: '2024-01-05'
}
```

---

### 2.4 Cash & Cash Equivalents

**Description:** Physical cash, safe deposit boxes, prepaid cards, stored value

**Typical Value:** $500 - $50,000

**Common Locations:**
- Home safe
- Safe deposit box (bank)
- Prepaid debit cards
- Gift cards
- Foreign currency
- Cryptocurrency wallets (cold storage)

**Required Documents:**
- Death certificate (for safe deposit box access)
- Letters testamentary/administration
- Safe deposit box key
- Inventory of contents

**Processing Time:** 7-30 days

**Special Considerations:**
- **Safe deposit boxes** require court order in some states
- **Physical cash** must be inventoried and secured
- **Foreign currency** must be converted and valued
- **Gift cards** may have expiration dates
- **Prepaid cards** may be difficult to recover
- **Cryptocurrency** requires private keys (often lost)
- **Collectible coins** may have numismatic value beyond face value

**ExpectedEstate Tracking:**
```typescript
{
  assetType: 'cash_physical',
  location: 'Home safe',
  value: 15000,
  currency: 'USD',
  status: 'SECURED',
  inventoryDate: '2024-01-12',
  notes: 'Cash found in home safe, counted and deposited to estate account'
},
{
  assetType: 'safe_deposit_box',
  institution: 'Chase Bank',
  boxNumber: '1234',
  value: 0, // unknown until opened
  status: 'PENDING_ACCESS',
  requiredDocuments: ['death_cert', 'letters_testamentary', 'key'],
  accessDate: null
}
```

---

## 3. Complete Asset Type Enumeration

### For Database Schema

```typescript
enum AssetType {
  // Banking
  CHECKING_ACCOUNT = 'checking_account',
  SAVINGS_ACCOUNT = 'savings_account',
  CERTIFICATE_OF_DEPOSIT = 'certificate_of_deposit',
  MONEY_MARKET_ACCOUNT = 'money_market_account',
  
  // Investment (Taxable)
  BROKERAGE_ACCOUNT = 'brokerage_account',
  MUTUAL_FUND = 'mutual_fund',
  STOCKS = 'stocks',
  BONDS = 'bonds',
  
  // Retirement
  IRA_TRADITIONAL = 'ira_traditional',
  IRA_ROTH = 'ira_roth',
  IRA_SEP = 'ira_sep',
  IRA_SIMPLE = 'ira_simple',
  PLAN_401K = '401k',
  PLAN_403B = '403b',
  PLAN_457 = '457',
  PENSION = 'pension',
  
  // Insurance
  LIFE_INSURANCE = 'life_insurance',
  ANNUITY = 'annuity',
  HEALTH_INSURANCE = 'health_insurance',
  
  // Employer Benefits
  GROUP_LIFE_INSURANCE = 'group_life_insurance',
  STOCK_OPTIONS = 'stock_options',
  RSU = 'rsu',
  ESPP = 'espp',
  HSA = 'hsa',
  UNPAID_COMPENSATION = 'unpaid_compensation',
  
  // Real Estate
  PRIMARY_RESIDENCE = 'primary_residence',
  RENTAL_PROPERTY = 'rental_property',
  VACATION_HOME = 'vacation_home',
  LAND = 'land',
  COMMERCIAL_PROPERTY = 'commercial_property',
  
  // Vehicles
  AUTOMOBILE = 'automobile',
  MOTORCYCLE = 'motorcycle',
  BOAT = 'boat',
  RV = 'rv',
  AIRCRAFT = 'aircraft',
  
  // Business
  BUSINESS_OWNERSHIP = 'business_ownership',
  PARTNERSHIP_INTEREST = 'partnership_interest',
  LLC_MEMBERSHIP = 'llc_membership',
  
  // Personal Property
  JEWELRY = 'jewelry',
  ART = 'art',
  COLLECTIBLES = 'collectibles',
  FURNITURE = 'furniture',
  ELECTRONICS = 'electronics',
  
  // Cash & Equivalents
  CASH_PHYSICAL = 'cash_physical',
  SAFE_DEPOSIT_BOX = 'safe_deposit_box',
  PREPAID_CARD = 'prepaid_card',
  GIFT_CARD = 'gift_card',
  CRYPTOCURRENCY = 'cryptocurrency',
  
  // Debts (Negative Assets)
  MORTGAGE = 'mortgage',
  AUTO_LOAN = 'auto_loan',
  CREDIT_CARD_DEBT = 'credit_card_debt',
  PERSONAL_LOAN = 'personal_loan',
  STUDENT_LOAN = 'student_loan',
  MEDICAL_DEBT = 'medical_debt',
  
  // Other
  TAX_REFUND = 'tax_refund',
  LAWSUIT_SETTLEMENT = 'lawsuit_settlement',
  ROYALTIES = 'royalties',
  INTELLECTUAL_PROPERTY = 'intellectual_property',
  OTHER = 'other'
}
```

---

## 4. Asset Categorization for UI

### Primary Categories (Dashboard View)

```typescript
const assetCategories = {
  financial: {
    name: 'Financial Accounts',
    icon: 'DollarSign',
    types: [
      'checking_account',
      'savings_account',
      'certificate_of_deposit',
      'money_market_account',
      'brokerage_account'
    ],
    color: 'blue'
  },
  
  retirement: {
    name: 'Retirement Accounts',
    icon: 'TrendingUp',
    types: [
      'ira_traditional',
      'ira_roth',
      '401k',
      '403b',
      '457',
      'pension'
    ],
    color: 'green'
  },
  
  insurance: {
    name: 'Insurance & Benefits',
    icon: 'Shield',
    types: [
      'life_insurance',
      'annuity',
      'group_life_insurance',
      'hsa'
    ],
    color: 'purple'
  },
  
  employer: {
    name: 'Employer Benefits',
    icon: 'Briefcase',
    types: [
      'stock_options',
      'rsu',
      'espp',
      'unpaid_compensation'
    ],
    color: 'orange'
  },
  
  property: {
    name: 'Real Estate & Vehicles',
    icon: 'Home',
    types: [
      'primary_residence',
      'rental_property',
      'automobile',
      'boat'
    ],
    color: 'red'
  },
  
  other: {
    name: 'Other Assets',
    icon: 'MoreHorizontal',
    types: [
      'business_ownership',
      'jewelry',
      'art',
      'cryptocurrency',
      'other'
    ],
    color: 'gray'
  }
};
```

---

## 5. Institution-Specific Handling

### Major Financial Institutions

```typescript
const institutionProfiles = {
  'Fidelity': {
    types: ['brokerage_account', '401k', 'ira_traditional', 'ira_roth'],
    estatePhone: '1-800-544-0003',
    estateEmail: 'estate@fidelity.com',
    faxNumber: '1-800-123-4567',
    processingTime: '30-45 days',
    requiredForms: ['Account Transfer Request', 'Death Certificate', 'Letters Testamentary'],
    onlinePortal: 'https://www.fidelity.com/estate-services'
  },
  
  'Vanguard': {
    types: ['brokerage_account', '401k', 'ira_traditional', 'ira_roth'],
    estatePhone: '1-800-662-7447',
    processingTime: '28-42 days',
    requiredForms: ['Transfer on Death Form', 'Death Certificate'],
    onlinePortal: 'https://investor.vanguard.com/estate-services'
  },
  
  'Charles Schwab': {
    types: ['brokerage_account', 'ira_traditional', 'ira_roth', 'checking_account'],
    estatePhone: '1-800-435-4000',
    processingTime: '30-45 days',
    requiredForms: ['Estate Settlement Form', 'Death Certificate', 'Letters Testamentary']
  },
  
  'Chase Bank': {
    types: ['checking_account', 'savings_account', 'certificate_of_deposit'],
    estatePhone: '1-800-935-9935',
    processingTime: '14-30 days',
    requiredForms: ['Affidavit of Death', 'Death Certificate', 'Letters Testamentary']
  }
};
```

---

## 6. Value Ranges & Prioritization

### Typical Value Ranges (for prioritization)

```typescript
const valueRanges = {
  tier1_critical: {
    min: 100000,
    max: Infinity,
    priority: 'high',
    description: 'High-value assets requiring immediate attention',
    examples: ['Large 401k', 'Life insurance', 'Primary residence']
  },
  
  tier2_significant: {
    min: 25000,
    max: 99999,
    priority: 'medium',
    description: 'Significant assets requiring timely processing',
    examples: ['Brokerage accounts', 'IRAs', 'Savings accounts']
  },
  
  tier3_moderate: {
    min: 5000,
    max: 24999,
    priority: 'medium',
    description: 'Moderate assets to be processed systematically',
    examples: ['Checking accounts', 'CDs', 'Small retirement accounts']
  },
  
  tier4_minor: {
    min: 0,
    max: 4999,
    priority: 'low',
    description: 'Minor assets to be collected when convenient',
    examples: ['Gift cards', 'Small savings', 'Personal property']
  }
};
```

---

## 7. Status Workflow

### Asset Processing States

```typescript
enum AssetStatus {
  DISCOVERED = 'discovered',           // Asset identified but not yet contacted
  CONTACTED = 'contacted',             // Initial contact made with institution
  DOCUMENTS_REQUESTED = 'docs_requested', // Institution requested documents
  DOCUMENTS_SUBMITTED = 'docs_submitted', // Documents sent to institution
  IN_REVIEW = 'in_review',             // Institution reviewing claim
  APPROVED = 'approved',               // Claim approved, awaiting distribution
  DISTRIBUTED = 'distributed',         // Funds/assets distributed to beneficiaries
  CLOSED = 'closed',                   // Account closed, process complete
  ESCALATED = 'escalated',             // Delayed, requires escalation
  DISPUTED = 'disputed',               // Claim disputed or denied
  ON_HOLD = 'on_hold'                  // Waiting for external factor
}
```

---

## 8. Required Documents Matrix

### By Asset Type

```typescript
const requiredDocuments = {
  checking_account: [
    'death_certificate_certified',
    'letters_testamentary',
    'account_statements'
  ],
  
  brokerage_account: [
    'death_certificate_certified',
    'letters_testamentary',
    'account_statements',
    'transfer_on_death_form',
    'tax_basis_documentation'
  ],
  
  '401k': [
    'death_certificate_certified',
    'letters_testamentary',
    'beneficiary_designation_form',
    'distribution_request_form',
    'employment_verification'
  ],
  
  life_insurance: [
    'death_certificate_certified',
    'policy_documents',
    'beneficiary_designation_form',
    'claim_form'
  ],
  
  ira_traditional: [
    'death_certificate_certified',
    'beneficiary_designation_form',
    'distribution_request_form',
    'inherited_ira_application'
  ]
};
```

---

## 9. Tax Implications by Asset Type

```typescript
const taxImplications = {
  checking_account: {
    estateTax: true,
    incomeTax: false,
    stepUpBasis: false,
    notes: 'Included in gross estate, no income tax on distribution'
  },
  
  brokerage_account: {
    estateTax: true,
    incomeTax: true, // on gains after death
    stepUpBasis: true,
    notes: 'Step-up in basis to date of death value, capital gains on post-death appreciation'
  },
  
  ira_traditional: {
    estateTax: true,
    incomeTax: true, // on distributions
    stepUpBasis: false,
    notes: 'Distributions taxed as ordinary income, no step-up in basis'
  },
  
  ira_roth: {
    estateTax: true,
    incomeTax: false,
    stepUpBasis: false,
    notes: 'Qualified distributions are tax-free'
  },
  
  life_insurance: {
    estateTax: true, // if estate is beneficiary
    incomeTax: false, // death benefit
    stepUpBasis: false,
    notes: 'Death benefit generally tax-free, interest earned is taxable'
  }
};
```

---

## 10. Integration with ExpectedEstate Platform

### Asset Discovery Flow

```
1. Document Upload → AI Extraction
   ↓
2. Identify Asset Type (checking, 401k, etc.)
   ↓
3. Create Asset Record with Institution
   ↓
4. Determine Required Documents
   ↓
5. Generate Communication Checklist
   ↓
6. Track Status Through Workflow
   ↓
7. Auto-Escalate if Delayed
   ↓
8. Mark Complete When Distributed
```

### Dashboard Display

```typescript
// Group assets by category
const assetSummary = {
  financial: {
    count: 5,
    totalValue: 250000,
    status: { contacted: 3, in_progress: 2 }
  },
  retirement: {
    count: 3,
    totalValue: 650000,
    status: { contacted: 2, approved: 1 }
  },
  insurance: {
    count: 2,
    totalValue: 500000,
    status: { contacted: 1, in_review: 1 }
  }
};
```

---

## Summary

ExpectedEstate tracks **all financial assets** in estate settlement:

### ✅ Banking Assets
- Checking, Savings, CDs, Money Market

### ✅ Investment Assets
- Brokerage accounts, Stocks, Bonds, Mutual Funds

### ✅ Retirement Assets
- IRA (Traditional & Roth), 401(k), 403(b), 457, Pensions

### ✅ Insurance Assets
- Life insurance, Annuities, Group life

### ✅ Employer Benefits
- Stock options, RSUs, Unpaid compensation, HSAs

### ✅ Cash & Equivalents
- Physical cash, Safe deposit boxes, Prepaid cards

**Total Coverage:** 40+ asset types, comprehensive tracking from discovery to distribution.
