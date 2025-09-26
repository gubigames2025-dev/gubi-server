import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import generateToken from "../utils/generateToken";
import sendEmail from "../utils/sendEmail";
import { wrapEmail, registerEmailBody, passwordRecoveryEmailBody } from "../utils/emailTemplates";

import { UserInterestsEnum, UserSkillsEnum } from "@prisma/client";
import { TwoYearGoalsEnum } from "@prisma/client";
import { SoftSkillsEnum, HardSkillsEnum } from "@prisma/client";
import { DifficultiesEnum, DevicesEnum } from "@prisma/client";

import { RegisterRequest } from "../types/user";

const prisma = new PrismaClient();

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    console.log('=== REGISTER REQUEST ===');
    console.log('Body received:', JSON.stringify(req.body, null, 2));
    
    const {
      fullName, email, password, country, phone,
      birthDate, gender, customGender, location,

      userInterests, customInterest, workPreference,
      workEnvironment, companyType, userSkills, customSkill,

      grade, wantsFaculty, currentInstitution, institution,
      courseName, startCourseDate, endCourseDate,
      studyFormat, needsFinancialSupport, wantsFinancialInfo,

      twoYearGoals, workWhileStudying, hasInternshipExperience,

      softSkills, skillsToImprove, hardSkills, learningPreference, studyFrequency,

      currentDifficulties, thoughtAboutQuitting, internetAccess, availableDevices,

      participatesInSocialProgram, socialProgram, householdSize, peopleWithIncome,

      howFoundUs, customHowFoundUs, acceptsTerms, acceptsDataUsage
    } = req.body as RegisterRequest;

    // Validação básica obrigatória
    if (!fullName || !email || !password || !gender || !location || !acceptsTerms || !acceptsDataUsage) {
      console.log('Missing required fields:', {
        fullName: !!fullName,
        email: !!email,
        password: !!password,
        gender: !!gender,
        location: !!location,
        acceptsTerms: !!acceptsTerms,
        acceptsDataUsage: !!acceptsDataUsage
      });
      return res.status(400).json({ 
        error: "Campos básicos obrigatórios ausentes",
        required: ["fullName", "email", "password", "gender", "location", "acceptsTerms", "acceptsDataUsage"]
      });
    }

    // if (
    //   !fullName || !email || !password || !country || !birthDate || !gender || !location ||
    //   !userInterests?.length || !workPreference || !workEnvironment || !companyType || !userSkills?.length ||
    //   !grade || !wantsFaculty || !studyFormat || !needsFinancialSupport || !wantsFinancialInfo ||
    //   !twoYearGoals?.length || !workWhileStudying || !hasInternshipExperience ||
    //   !softSkills?.length || !skillsToImprove?.length || !learningPreference || !studyFrequency ||
    //   !thoughtAboutQuitting || !internetAccess || !availableDevices?.length ||
    //   !householdSize || !peopleWithIncome || !participatesInSocialProgram ||
    //   (participatesInSocialProgram === "sim" && !socialProgram) ||
    //   !howFoundUs || (howFoundUs === "outro" && !customHowFoundUs) || !acceptsTerms || !acceptsDataUsage
    // ) {
    //   return res.status(400).json({ error: "Campos obrigatórios ausentes ou incompletos" });
    // }

    const userExists = await prisma.user.findFirst({
      where: { OR: [{ email }] },
    });

    if (userExists) return res.status(400).json({ error: "O email já está em uso!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const [name, ...lastNameParts] = fullName.split(" ");
    const lastName = lastNameParts.join(" ");

    // Função para validar e filtrar enums
    const validateEnums = (values: string[], validEnums: string[]): string[] => {
      if (!values || !Array.isArray(values)) return [];
      return values.filter(value => validEnums.includes(value));
    };

    // Valores padrão para campos obrigatórios
    const defaults = {
      country: country || 'Brasil',
      phone: phone || '',
      birthDate: birthDate ? new Date(birthDate) : new Date('2000-01-01'),
      customGender: customGender || null,
      
      // Interests
      userInterests: validateEnums(userInterests, [
        'saude', 'tecnologia', 'ciencias', 'negocios', 'engenharia', 'arte_design',
        'comunicacao', 'meio_ambiente', 'educacao', 'empreendedorismo',
        'esportes', 'financas', 'outro'
      ]),
      customInterest: customInterest || null,
      workPreference: (['estabilidade-financeira', 'equipe', 'ajudar', 'empreender', 'crescer', 'equilibrio'].includes(workPreference)) ? workPreference.replace('-', '_') : 'equilibrio',
      workEnvironment: workEnvironment || 'presencial',
      companyType: companyType || 'privada',
      userSkills: validateEnums(userSkills, [
        'pratica', 'teoria', 'comunicacao', 'criativa', 'digital',
        'organizacao', 'criatividade', 'logica', 'lideranca',
        'adaptabilidade', 'trabalho_equipe', 'idiomas', 'programacao',
        'excel', 'ferramentas_digitais', 'resolucao_problemas', 'outra'
      ]),
      customSkill: customSkill || null,
      
      // Education
      grade: grade || 'ensino_medio',
      wantsFaculty: wantsFaculty || 'sim',
      currentInstitution: currentInstitution || null,
      institution: institution || null,
      courseName: courseName || null,
      startCourseDate: startCourseDate || null,
      endCourseDate: endCourseDate || null,
      studyFormat: studyFormat || 'presencial',
      needsFinancialSupport: needsFinancialSupport || 'sim',
      wantsFinancialInfo: wantsFinancialInfo || 'sim',
      
      // Employment
      twoYearGoals: validateEnums(twoYearGoals, [
        'conseguir_emprego', 'ingressar_faculdade', 'curso_tecnico',
        'empreender', 'aprender_ferramenta_tecnica', 'melhorar_habilidades_sociais',
        'fazer_intercambio', 'aprender_idioma', 'ainda_nao_sei'
      ]),
      workWhileStudying: workWhileStudying || 'talvez',
      hasInternshipExperience: hasInternshipExperience || 'nao',
      
      // Skills
      softSkills: validateEnums(softSkills, [
        'comunicacao', 'criatividade', 'persistencia', 'organizacao',
        'trabalho_equipe', 'empatia', 'lideranca', 'flexibilidade',
        'resolucao_problemas', 'inteligencia_emocional'
      ]),
      skillsToImprove: validateEnums(skillsToImprove, [
        'comunicacao', 'criatividade', 'persistencia', 'organizacao',
        'trabalho_equipe', 'empatia', 'lideranca', 'flexibilidade',
        'resolucao_problemas', 'inteligencia_emocional'
      ]),
      hardSkills: validateEnums(hardSkills, [
        'excel', 'power_bi', 'canva', 'python', 'banco_dados',
        'atendimento_cliente', 'criacao_conteudo', 'vendas',
        'design_grafico', 'nenhuma'
      ]),
      learningPreference: learningPreference || 'visual',
      studyFrequency: studyFrequency || 'diario',
      
      // Challenges
      currentDifficulties: validateEnums(currentDifficulties, [
        'organizacao', 'entendimento', 'ansiedade', 'carreira',
        'estrutura_de_estudo', 'nenhuma'
      ]),
      thoughtAboutQuitting: thoughtAboutQuitting || 'nao',
      internetAccess: internetAccess || 'sim',
      availableDevices: validateEnums(availableDevices, [
        'celular', 'computador', 'tablet', 'nenhum'
      ]),
      
      // Socioeconomic
      participatesInSocialProgram: participatesInSocialProgram || 'nao',
      socialProgram: socialProgram || '',
      householdSize: householdSize || '1-2',
      peopleWithIncome: peopleWithIncome || '1',
      
      // Completion
      howFoundUs: howFoundUs || 'internet',
      customHowFoundUs: customHowFoundUs || null
    };

    console.log('Processed defaults:', defaults);

    const user = await prisma.user.create({
      data: {
        name,
        lastName,
        email,
        password: hashedPassword,
        country: defaults.country,
        phoneNumber: defaults.phone,
        birthDate: defaults.birthDate,
        gender,
        customGender: defaults.customGender,
        location,

        interests: {
          create: {
            userInterests: defaults.userInterests as UserInterestsEnum[],
            customInterest: defaults.customInterest,
            workPreference: defaults.workPreference,
            workEnvironment: defaults.workEnvironment,
            companyType: defaults.companyType,
            userSkills: defaults.userSkills as UserSkillsEnum[],
            customSkill: defaults.customSkill,
          },
        },
        education: {
          create: {
            grade: defaults.grade,
            wantsFaculty: defaults.wantsFaculty,
            currentInstitution: defaults.currentInstitution,
            institution: defaults.institution,
            courseName: defaults.courseName,
            startCourseDate: defaults.startCourseDate,
            endCourseDate: defaults.endCourseDate,
            studyFormat: defaults.studyFormat,
            needsFinancialSupport: defaults.needsFinancialSupport,
            wantsFinancialInfo: defaults.wantsFinancialInfo,
          },
        },
        employment: {
          create: {
            twoYearGoals: defaults.twoYearGoals as TwoYearGoalsEnum[],
            workWhileStudying: defaults.workWhileStudying,
            hasInternshipExperience: defaults.hasInternshipExperience,
          },
        },
        skills: {
          create: {
            softSkills: defaults.softSkills as SoftSkillsEnum[],
            skillsToImprove: defaults.skillsToImprove as SoftSkillsEnum[],
            hardSkills: defaults.hardSkills as HardSkillsEnum[],
            learningPreference: defaults.learningPreference,
            studyFrequency: defaults.studyFrequency,
          },
        },
        challenges: {
          create: {
            currentDifficulties: defaults.currentDifficulties as DifficultiesEnum[],
            thoughtAboutQuitting: defaults.thoughtAboutQuitting,
            internetAccess: defaults.internetAccess,
            availableDevices: defaults.availableDevices as DevicesEnum[],
          },
        },
        socioeconomic: {
          create: {
            participatesInSocialProgram: defaults.participatesInSocialProgram,
            socialProgram: defaults.socialProgram,
            householdSize: defaults.householdSize,
            peopleWithIncome: defaults.peopleWithIncome,
          },
        },
        completion: {
          create: {
            howFoundUs: defaults.howFoundUs,
            customHowFoundUs: defaults.customHowFoundUs || '',
            acceptsTerms,
            acceptsDataUsage,
          },
        },
        discoveryProgress: {
          create: {
            completedLevels: [],
            answers: Array(26).fill(""),
          },
        },
      },
    });

    console.log('User created successfully:', user.id);

    const bodyHtml = registerEmailBody(user.name);
    const htmlContent = wrapEmail("Relatório", bodyHtml);

    sendEmail({
      toEmail: user.email,
      toName: user.name,
      subject: "Bem-vindo ao Jornada ProFuturo!",
      htmlContent
    });

    const token = generateToken(user.id, user.email);
    return res.status(201).json({
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const loginDiscovery = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    let { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ error: "Preencha todos os campos!" });

    email = email.toLowerCase().trim();
    const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.toLowerCase())

    if (!isValidEmail(email))
      return res.status(400).json({ error: "Email inválido!" });

    const user = await prisma.user.findUnique({ where: { email }, include: { discoveryProgress: true } });
    if (!user) return res.status(400).json({ error: "Email e/ou senha incorretos!" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Email e/ou senha incorretos!" });

    const token = generateToken(user.id, user.email);

    return res.json({
      id: user.id,

      name: user.name,
      email: user.email,

      resume: user.discoveryProgress?.resume || null,
      completedLevels: user.discoveryProgress?.completedLevels || [],
      answers: user.discoveryProgress?.answers || Array(26).fill(""),

      token,
    });
  } catch (err) {
    next(err);
  }
};

export const checkEmailExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    let { email } = req.body;

    if (!email)
      return res
        .status(400)
        .json({ error: "Preencha o campo de email!" });

    email = email.toLowerCase().trim();

    const isValidEmail = (email: string): boolean =>
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

    if (!isValidEmail(email))
      return res.status(400).json({ error: "Email inválido!" });

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (user) {
      return res
        .status(200)
        .json({ exists: true, message: "Email já cadastrado no banco!" });
    }

    return res
      .status(200)
      .json({ exists: false, message: "Email disponível." });
  } catch (err) {
    next(err);
  }
};

export const sendRecoveryCode = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

  const code = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 5);

  await prisma.passwordReset.create({
    data: { email, code, expiresAt },
  });

  const bodyHtml = passwordRecoveryEmailBody(user.name, code);
  const htmlContent = wrapEmail("Recuperação de senha", bodyHtml);

  await sendEmail({
    toEmail: email,
    toName: user.name,
    subject: "Código de recuperação de senha",
    htmlContent
  });

  return res.status(200).json({ message: "Código enviado para o email" });
}

export const verifyRecoveryCode = async (req: Request, res: Response): Promise<any> => {
  const { email, code } = req.body;

  const record = await prisma.passwordReset.findFirst({
    where: {
      email,
      code,
      used: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!record) return res.status(400).json({ error: "Código inválido ou expirado" });

  return res.status(200).json({ message: "Código válido" });
}

export const resetPassword = async (req: Request, res: Response): Promise<any> => {
  const { email, code, newPassword } = req.body;

  const record = await prisma.passwordReset.findFirst({
    where: {
      email,
      code,
      used: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!record) return res.status(400).json({ error: "Código inválido ou expirado" });

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  await prisma.passwordReset.update({
    where: { id: record.id },
    data: { used: true },
  });

  return res.status(200).json({ message: "Senha redefinida com sucesso" });
}