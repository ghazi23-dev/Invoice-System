-- CreateTable
CREATE TABLE "User" (
    "User_ID" SERIAL NOT NULL,
    "UserName" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "UserEmail" TEXT NOT NULL,
    "Role" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "DateOfBirth" TEXT NOT NULL,
    "tag_actif" INTEGER NOT NULL DEFAULT 1,
    "Agency_ID" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("User_ID")
);

-- CreateTable
CREATE TABLE "Agency" (
    "Agency_ID" SERIAL NOT NULL,
    "AgencyName" TEXT NOT NULL,
    "AgencyAddress" TEXT NOT NULL,
    "AgencyPhone" TEXT NOT NULL,
    "AgencyEmail" TEXT NOT NULL,
    "AgencyLocation" TEXT NOT NULL,
    "SuperAdminID" INTEGER NOT NULL,
    "Matricule_fiscale" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "AdminID" INTEGER,

    CONSTRAINT "Agency_pkey" PRIMARY KEY ("Agency_ID")
);

-- CreateTable
CREATE TABLE "Client" (
    "Client_ID" SERIAL NOT NULL,
    "ClientName" TEXT NOT NULL,
    "ClientPhone" TEXT NOT NULL,
    "ClientEmail" TEXT NOT NULL,
    "ClientAddress" TEXT NOT NULL,
    "ClientLocation" TEXT NOT NULL,
    "Matricule_fiscale" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("Client_ID")
);

-- CreateTable
CREATE TABLE "Achat_Reservation" (
    "AchatID" SERIAL NOT NULL,
    "DATE" DATE NOT NULL,
    "AGENT" TEXT NOT NULL,
    "DESIGNATION" TEXT NOT NULL,
    "PLATEFORME" TEXT NOT NULL,
    "NOM_CLIENT" TEXT NOT NULL,
    "CONTACT_CLIENT" TEXT NOT NULL,
    "DATE_ENTREE" DATE NOT NULL,
    "REGLEMENT" TEXT NOT NULL,
    "NUMERO_RECU" TEXT NOT NULL,
    "PRIX_VENTE" DOUBLE PRECISION NOT NULL,
    "PRIX_ACHAT" DOUBLE PRECISION NOT NULL,
    "AVANCE" DOUBLE PRECISION NOT NULL,
    "RESTE" DOUBLE PRECISION NOT NULL,
    "OBSERVATION" TEXT,

    CONSTRAINT "Achat_Reservation_pkey" PRIMARY KEY ("AchatID")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "InvoiceID" SERIAL NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "InvoiceDate" DATE NOT NULL,
    "dueDate" DATE NOT NULL,
    "Status" VARCHAR(50) NOT NULL,
    "referenceNumber" TEXT,
    "DescriptionProduct" TEXT NOT NULL,
    "TotalHT" DECIMAL(10,3) NOT NULL,
    "Discount" DECIMAL(10,3) NOT NULL,
    "Tva" DECIMAL(10,3) NOT NULL,
    "Timbre_Fiscal" DECIMAL(10,3) NOT NULL,
    "TotalAmount" DECIMAL(10,3) NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("InvoiceID")
);

-- CreateTable
CREATE TABLE "InvoiceItems" (
    "InvoiceItemID" SERIAL NOT NULL,
    "InvoiceID" INTEGER NOT NULL,
    "ProductID" INTEGER NOT NULL,
    "Description" TEXT NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "DiscountType" TEXT NOT NULL,
    "DiscountValue" DECIMAL(10,3) NOT NULL,
    "Tax" TEXT NOT NULL,
    "TotalTTC" DECIMAL(10,3) NOT NULL,
    "Montant_Achat" DECIMAL(10,3),
    "Montant_Debourser" DECIMAL(10,3),
    "Notes" TEXT NOT NULL,
    "Terms" TEXT NOT NULL,
    "SignatureName" TEXT NOT NULL,
    "Discount" DOUBLE PRECISION NOT NULL,
    "Rate" DECIMAL(10,3) NOT NULL,
    "Amount" DECIMAL(10,3) NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvoiceItems_pkey" PRIMARY KEY ("InvoiceItemID")
);

-- CreateTable
CREATE TABLE "Product" (
    "ProductID" SERIAL NOT NULL,
    "Libelle" TEXT NOT NULL,
    "Type" TEXT NOT NULL,
    "Created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Tva" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("ProductID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_UserEmail_key" ON "User"("UserEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Agency_AdminID_key" ON "Agency"("AdminID");

-- AddForeignKey
ALTER TABLE "Agency" ADD CONSTRAINT "Agency_SuperAdminID_fkey" FOREIGN KEY ("SuperAdminID") REFERENCES "User"("User_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agency" ADD CONSTRAINT "Agency_AdminID_fkey" FOREIGN KEY ("AdminID") REFERENCES "User"("User_ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("Client_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItems" ADD CONSTRAINT "InvoiceItems_InvoiceID_fkey" FOREIGN KEY ("InvoiceID") REFERENCES "Invoice"("InvoiceID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItems" ADD CONSTRAINT "InvoiceItems_ProductID_fkey" FOREIGN KEY ("ProductID") REFERENCES "Product"("ProductID") ON DELETE RESTRICT ON UPDATE CASCADE;
