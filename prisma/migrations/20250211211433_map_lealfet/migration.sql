/*
  Warnings:

  - Added the required column `lat` to the `OrderAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `OrderAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderAddress" ADD COLUMN     "lat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "lng" DOUBLE PRECISION NOT NULL;
