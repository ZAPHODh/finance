-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "cnh" TEXT,
ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cep" TEXT,
ADD COLUMN     "cpfCnpj" TEXT,
ADD COLUMN     "phone" TEXT;
