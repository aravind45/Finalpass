-- CreateTable
CREATE TABLE "Fax" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "recipientFax" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    "senderFax" TEXT,
    "documentType" TEXT NOT NULL,
    "documentName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "pageCount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "providerFaxId" TEXT,
    "providerStatus" TEXT,
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "cost" DECIMAL(65,30),
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fax_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Fax_assetId_idx" ON "Fax"("assetId");

-- CreateIndex
CREATE INDEX "Fax_status_idx" ON "Fax"("status");

-- CreateIndex
CREATE INDEX "Fax_createdAt_idx" ON "Fax"("createdAt");
