-- Add composite unique keys to enforce enrollment-request vacancy consistency.

CREATE UNIQUE INDEX "enrollment_request_id_student_period_vacancy_uq"
ON "ENROLLMENT_REQUEST" ("id", "student_id", "period_id", "vacancy_id");

CREATE UNIQUE INDEX "enrollment_request_student_period_vacancy_uq"
ON "ENROLLMENT" ("request_id", "student_id", "period_id", "vacancy_id");

-- Replace the previous composite foreign key.

ALTER TABLE "ENROLLMENT"
DROP CONSTRAINT "enrollment_request_student_period_fk";

ALTER TABLE "ENROLLMENT"
ADD CONSTRAINT "enrollment_request_student_period_vacancy_fk"
FOREIGN KEY ("request_id", "student_id", "period_id", "vacancy_id")
REFERENCES "ENROLLMENT_REQUEST" ("id", "student_id", "period_id", "vacancy_id")
ON DELETE RESTRICT
ON UPDATE CASCADE;