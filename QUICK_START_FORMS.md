# Quick Start: Form Filling & Faxing

## For Users

### How to Send a Fax

1. **Go to Asset Detail Page**
   - Click on any asset (e.g., "Fidelity - 401(k)")

2. **Find Forms Library**
   - Scroll to "Forms & Documents" section
   - See available forms for that institution

3. **Click "Send Fax"**
   - Opens the fax wizard

4. **Select Form**
   - Choose the form you need (e.g., "Estate Settlement Packet")
   - See page count and cost estimate

5. **Fill Form**
   - Most fields are auto-filled from your estate data
   - Complete any missing required fields
   - Click "Review"

6. **Review & Send**
   - Check all information
   - Add cover page notes (optional)
   - See final cost
   - Click "Send Fax"

7. **Done!**
   - Fax sent successfully
   - You'll get a notification when delivered
   - Track status in communication log

### Cost
- **$0.07 per page**
- Typical form: 8 pages = $0.56
- Cost shown before sending

---

## For Developers

### Adding a New Form

#### Step 1: Get the PDF
Obtain the official form from the institution

#### Step 2: Add to Directory
```bash
backend/forms/[institution]/form-name.pdf
```

#### Step 3: Update Metadata
Edit `backend/forms/metadata.json`:

```json
{
  "id": "unique_form_id",
  "name": "Form Display Name",
  "institution": "Institution Name",
  "description": "Brief description",
  "fileName": "form-name.pdf",
  "pageCount": 8,
  "fields": [
    {
      "id": "field_id",
      "label": "Field Label",
      "type": "text",
      "required": true,
      "estateField": "deceasedInfo.fullName"
    }
  ],
  "faxInfo": {
    "recipientName": "Recipient Name",
    "recipientFax": "1-800-XXX-XXXX",
    "coverPageRequired": true
  }
}
```

#### Step 4: Restart Server
```bash
cd backend
npm run dev
```

#### Step 5: Test
1. Navigate to asset detail
2. Verify form appears
3. Test auto-population
4. Test faxing

### Field Types

- **text** - Single line input
- **textarea** - Multi-line input
- **date** - Date picker
- **select** - Dropdown (requires `options` array)
- **checkbox** - Boolean

### Estate Field Mapping

Available fields for auto-population:

```javascript
// Deceased information
deceasedInfo.fullName
deceasedInfo.dateOfDeath
deceasedInfo.dateOfBirth
deceasedInfo.address
deceasedSSN

// Executor information
user.name
user.email
user.phone
user.address

// Asset information
asset.accountNumber
asset.type
asset.value
asset.institution
```

### API Endpoints

```javascript
// Get all forms
GET /api/forms

// Get forms by institution
GET /api/forms/institution/:institution

// Get form details
GET /api/forms/:formId

// Auto-populate form
POST /api/forms/:formId/auto-populate
Body: { estateId, assetId }

// Fill and download PDF
POST /api/forms/:formId/fill
Body: { data: { field_id: value } }

// Fill and fax
POST /api/forms/:formId/fax
Body: { assetId, data: { field_id: value }, coverPageNotes }

// Get fax status
GET /api/forms/fax/:faxId

// Get all faxes for asset
GET /api/forms/fax/asset/:assetId

// Retry failed fax
POST /api/forms/fax/:faxId/retry
```

### Testing

#### Manual Test
```bash
# 1. Start backend
cd backend
npm run dev

# 2. Start frontend
cd frontend
npm run dev

# 3. Navigate to http://localhost:5173
# 4. Login
# 5. Go to asset detail
# 6. Click "Send Fax"
# 7. Fill and send
```

#### API Test
```powershell
# Get forms
$token = "your_jwt_token"
Invoke-RestMethod -Uri "http://localhost:3000/api/forms" -Headers @{ Authorization = "Bearer $token" }

# Auto-populate
$body = @{ estateId = "estate_id"; assetId = "asset_id" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/forms/fidelity_estate_packet/auto-populate" -Method POST -Headers @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" } -Body $body
```

---

## Configuration

### Environment Variables

Add to `backend/.env`:

```env
# PamFax Configuration
PAMFAX_USERNAME=your_username
PAMFAX_PASSWORD=your_password
PAMFAX_BASE_URL=https://sandbox-api.pamfax.biz
```

### PamFax Setup

1. **Sign up** at https://www.pamfax.biz
2. **Get credentials** (username and password)
3. **Use sandbox** for testing
4. **Switch to production** when ready

---

## Troubleshooting

### Forms Not Showing
- Check `backend/forms/metadata.json` exists
- Verify institution name matches exactly
- Restart backend server

### Auto-Population Not Working
- Check estate data exists
- Verify field mapping in metadata
- Check console for errors

### Fax Failing
- Verify PamFax credentials
- Check fax number format (numbers only)
- Check PDF file exists
- Review error message in database

### Status Not Updating
- Wait 30 seconds (auto-update interval)
- Check PamFax API status
- Review backend logs

---

## Support

### Documentation
- `FORM_FILLING_FAX_FEATURE.md` - Complete feature docs
- `backend/forms/README.md` - Forms directory guide
- `FIDELITY_CALIFORNIA_DOCUMENTS.md` - Fidelity requirements

### Contact
- GitHub Issues
- Email: support@finalpass.com
- Slack: #form-faxing

---

## FAQ

**Q: How much does it cost to send a fax?**  
A: $0.07 per page. A typical 8-page form costs $0.56.

**Q: How long does it take?**  
A: Usually 2-5 minutes. You'll get a notification when delivered.

**Q: Can I download the PDF instead of faxing?**  
A: Yes! Use the "Fill and Download" option (coming soon).

**Q: What if the fax fails?**  
A: You can retry from the fax history. We'll show you the error message.

**Q: Can I add custom forms?**  
A: Yes! Follow the "Adding a New Form" guide above.

**Q: Is my data secure?**  
A: Yes. PDFs are encrypted in transit and deleted after sending.

**Q: Can I fax to multiple recipients?**  
A: Not yet, but it's on the roadmap!

---

## Roadmap

### ✅ Phase 1 (Complete)
- Form filling
- Auto-population
- Fax integration
- Status tracking

### ⏳ Phase 2 (Next 2-3 weeks)
- Download PDF option
- OCR for field detection
- More institutions
- Batch faxing

### 🔮 Phase 3 (4-6 weeks)
- E-signature integration
- Direct API submission
- Custom letter templates
- Fax analytics

---

**Last Updated:** January 15, 2026  
**Version:** 1.0.0  
**Status:** Production Ready (pending PDF forms)
