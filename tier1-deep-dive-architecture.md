# Tier 1 Deep Dive: Core Platform Architecture

## Problem #1: Financial Institution Communication (The Black Hole)

### Technical Architecture

#### Core Data Model: Asset-Centric Tracking
```javascript
// Primary entity: Asset (not tasks or estates)
const AssetSchema = {
  id: "uuid",
  estate_id: "uuid",
  
  // Institution Details
  institution: "Fidelity", // Standardized name
  institution_type: "brokerage", // bank, brokerage, insurance, etc.
  account_type: "401k", // checking, savings, ira, 401k, etc.
  account_number: "****1234", // Masked for security
  estimated_value: 150000,
  
  // Status Tracking (The Core Innovation)
  status: "in_review", // contacted, docs_submitted, in_review, rejected, completed
  status_updated: "2024-01-27T10:30:00Z",
  days_in_current_status: 14,
  
  // Communication Timeline
  last_contact_date: "2024-01-27",
  last_contact_type: "phone", // email, phone, mail, fax
  last_response_date: "2024-01-27",
  last_response_content: "Processing, no timeline available",
  
  // Escalation Engine
  escalation_level: 1, // 0=none, 1=supervisor, 2=regulatory, 3=legal
  next_action_date: "2024-02-03",
  next_action_type: "supervisor_escalation",
  escalation_reason: "14 days no substantive response",
  
  // Document Tracking
  required_documents: [
    {
      type: "death_certificate",
      status: "submitted",
      date_submitted: "2024-01-20",
      format_required: "certified_copy", // original, certified_copy, regular_copy
      returned: false
    },
    {
      type: "letters_testamentary",
      status: "submitted", 
      date_submitted: "2024-01-20",
      format_required: "original",
      returned: true,
      return_date: "2024-01-25"
    },
    {
      type: "beneficiary_forms",
      status: "pending",
      reason: "Waiting for Fidelity to provide forms"
    }
  ],
  
  // Institution-Specific Data
  institution_config: {
    typical_processing_days: 35,
    returns_documents: true,
    preferred_contact_method: "secure_email",
    escalation_contacts: {
      customer_service: "estates@fidelity.com",
      supervisor: "estate.supervisor@fidelity.com",
      compliance: "compliance@fidelity.com"
    },
    special_requirements: ["medallion_guarantee_over_100k"]
  }
}
```

#### Communication Log Schema
```javascript
const CommunicationSchema = {
  id: "uuid",
  asset_id: "uuid",
  
  // Communication Details
  date: "2024-01-27",
  type: "follow_up", // initial_contact, follow_up, escalation, response
  method: "phone", // email, phone, mail, fax, secure_portal
  direction: "outbound", // outbound, inbound
  
  // Content
  subject: "Estate Settlement Status Inquiry - Account 12345",
  content: "Requesting status update on estate settlement submitted 1/20/24",
  
  // Response Tracking
  response_received: true,
  response_date: "2024-01-27",
  response_content: "Case is being processed, no timeline available",
  response_quality: "poor", // excellent, good, poor, none
  
  // Escalation Triggers
  triggered_escalation: false,
  escalation_reason: null,
  
  // Automation
  automated: true,
  template_used: "fidelity_14_day_followup",
  sent_by_system: true,
  reviewed_by_executor: false
}
```

#### Institution Configuration Database
```javascript
const InstitutionConfigs = {
  "Fidelity": {
    name: "Fidelity Investments",
    type: "brokerage",
    
    // Processing Characteristics
    typical_timeline: {
      simple_transfer: 21,
      complex_estate: 35,
      contested_case: 60
    },
    
    // Document Requirements
    required_documents: {
      "401k": [
        {type: "death_certificate", format: "certified_copy"},
        {type: "letters_testamentary", format: "certified_copy"},
        {type: "beneficiary_designation", format: "original"},
        {type: "distribution_election", format: "notarized"}
      ],
      "ira": [
        {type: "death_certificate", format: "certified_copy"},
        {type: "letters_testamentary", format: "certified_copy"},
        {type: "inherited_ira_application", format: "original"}
      ]
    },
    
    // Communication Preferences
    contact_methods: {
      preferred: "secure_email",
      accepted: ["secure_email", "mail", "fax"],
      phone_support: true,
      online_portal: true
    },
    
    // Escalation Chain
    escalation_contacts: {
      level_1: {
        email: "estates@fidelity.com",
        phone: "1-800-343-3548",
        department: "Estate Services"
      },
      level_2: {
        email: "estate.supervisor@fidelity.com", 
        phone: "1-800-343-3548 ext 2",
        department: "Estate Services Supervisor"
      },
      level_3: {
        email: "compliance@fidelity.com",
        department: "Compliance"
      }
    },
    
    // Behavioral Patterns (Learned from Data)
    response_patterns: {
      initial_response_time: 7, // days
      escalation_response_time: 2, // days after escalation
      regulatory_threat_response: 1, // days after regulatory mention
      success_rate_by_method: {
        "phone": 0.6,
        "email": 0.8,
        "supervisor_escalation": 0.95,
        "regulatory_threat": 0.98
      }
    },
    
    // Special Requirements
    special_rules: {
      medallion_guarantee_threshold: 100000,
      returns_original_documents: true,
      requires_estate_tax_id: true,
      processes_partial_distributions: false
    }
  },
  
  "Invesco": {
    name: "Invesco Ltd.",
    type: "investment_company",
    
    typical_timeline: {
      simple_transfer: 35,
      complex_estate: 50,
      contested_case: 90
    },
    
    required_documents: {
      "mutual_fund": [
        {type: "death_certificate", format: "original"},
        {type: "letters_testamentary", format: "original"},
        {type: "probate_closure_form", format: "notarized"}
      ]
    },
    
    contact_methods: {
      preferred: "mail",
      accepted: ["mail", "fax"],
      phone_support: true,
      online_portal: false
    },
    
    escalation_contacts: {
      level_1: {
        email: "estates@invesco.com",
        phone: "1-800-959-4246",
        department: "Client Services"
      },
      level_2: {
        phone: "1-800-959-4246",
        department: "Supervisor"
      }
    },
    
    response_patterns: {
      initial_response_time: 14,
      escalation_response_time: 7,
      regulatory_threat_response: 2,
      success_rate_by_method: {
        "phone": 0.4,
        "mail": 0.6,
        "supervisor_escalation": 0.8,
        "regulatory_threat": 0.95
      }
    },
    
    special_rules: {
      requires_original_documents: true,
      returns_original_documents: false,
      slow_processor: true,
      requires_probate_closure_form: true
    }
  }
}
```

### Automated Follow-up Engine

#### Core Algorithm
```javascript
class EscalationEngine {
  
  // Main escalation logic
  async processAssetEscalations() {
    const assetsNeedingAction = await this.getAssetsNeedingAction();
    
    for (const asset of assetsNeedingAction) {
      const action = this.determineNextAction(asset);
      await this.executeAction(asset, action);
    }
  }
  
  // Determine what action to take based on timeline and responses
  determineNextAction(asset) {
    const daysSinceLastContact = this.daysSince(asset.last_contact_date);
    const daysSinceLastResponse = this.daysSince(asset.last_response_date);
    const responseQuality = this.assessResponseQuality(asset.last_response_content);
    
    // No response escalation path
    if (!asset.last_response_date) {
      if (daysSinceLastContact >= 21) {
        return {
          type: "regulatory_threat",
          urgency: "high",
          template: "regulatory_escalation",
          cc_attorney: true
        };
      } else if (daysSinceLastContact >= 14) {
        return {
          type: "supervisor_escalation", 
          urgency: "high",
          template: "supervisor_escalation"
        };
      } else if (daysSinceLastContact >= 7) {
        return {
          type: "status_inquiry",
          urgency: "medium", 
          template: "status_followup"
        };
      }
    }
    
    // Poor response escalation path
    if (responseQuality === "poor" && daysSinceLastResponse >= 7) {
      return {
        type: "supervisor_escalation",
        urgency: "high",
        template: "poor_response_escalation",
        reason: "Inadequate response to previous inquiry"
      };
    }
    
    // Standard follow-up
    if (daysSinceLastResponse >= 14) {
      return {
        type: "timeline_inquiry",
        urgency: "medium",
        template: "timeline_request"
      };
    }
    
    return null; // No action needed
  }
  
  // Execute the determined action
  async executeAction(asset, action) {
    const email = await this.generateEmail(asset, action);
    
    // Send email
    await this.sendEmail(email);
    
    // Log communication
    await this.logCommunication(asset.id, {
      type: action.type,
      method: "email",
      content: email.content,
      automated: true,
      template_used: action.template
    });
    
    // Update asset status
    await this.updateAssetStatus(asset.id, {
      last_contact_date: new Date(),
      escalation_level: this.getEscalationLevel(action.type),
      next_action_date: this.calculateNextActionDate(action.type)
    });
    
    // Notify executor if high urgency
    if (action.urgency === "high") {
      await this.notifyExecutor(asset, action);
    }
  }
}
```

#### Email Template System
```javascript
const EmailTemplates = {
  
  // Day 7: Initial follow-up
  "status_followup": {
    subject: "Estate Settlement Status Inquiry - Account {account_number}",
    body: `Dear {institution_name} Estate Services,

We submitted estate settlement documentation on {submission_date} for the above account. 
Could you please provide a status update and expected completion timeline?

Estate Details:
- Deceased: {deceased_name}
- Date of Death: {death_date}
- Executor: {executor_name}
- Submission Reference: {tracking_number}

We appreciate your prompt attention to this matter.

Best regards,
{executor_name}
Personal Representative`,
    
    urgency: "medium",
    follow_up_days: 7
  },
  
  // Day 14: Supervisor escalation
  "supervisor_escalation": {
    subject: "URGENT: Estate Settlement Delay - Account {account_number}",
    body: `Dear {institution_name} Supervisor,

Our estate settlement submission from {submission_date} has exceeded your typical 
processing time without substantive response. This delay is causing financial 
hardship for beneficiaries who depend on these assets.

We respectfully request:
1. Immediate supervisor review of this case
2. Expedited processing with specific timeline
3. Direct contact information for status updates

If this matter is not resolved within 7 business days, we will be compelled 
to file complaints with appropriate regulatory authorities regarding potential 
violations of fiduciary duties to beneficiaries.

Estate Details:
- Deceased: {deceased_name}
- Account: {account_number}
- Days Pending: {days_pending}
- Executor: {executor_name}
- Estate Attorney: {attorney_name} - {attorney_email}

Urgent response required.

{executor_name}
Personal Representative`,
    
    urgency: "high",
    follow_up_days: 7,
    cc_attorney: true
  },
  
  // Day 21: Regulatory threat
  "regulatory_escalation": {
    subject: "FINAL NOTICE: Regulatory Complaint - Account {account_number}",
    body: `Dear {institution_name} Compliance Department,

This serves as final notice regarding unreasonable delays in estate settlement 
processing that may constitute violations of fiduciary duties to beneficiaries.

Timeline:
- Initial Submission: {submission_date}
- Days Without Resolution: {days_pending}
- Previous Follow-ups: {follow_up_count}
- Responses Received: {response_count}

Regulatory Concerns:
- Violation of reasonable processing standards
- Failure to communicate with fiduciaries
- Potential breach of fiduciary duties
- Financial harm to beneficiaries

We will file complaints with the following regulatory bodies within 48 hours 
unless this matter receives immediate attention:

- {state} Department of Financial Services
- Securities and Exchange Commission (SEC)
- Financial Industry Regulatory Authority (FINRA)
- Consumer Financial Protection Bureau (CFPB)

This situation can be resolved immediately with proper attention.

{executor_name}
Personal Representative
{attorney_name}, Esq. (Estate Counsel)`,
    
    urgency: "critical",
    follow_up_days: 2,
    cc_attorney: true,
    cc_compliance: true
  }
}
```

### User Interface Design

#### Primary Dashboard: Asset-Centric View
```jsx
function AssetDashboard({ estateId }) {
  const [assets, setAssets] = useState([]);
  const [filter, setFilter] = useState('all');
  
  return (
    <div className="asset-dashboard">
      <DashboardHeader estate={estate} />
      
      <FilterBar 
        filter={filter} 
        onFilterChange={setFilter}
        counts={{
          all: assets.length,
          pending: assets.filter(a => a.status === 'in_review').length,
          delayed: assets.filter(a => a.days_in_current_status > 14).length,
          completed: assets.filter(a => a.status === 'completed').length
        }}
      />
      
      <AssetGrid assets={filteredAssets} />
    </div>
  );
}

function AssetCard({ asset }) {
  const urgencyLevel = getUrgencyLevel(asset);
  const nextAction = getNextAction(asset);
  
  return (
    <div className={`asset-card urgency-${urgencyLevel}`}>
      <AssetHeader 
        institution={asset.institution}
        accountType={asset.account_type}
        value={asset.estimated_value}
      />
      
      <StatusSection
        status={asset.status}
        daysInStatus={asset.days_in_current_status}
        lastResponse={asset.last_response_content}
      />
      
      <TimelineSection 
        communications={asset.communications}
        nextAction={nextAction}
      />
      
      <ActionButtons 
        asset={asset}
        onManualFollowup={handleManualFollowup}
        onEscalate={handleEscalate}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
}
```

#### Communication Timeline View
```jsx
function CommunicationTimeline({ assetId }) {
  const [communications, setCommunications] = useState([]);
  
  return (
    <div className="timeline-container">
      <TimelineHeader asset={asset} />
      
      {communications.map(comm => (
        <TimelineItem 
          key={comm.id}
          communication={comm}
          showResponse={comm.response_received}
        />
      ))}
      
      <NextActionPreview 
        nextAction={asset.next_action_type}
        scheduledDate={asset.next_action_date}
        onExecuteNow={handleExecuteNow}
      />
    </div>
  );
}

function TimelineItem({ communication, showResponse }) {
  return (
    <div className="timeline-item">
      <div className="timeline-marker">
        <StatusIcon type={communication.type} />
      </div>
      
      <div className="timeline-content">
        <div className="communication-header">
          <span className="date">{formatDate(communication.date)}</span>
          <span className="type">{communication.type}</span>
          <span className="method">{communication.method}</span>
        </div>
        
        <div className="communication-body">
          <p>{communication.content}</p>
          
          {showResponse && (
            <div className="response">
              <strong>Response ({formatDate(communication.response_date)}):</strong>
              <p>{communication.response_content}</p>
              <ResponseQualityBadge quality={communication.response_quality} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

This architecture creates a self-managing system that eliminates the "black hole" problem by:

1. **Proactive Communication:** Automated follow-ups prevent silence
2. **Intelligent Escalation:** System knows when and how to escalate
3. **Institution Intelligence:** Leverages known patterns and requirements
4. **Complete Transparency:** Executor sees everything happening in real-time

The key innovation is treating each asset as an independent entity with its own communication timeline and escalation path, rather than managing estates as generic task lists.

Would you like me to continue with Problem #2 (Asset Discovery & Tracking) or dive deeper into any aspect of the communication system?