-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'LAWYER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'PENDING', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ConsultationStatus" AS ENUM ('REQUESTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'REFUNDED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "profilePhoto" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lawyers" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "bar_council_number" TEXT NOT NULL,
    "experience" INTEGER NOT NULL,
    "consultation_fee" DECIMAL(10,2) NOT NULL,
    "bio" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "languages" TEXT[],
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lawyers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "practice_areas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "practice_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "educations" (
    "id" TEXT NOT NULL,
    "lawyer_id" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "institute" TEXT NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "educations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiences" (
    "id" TEXT NOT NULL,
    "lawyer_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "years" INTEGER NOT NULL,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "availability" (
    "id" TEXT NOT NULL,
    "lawyer_id" TEXT NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,

    CONSTRAINT "availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultations" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "lawyer_id" TEXT NOT NULL,
    "consultation_date" TIMESTAMP(3) NOT NULL,
    "status" "ConsultationStatus" NOT NULL DEFAULT 'REQUESTED',
    "notes" TEXT,
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "document_urls" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "lawyer_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "lawyer_id" TEXT,
    "document_name" TEXT NOT NULL,
    "document_url" TEXT NOT NULL,
    "mime_type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LawyerPracticeAreas" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LawyerPracticeAreas_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "lawyers_user_id_key" ON "lawyers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "lawyers_bar_council_number_key" ON "lawyers"("bar_council_number");

-- CreateIndex
CREATE UNIQUE INDEX "practice_areas_name_key" ON "practice_areas"("name");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_customer_id_lawyer_id_key" ON "reviews"("customer_id", "lawyer_id");

-- CreateIndex
CREATE INDEX "_LawyerPracticeAreas_B_index" ON "_LawyerPracticeAreas"("B");

-- AddForeignKey
ALTER TABLE "lawyers" ADD CONSTRAINT "lawyers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "educations" ADD CONSTRAINT "educations_lawyer_id_fkey" FOREIGN KEY ("lawyer_id") REFERENCES "lawyers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_lawyer_id_fkey" FOREIGN KEY ("lawyer_id") REFERENCES "lawyers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability" ADD CONSTRAINT "availability_lawyer_id_fkey" FOREIGN KEY ("lawyer_id") REFERENCES "lawyers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_lawyer_id_fkey" FOREIGN KEY ("lawyer_id") REFERENCES "lawyers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_lawyer_id_fkey" FOREIGN KEY ("lawyer_id") REFERENCES "lawyers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_lawyer_id_fkey" FOREIGN KEY ("lawyer_id") REFERENCES "lawyers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LawyerPracticeAreas" ADD CONSTRAINT "_LawyerPracticeAreas_A_fkey" FOREIGN KEY ("A") REFERENCES "lawyers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LawyerPracticeAreas" ADD CONSTRAINT "_LawyerPracticeAreas_B_fkey" FOREIGN KEY ("B") REFERENCES "practice_areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
