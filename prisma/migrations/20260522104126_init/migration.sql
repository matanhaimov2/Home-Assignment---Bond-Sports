-- CreateTable
CREATE TABLE "accounts" (
    "accountId" SERIAL NOT NULL,
    "personId" INTEGER NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dailyWithdrawalLimit" DOUBLE PRECISION NOT NULL,
    "activeFlag" BOOLEAN NOT NULL DEFAULT true,
    "accountType" INTEGER NOT NULL,
    "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("accountId")
);

-- CreateTable
CREATE TABLE "transactions" (
    "transactionId" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("transactionId")
);

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;
