# Forms Directory

This directory contains PDF forms for various financial institutions that users can fill and fax directly from the platform.

## Structure

```
forms/
├── metadata.json          # Form definitions and field mappings
├── README.md             # This file
├── fidelity/             # Fidelity forms
│   ├── fidelity-estate-settlement-packet.pdf
│   └── fidelity-transfer-request.pdf
├── vanguard/             # Vanguard forms (future)
└── schwab/               # Schwab forms (future)
```

## Adding New Forms

1. **Add the PDF file** to the appropriate institution folder
2. **Update metadata.json** with form definition:
   - Form ID (unique identifier)
   - Form name and description
   - Field mappings (which estate data maps to which form fields)
   - Fax information (recipient name, fax number)

## Field Mapping

Fields can be auto-populated from estate data using the `estateField` property:

- `deceasedInfo.fullName` - Deceased's full name
- `deceasedInfo.dateOfDeath` - Date of death
- `deceasedSSN` - Deceased's SSN (encrypted)
- `user.name` - Executor's name
- `user.email` - Executor's email
- `asset.accountNumber` - Account number
- `asset.type` - Asset type
- `asset.value` - Asset value

## Form Types

### Estate Settlement Packet
Complete packet for settling accounts, typically includes:
- Death certificate request
- Letters Testamentary verification
- Account closure/transfer request
- Beneficiary designation verification

### Transfer Request
Specific form for transferring or closing individual accounts.

### Beneficiary Claim
Form for beneficiaries to claim their distributions.

## Fax Integration

Forms are sent via PamFax API:
- Cost: ~$0.07 per page
- Delivery confirmation included
- Automatic retry on failure
- Status tracking in database

## Future Enhancements

- [ ] OCR to detect form fields automatically
- [ ] Smart field detection (AI-powered)
- [ ] Multi-institution form library
- [ ] Form templates for custom letters
- [ ] E-signature integration
- [ ] Direct API submission (when available)
