-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "ROLE" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,

    CONSTRAINT "ROLE_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "USER_ACCOUNT" (
    "id" UUID NOT NULL,
    "auth_subject" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "USER_ACCOUNT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "USER_ROLE" (
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "assigned_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_role_pk" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "STUDENT" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "STUDENT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GUARDIAN_STUDENT" (
    "guardian_user_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guardian_student_pk" PRIMARY KEY ("guardian_user_id","student_id")
);

-- CreateTable
CREATE TABLE "ACADEMIC_PERIOD" (
    "id" UUID NOT NULL,

    CONSTRAINT "ACADEMIC_PERIOD_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ENROLLMENT_TYPE" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,

    CONSTRAINT "ENROLLMENT_TYPE_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "REQUIREMENT_SET" (
    "id" UUID NOT NULL,
    "enrollment_type_id" UUID NOT NULL,
    "enrollment_type_label_snapshot" TEXT NOT NULL,
    "academic_period_id" UUID NOT NULL,
    "version_no" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMPTZ(6),

    CONSTRAINT "REQUIREMENT_SET_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "REQUIREMENT_SET_ITEM" (
    "id" UUID NOT NULL,
    "requirement_set_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_required" BOOLEAN NOT NULL,
    "display_order" INTEGER NOT NULL,

    CONSTRAINT "REQUIREMENT_SET_ITEM_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GRADE" (
    "id" UUID NOT NULL,

    CONSTRAINT "GRADE_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SECTION" (
    "id" UUID NOT NULL,
    "grade_id" UUID NOT NULL,

    CONSTRAINT "SECTION_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VACANCY" (
    "id" UUID NOT NULL,
    "period_id" UUID NOT NULL,
    "grade_id" UUID NOT NULL,
    "section_id" UUID NOT NULL,
    "capacity" INTEGER NOT NULL,
    "occupied_count" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "VACANCY_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ENROLLMENT_REQUEST" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "submitted_by_user_id" UUID NOT NULL,
    "vacancy_id" UUID NOT NULL,
    "period_id" UUID NOT NULL,
    "requirement_set_id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "ENROLLMENT_REQUEST_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "REQUEST_DOCUMENT" (
    "id" UUID NOT NULL,
    "request_id" UUID NOT NULL,
    "requirement_set_id" UUID NOT NULL,
    "requirement_set_item_id" UUID,
    "storage_key" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "uploaded_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "REQUEST_DOCUMENT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "REQUEST_REVIEW" (
    "id" UUID NOT NULL,
    "request_id" UUID NOT NULL,
    "actor_user_id" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "REQUEST_REVIEW_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ENROLLMENT" (
    "id" UUID NOT NULL,
    "request_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "period_id" UUID NOT NULL,
    "vacancy_id" UUID NOT NULL,
    "approved_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "ENROLLMENT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IDEMPOTENCY_RECORD" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "operation_scope" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "request_fingerprint" TEXT NOT NULL,
    "processing_status" TEXT NOT NULL,
    "response_status" INTEGER,
    "response_body" JSONB,
    "response_reference" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6),

    CONSTRAINT "IDEMPOTENCY_RECORD_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "role_code_uq" ON "ROLE"("code");

-- CreateIndex
CREATE UNIQUE INDEX "user_account_auth_subject_uq" ON "USER_ACCOUNT"("auth_subject");

-- CreateIndex
CREATE UNIQUE INDEX "enrollment_type_code_uq" ON "ENROLLMENT_TYPE"("code");

-- CreateIndex
CREATE UNIQUE INDEX "requirement_set_version_uq" ON "REQUIREMENT_SET"("enrollment_type_id", "academic_period_id", "version_no");

-- CreateIndex
CREATE UNIQUE INDEX "requirement_set_id_period_uq" ON "REQUIREMENT_SET"("id", "academic_period_id");

-- CreateIndex
CREATE UNIQUE INDEX "requirement_set_published_uq" ON "REQUIREMENT_SET"("enrollment_type_id", "academic_period_id") WHERE ("status" = 'PUBLISHED');

-- CreateIndex
CREATE UNIQUE INDEX "requirement_set_item_id_set_uq" ON "REQUIREMENT_SET_ITEM"("id", "requirement_set_id");

-- CreateIndex
CREATE UNIQUE INDEX "section_id_grade_uq" ON "SECTION"("id", "grade_id");

-- CreateIndex
CREATE INDEX "vacancy_period_grade_section_idx" ON "VACANCY"("period_id", "grade_id", "section_id");

-- CreateIndex
CREATE UNIQUE INDEX "vacancy_id_period_uq" ON "VACANCY"("id", "period_id");

-- CreateIndex
CREATE INDEX "enrollment_request_student_created_idx" ON "ENROLLMENT_REQUEST"("student_id", "created_at");

-- CreateIndex
CREATE INDEX "enrollment_request_status_created_idx" ON "ENROLLMENT_REQUEST"("status", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "enrollment_request_id_set_uq" ON "ENROLLMENT_REQUEST"("id", "requirement_set_id");

-- CreateIndex
CREATE UNIQUE INDEX "enrollment_request_id_student_period_uq" ON "ENROLLMENT_REQUEST"("id", "student_id", "period_id");

-- CreateIndex
CREATE UNIQUE INDEX "request_document_storage_key_uq" ON "REQUEST_DOCUMENT"("storage_key");

-- CreateIndex
CREATE INDEX "request_document_request_uploaded_idx" ON "REQUEST_DOCUMENT"("request_id", "uploaded_at");

-- CreateIndex
CREATE INDEX "request_review_request_created_idx" ON "REQUEST_REVIEW"("request_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "enrollment_request_uq" ON "ENROLLMENT"("request_id");

-- CreateIndex
CREATE UNIQUE INDEX "enrollment_student_period_uq" ON "ENROLLMENT"("student_id", "period_id");

-- CreateIndex
CREATE UNIQUE INDEX "enrollment_request_student_period_uq" ON "ENROLLMENT"("request_id", "student_id", "period_id");

-- CreateIndex
CREATE UNIQUE INDEX "idempotency_record_user_scope_key_uq" ON "IDEMPOTENCY_RECORD"("user_id", "operation_scope", "key");

-- AddForeignKey
ALTER TABLE "USER_ROLE" ADD CONSTRAINT "user_role_user_fk" FOREIGN KEY ("user_id") REFERENCES "USER_ACCOUNT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USER_ROLE" ADD CONSTRAINT "user_role_role_fk" FOREIGN KEY ("role_id") REFERENCES "ROLE"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GUARDIAN_STUDENT" ADD CONSTRAINT "guardian_student_guardian_fk" FOREIGN KEY ("guardian_user_id") REFERENCES "USER_ACCOUNT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GUARDIAN_STUDENT" ADD CONSTRAINT "guardian_student_student_fk" FOREIGN KEY ("student_id") REFERENCES "STUDENT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "REQUIREMENT_SET" ADD CONSTRAINT "requirement_set_enrollment_type_fk" FOREIGN KEY ("enrollment_type_id") REFERENCES "ENROLLMENT_TYPE"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "REQUIREMENT_SET" ADD CONSTRAINT "requirement_set_academic_period_fk" FOREIGN KEY ("academic_period_id") REFERENCES "ACADEMIC_PERIOD"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "REQUIREMENT_SET_ITEM" ADD CONSTRAINT "requirement_set_item_set_fk" FOREIGN KEY ("requirement_set_id") REFERENCES "REQUIREMENT_SET"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SECTION" ADD CONSTRAINT "section_grade_fk" FOREIGN KEY ("grade_id") REFERENCES "GRADE"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VACANCY" ADD CONSTRAINT "vacancy_period_fk" FOREIGN KEY ("period_id") REFERENCES "ACADEMIC_PERIOD"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VACANCY" ADD CONSTRAINT "vacancy_grade_fk" FOREIGN KEY ("grade_id") REFERENCES "GRADE"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VACANCY" ADD CONSTRAINT "vacancy_section_grade_fk" FOREIGN KEY ("section_id", "grade_id") REFERENCES "SECTION"("id", "grade_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ENROLLMENT_REQUEST" ADD CONSTRAINT "enrollment_request_student_fk" FOREIGN KEY ("student_id") REFERENCES "STUDENT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ENROLLMENT_REQUEST" ADD CONSTRAINT "enrollment_request_submitter_fk" FOREIGN KEY ("submitted_by_user_id") REFERENCES "USER_ACCOUNT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ENROLLMENT_REQUEST" ADD CONSTRAINT "enrollment_request_guardian_student_fk" FOREIGN KEY ("submitted_by_user_id", "student_id") REFERENCES "GUARDIAN_STUDENT"("guardian_user_id", "student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ENROLLMENT_REQUEST" ADD CONSTRAINT "enrollment_request_period_fk" FOREIGN KEY ("period_id") REFERENCES "ACADEMIC_PERIOD"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ENROLLMENT_REQUEST" ADD CONSTRAINT "enrollment_request_vacancy_period_fk" FOREIGN KEY ("vacancy_id", "period_id") REFERENCES "VACANCY"("id", "period_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ENROLLMENT_REQUEST" ADD CONSTRAINT "enrollment_request_requirement_set_period_fk" FOREIGN KEY ("requirement_set_id", "period_id") REFERENCES "REQUIREMENT_SET"("id", "academic_period_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "REQUEST_DOCUMENT" ADD CONSTRAINT "request_document_request_set_fk" FOREIGN KEY ("request_id", "requirement_set_id") REFERENCES "ENROLLMENT_REQUEST"("id", "requirement_set_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "REQUEST_DOCUMENT" ADD CONSTRAINT "request_document_item_set_fk" FOREIGN KEY ("requirement_set_item_id", "requirement_set_id") REFERENCES "REQUIREMENT_SET_ITEM"("id", "requirement_set_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "REQUEST_REVIEW" ADD CONSTRAINT "request_review_request_fk" FOREIGN KEY ("request_id") REFERENCES "ENROLLMENT_REQUEST"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "REQUEST_REVIEW" ADD CONSTRAINT "request_review_actor_fk" FOREIGN KEY ("actor_user_id") REFERENCES "USER_ACCOUNT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ENROLLMENT" ADD CONSTRAINT "enrollment_request_student_period_fk" FOREIGN KEY ("request_id", "student_id", "period_id") REFERENCES "ENROLLMENT_REQUEST"("id", "student_id", "period_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ENROLLMENT" ADD CONSTRAINT "enrollment_student_fk" FOREIGN KEY ("student_id") REFERENCES "STUDENT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ENROLLMENT" ADD CONSTRAINT "enrollment_period_fk" FOREIGN KEY ("period_id") REFERENCES "ACADEMIC_PERIOD"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ENROLLMENT" ADD CONSTRAINT "enrollment_vacancy_period_fk" FOREIGN KEY ("vacancy_id", "period_id") REFERENCES "VACANCY"("id", "period_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IDEMPOTENCY_RECORD" ADD CONSTRAINT "idempotency_record_user_fk" FOREIGN KEY ("user_id") REFERENCES "USER_ACCOUNT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add capacity invariants that are not represented in Prisma Schema Language.
ALTER TABLE public."VACANCY"
  ADD CONSTRAINT "vacancy_capacity_nonnegative_chk"
    CHECK ("capacity" >= 0),
  ADD CONSTRAINT "vacancy_occupied_nonnegative_chk"
    CHECK ("occupied_count" >= 0),
  ADD CONSTRAINT "vacancy_occupied_lte_capacity_chk"
    CHECK ("occupied_count" <= "capacity");

-- Keep published requirement-set history immutable. New versions are built as
-- DRAFT, populated with items, and then published.
CREATE OR REPLACE FUNCTION public.guard_requirement_set_history()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW."status" IS DISTINCT FROM 'DRAFT'
       OR NEW."published_at" IS NOT NULL
    THEN
      RAISE EXCEPTION
        'A requirement set must be created as DRAFT with no publication timestamp'
        USING ERRCODE = '55000';
    END IF;

    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' THEN
    IF OLD."status" IS DISTINCT FROM 'DRAFT' THEN
      RAISE EXCEPTION
        'A published or superseded requirement set cannot be deleted'
        USING ERRCODE = '55000';
    END IF;

    RETURN OLD;
  END IF;

  -- UPDATE: drafts may remain drafts or be published.
  IF OLD."status" = 'DRAFT' THEN
    IF NEW."status" = 'DRAFT'
       AND NEW."published_at" IS NULL
    THEN
      RETURN NEW;
    END IF;

    IF NEW."status" = 'PUBLISHED'
       AND OLD."published_at" IS NULL
       AND NEW."published_at" IS NOT NULL
    THEN
      RETURN NEW;
    END IF;

    RAISE EXCEPTION
      'A DRAFT requirement set must have no publication timestamp; publishing requires one'
      USING ERRCODE = '55000';
  END IF;

  -- A published row may only change state to SUPERSEDED. All other fields,
  -- including the publication timestamp, must remain byte-for-byte equal.
  IF OLD."status" = 'PUBLISHED' THEN
    IF NEW."status" = 'SUPERSEDED'
       AND OLD."published_at" IS NOT NULL
       AND ROW(
         NEW."id",
         NEW."enrollment_type_id",
         NEW."enrollment_type_label_snapshot",
         NEW."academic_period_id",
         NEW."version_no",
         NEW."created_at",
         NEW."published_at"
       ) IS NOT DISTINCT FROM ROW(
         OLD."id",
         OLD."enrollment_type_id",
         OLD."enrollment_type_label_snapshot",
         OLD."academic_period_id",
         OLD."version_no",
         OLD."created_at",
         OLD."published_at"
       )
    THEN
      RETURN NEW;
    END IF;

    RAISE EXCEPTION
      'A PUBLISHED requirement set is immutable; only transition to SUPERSEDED is allowed'
      USING ERRCODE = '55000';
  END IF;

  IF OLD."status" = 'SUPERSEDED' THEN
    RAISE EXCEPTION
      'A SUPERSEDED requirement set is immutable'
      USING ERRCODE = '55000';
  END IF;

  RAISE EXCEPTION
    'Unsupported requirement set state transition'
    USING ERRCODE = '55000';
END;
$function$;

CREATE TRIGGER "requirement_set_history_guard"
BEFORE INSERT OR UPDATE OR DELETE
ON public."REQUIREMENT_SET"
FOR EACH ROW
EXECUTE FUNCTION public.guard_requirement_set_history();

-- Item writes lock their parent set before checking the state. This serializes
-- item mutation against publishing/superseding that same set.
CREATE OR REPLACE FUNCTION public.guard_requirement_set_item_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  v_parent_status text;
  v_parent record;
  v_locked_count integer := 0;
  v_expected_count integer;
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT rs."status"
      INTO v_parent_status
      FROM public."REQUIREMENT_SET" AS rs
      WHERE rs."id" = NEW."requirement_set_id"
      FOR UPDATE;

    IF NOT FOUND OR v_parent_status IS DISTINCT FROM 'DRAFT' THEN
      RAISE EXCEPTION
        'Requirement items can only be added to a DRAFT requirement set'
        USING ERRCODE = '55000';
    END IF;

    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' THEN
    SELECT rs."status"
      INTO v_parent_status
      FROM public."REQUIREMENT_SET" AS rs
      WHERE rs."id" = OLD."requirement_set_id"
      FOR UPDATE;

    IF NOT FOUND OR v_parent_status IS DISTINCT FROM 'DRAFT' THEN
      RAISE EXCEPTION
        'Requirement items can only be deleted from a DRAFT requirement set'
        USING ERRCODE = '55000';
    END IF;

    RETURN OLD;
  END IF;

  -- Lock both parents in stable ID order if an item is moved between sets.
  v_expected_count :=
    CASE
      WHEN OLD."requirement_set_id" = NEW."requirement_set_id" THEN 1
      ELSE 2
    END;

  FOR v_parent IN
    SELECT rs."id", rs."status"
      FROM public."REQUIREMENT_SET" AS rs
      WHERE rs."id" IN (
        OLD."requirement_set_id",
        NEW."requirement_set_id"
      )
      ORDER BY rs."id"
      FOR UPDATE
  LOOP
    v_locked_count := v_locked_count + 1;

    IF v_parent."status" IS DISTINCT FROM 'DRAFT' THEN
      RAISE EXCEPTION
        'Requirement items can only be updated while their parent sets are DRAFT'
        USING ERRCODE = '55000';
    END IF;
  END LOOP;

  IF v_locked_count <> v_expected_count THEN
    RAISE EXCEPTION
      'The source and destination requirement sets must exist'
      USING ERRCODE = '55000';
  END IF;

  RETURN NEW;
END;
$function$;

CREATE TRIGGER "requirement_set_item_mutation_guard"
BEFORE INSERT OR UPDATE OR DELETE
ON public."REQUIREMENT_SET_ITEM"
FOR EACH ROW
EXECUTE FUNCTION public.guard_requirement_set_item_mutation();

-- Row-level DELETE triggers do not cover TRUNCATE, so block it explicitly.
CREATE OR REPLACE FUNCTION public.reject_requirement_history_truncate()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  RAISE EXCEPTION
    'TRUNCATE is not allowed for requirement history tables'
    USING ERRCODE = '55000';
END;
$function$;

CREATE TRIGGER "requirement_set_no_truncate"
BEFORE TRUNCATE
ON public."REQUIREMENT_SET"
FOR EACH STATEMENT
EXECUTE FUNCTION public.reject_requirement_history_truncate();

CREATE TRIGGER "requirement_set_item_no_truncate"
BEFORE TRUNCATE
ON public."REQUIREMENT_SET_ITEM"
FOR EACH STATEMENT
EXECUTE FUNCTION public.reject_requirement_history_truncate();
