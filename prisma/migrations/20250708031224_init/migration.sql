-- CreateEnum
CREATE TYPE "UserInterestEnum" AS ENUM ('saude', 'tecnologia', 'negocios', 'engenharia', 'arte_design', 'comunicacao', 'meio_ambiente', 'educacao', 'empreendedorismo', 'financas');

-- CreateEnum
CREATE TYPE "UserSkillEnum" AS ENUM ('comunicacao', 'organizacao', 'criatividade', 'logica', 'lideranca', 'adaptabilidade', 'trabalho_equipe', 'idiomas', 'programacao', 'excel', 'ferramentas_digitais', 'resolucao_problemas');

-- CreateEnum
CREATE TYPE "TwoYearGoalsEnum" AS ENUM ('conseguir_emprego', 'ingressar_faculdade', 'curso_tecnico', 'empreender', 'aprender_ferramenta_tecnica', 'melhorar_habilidades_sociais', 'fazer_intercambio', 'aprender_idioma', 'ainda_nao_sei');

-- CreateEnum
CREATE TYPE "SoftSkillEnum" AS ENUM ('comunicacao', 'criatividade', 'persistencia', 'organizacao', 'trabalho_equipe', 'empatia', 'lideranca', 'flexibilidade', 'resolucao_problemas', 'inteligencia_emocional');

-- CreateEnum
CREATE TYPE "HardSkillEnum" AS ENUM ('excel', 'power_bi', 'canva', 'python', 'banco_dados', 'atendimento_cliente', 'criacao_conteudo', 'vendas', 'design_grafico', 'nenhuma');

-- CreateEnum
CREATE TYPE "DifficultiesEnum" AS ENUM ('organizacao', 'entendimento', 'ansiedade', 'carreira', 'estrutura_de_estudo', 'nenhuma');

-- CreateEnum
CREATE TYPE "DevicesEnum" AS ENUM ('celular', 'computador', 'tablet', 'nenhum');

-- CreateEnum
CREATE TYPE "DiscoveryLevel" AS ENUM ('library', 'florest', 'city', 'cybercity');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "customGender" TEXT,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interests" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "userInterests" "UserInterestEnum"[],
    "customInterest" TEXT,
    "workPreference" TEXT NOT NULL,
    "workEnvironment" TEXT NOT NULL,
    "companyTpe" TEXT NOT NULL,
    "userSkills" "UserSkillEnum"[],
    "customSkill" TEXT,

    CONSTRAINT "Interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "grade" TEXT NOT NULL,
    "wantsFaculty" TEXT NOT NULL,
    "currentInstitution" TEXT,
    "institution" TEXT,
    "studyFormat" TEXT NOT NULL,
    "needsFinancialSupport" TEXT NOT NULL,
    "wantsFinancialInfo" TEXT NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "twoYearGoals" "TwoYearGoalsEnum"[],
    "workWhileStudying" TEXT NOT NULL,
    "hasInternshipExperience" TEXT NOT NULL,

    CONSTRAINT "Employment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skills" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "softSkills" "SoftSkillEnum"[],
    "skillsToImprove" "SoftSkillEnum"[],
    "hardSkills" "HardSkillEnum"[],
    "learningPreference" TEXT NOT NULL,
    "studyFrequency" TEXT NOT NULL,

    CONSTRAINT "Skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenges" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "currentDifficulties" "DifficultiesEnum"[],
    "thoughtAboutQuitting" TEXT NOT NULL,
    "internetAccess" TEXT NOT NULL,
    "availableDevices" "DevicesEnum"[],

    CONSTRAINT "Challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Socioeconomic" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "participatesInSocialProgram" TEXT NOT NULL,
    "socialProgram" TEXT NOT NULL,
    "householdSize" TEXT NOT NULL,
    "peopleWithIncome" TEXT NOT NULL,

    CONSTRAINT "Socioeconomic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Completion" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "howFoundUs" TEXT NOT NULL,
    "customHowFoundUs" TEXT NOT NULL,
    "acceptsTerms" BOOLEAN NOT NULL,
    "acceptsDataUsage" BOOLEAN NOT NULL,

    CONSTRAINT "Completion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscoveryProgress" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "completedLevels" "DiscoveryLevel"[],
    "answers" TEXT[],

    CONSTRAINT "DiscoveryProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Interests_userId_key" ON "Interests"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Education_userId_key" ON "Education"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Employment_userId_key" ON "Employment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Skills_userId_key" ON "Skills"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Challenges_userId_key" ON "Challenges"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Socioeconomic_userId_key" ON "Socioeconomic"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Completion_userId_key" ON "Completion"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscoveryProgress_userId_key" ON "DiscoveryProgress"("userId");

-- AddForeignKey
ALTER TABLE "Interests" ADD CONSTRAINT "Interests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employment" ADD CONSTRAINT "Employment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skills" ADD CONSTRAINT "Skills_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenges" ADD CONSTRAINT "Challenges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Socioeconomic" ADD CONSTRAINT "Socioeconomic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Completion" ADD CONSTRAINT "Completion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscoveryProgress" ADD CONSTRAINT "DiscoveryProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
