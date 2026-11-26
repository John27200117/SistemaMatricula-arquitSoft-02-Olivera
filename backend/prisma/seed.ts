import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';

const connectionString = process.env.DATABASE_URL;

if (!connectionString?.includes('localhost:5433/matricula_test')) {
  throw new Error('Por seguridad, este seed solo puede ejecutarse contra matricula_test local.');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const id = {
  admin: '10000000-0000-4000-8000-000000000001',
  guardian: '10000000-0000-4000-8000-000000000002',
  student: '20000000-0000-4000-8000-000000000001',
  period: '30000000-0000-4000-8000-000000000001',
  newType: '40000000-0000-4000-8000-000000000001',
  transferType: '40000000-0000-4000-8000-000000000002',
  newSet: '50000000-0000-4000-8000-000000000001',
  transferSet: '50000000-0000-4000-8000-000000000002',
  grade: '60000000-0000-4000-8000-000000000001',
  sectionA: '70000000-0000-4000-8000-000000000001',
  sectionB: '70000000-0000-4000-8000-000000000002',
  vacancyA: '80000000-0000-4000-8000-000000000001',
  vacancyB: '80000000-0000-4000-8000-000000000002',
  adminRole: '90000000-0000-4000-8000-000000000001',
  guardianRole: '90000000-0000-4000-8000-000000000002',
};

async function main() {
  await prisma.role.upsert({
    where: { id: id.adminRole },
    update: {},
    create: { id: id.adminRole, code: 'ADMINISTRADOR', displayName: 'Administrador de prueba' },
  });

  await prisma.role.upsert({
    where: { id: id.guardianRole },
    update: {},
    create: { id: id.guardianRole, code: 'APODERADO', displayName: 'Apoderado de prueba' },
  });

  await prisma.userAccount.upsert({
    where: { id: id.admin },
    update: {},
    create: { id: id.admin, authSubject: 'demo-admin-local' },
  });

  await prisma.userAccount.upsert({
    where: { id: id.guardian },
    update: {},
    create: { id: id.guardian, authSubject: 'demo-guardian-local' },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: id.admin, roleId: id.adminRole } },
    update: {},
    create: { userId: id.admin, roleId: id.adminRole },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: id.guardian, roleId: id.guardianRole } },
    update: {},
    create: { userId: id.guardian, roleId: id.guardianRole },
  });

  await prisma.student.upsert({
    where: { id: id.student },
    update: {},
    create: { id: id.student },
  });

  await prisma.guardianStudent.upsert({
    where: {
      guardianUserId_studentId: {
        guardianUserId: id.guardian,
        studentId: id.student,
      },
    },
    update: {},
    create: { guardianUserId: id.guardian, studentId: id.student },
  });

  await prisma.academicPeriod.upsert({
    where: { id: id.period },
    update: {},
    create: { id: id.period },
  });

  await prisma.enrollmentType.upsert({
    where: { id: id.newType },
    update: {},
    create: { id: id.newType, code: 'NUEVO', displayName: 'MatrÃƒÂ­cula nueva (demo)', isActive: true },
  });

  await prisma.enrollmentType.upsert({
    where: { id: id.transferType },
    update: {},
    create: { id: id.transferType, code: 'TRASLADO', displayName: 'Traslado (demo)', isActive: true },
  });

  await prisma.requirementSet.upsert({
    where: { id: id.newSet },
    update: {},
    create: {
      id: id.newSet,
      enrollmentTypeId: id.newType,
      enrollmentTypeLabelSnapshot: 'MatrÃƒÂ­cula nueva (demo)',
      academicPeriodId: id.period,
      versionNo: 1,
      status: 'DRAFT',
    },
  });

  await prisma.requirementSet.upsert({
    where: { id: id.transferSet },
    update: {},
    create: {
      id: id.transferSet,
      enrollmentTypeId: id.transferType,
      enrollmentTypeLabelSnapshot: 'Traslado (demo)',
      academicPeriodId: id.period,
      versionNo: 1,
      status: 'DRAFT',
    },
  });

  const items = [
    { id: '51000000-0000-4000-8000-000000000001', requirementSetId: id.newSet, name: 'Documento de identidad (ejemplo)', description: 'Requisito ilustrativo para pruebas', isRequired: true, displayOrder: 1 },
    { id: '51000000-0000-4000-8000-000000000002', requirementSetId: id.newSet, name: 'Ficha de datos (ejemplo)', description: 'Requisito ilustrativo para pruebas', isRequired: true, displayOrder: 2 },
    { id: '52000000-0000-4000-8000-000000000001', requirementSetId: id.transferSet, name: 'Constancia de estudios (ejemplo)', description: 'Requisito ilustrativo para pruebas', isRequired: true, displayOrder: 1 },
    { id: '52000000-0000-4000-8000-000000000002', requirementSetId: id.transferSet, name: 'Documento de identidad (ejemplo)', description: 'Requisito ilustrativo para pruebas', isRequired: true, displayOrder: 2 },
  ];

  for (const item of items) {
    await prisma.requirementSetItem.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }

  // Publicar los conjuntos después de crear sus requisitos de demostración.
  await prisma.requirementSet.update({
    where: { id: id.newSet },
    data: { status: 'PUBLISHED', publishedAt: new Date() },
  });

  await prisma.requirementSet.update({
    where: { id: id.transferSet },
    data: { status: 'PUBLISHED', publishedAt: new Date() },
  });
  await prisma.grade.upsert({
    where: { id: id.grade },
    update: {},
    create: { id: id.grade },
  });

  await prisma.section.upsert({
    where: { id: id.sectionA },
    update: {},
    create: { id: id.sectionA, gradeId: id.grade },
  });

  await prisma.section.upsert({
    where: { id: id.sectionB },
    update: {},
    create: { id: id.sectionB, gradeId: id.grade },
  });

  await prisma.vacancy.upsert({
    where: { id: id.vacancyA },
    update: {},
    create: { id: id.vacancyA, periodId: id.period, gradeId: id.grade, sectionId: id.sectionA, capacity: 30, occupiedCount: 0 },
  });

  await prisma.vacancy.upsert({
    where: { id: id.vacancyB },
    update: {},
    create: { id: id.vacancyB, periodId: id.period, gradeId: id.grade, sectionId: id.sectionB, capacity: 25, occupiedCount: 0 },
  });

  console.log('Datos de demostraciÃƒÂ³n creados o ya existentes.');
  console.log('Apoderado demo: demo-guardian-local');
  console.log('Administrador demo: demo-admin-local');
  console.log('Estudiante ID:', id.student);
  console.log('Vacantes ID:', id.vacancyA, id.vacancyB);
}

main()
  .catch((error) => {
    console.error('Error al cargar datos de demostraciÃƒÂ³n:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });