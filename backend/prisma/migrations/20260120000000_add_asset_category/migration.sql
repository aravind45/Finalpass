-- Add category column to Asset table
ALTER TABLE "Asset" ADD COLUMN "category" VARCHAR(50);

-- Set default categories based on asset type
UPDATE "Asset" SET "category" = 
  CASE 
    WHEN "type" IN ('checking_account', 'savings_account', 'certificate_of_deposit', 'money_market_account', 'brokerage_account') THEN 'financial'
    WHEN "type" IN ('401k', '403b', '457', 'ira_traditional', 'ira_roth', 'pension') THEN 'retirement'
    WHEN "type" IN ('life_insurance', 'annuity', 'group_life_insurance', 'hsa') THEN 'insurance'
    WHEN "type" IN ('stock_options', 'rsu', 'espp', 'unpaid_compensation') THEN 'employer'
    WHEN "type" IN ('primary_residence', 'rental_property', 'automobile', 'boat') THEN 'property'
    ELSE 'other'
  END;

-- Set NOT NULL constraint after setting defaults
ALTER TABLE "Asset" ALTER COLUMN "category" SET NOT NULL;

-- Set default for new records
ALTER TABLE "Asset" ALTER COLUMN "category" SET DEFAULT 'other';

-- Create index for category queries
CREATE INDEX "idx_asset_category" ON "Asset"("category");
CREATE INDEX "idx_asset_estate_category" ON "Asset"("estateId", "category");
