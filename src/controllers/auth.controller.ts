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

    if (
      !fullName || !email || !password || !country || !birthDate || !gender || !location ||
      !userInterests?.length || !workPreference || !workEnvironment || !companyType || !userSkills?.length ||
      !grade || !wantsFaculty || !studyFormat || !needsFinancialSupport || !wantsFinancialInfo ||
      !twoYearGoals?.length || !workWhileStudying || !hasInternshipExperience ||
      !softSkills?.length || !skillsToImprove?.length || !learningPreference || !studyFrequency ||
      !thoughtAboutQuitting || !internetAccess || !availableDevices?.length ||
      !householdSize || !peopleWithIncome || !participatesInSocialProgram ||
      (participatesInSocialProgram === "sim" && !socialProgram) ||
      !howFoundUs || (howFoundUs === "outro" && !customHowFoundUs) || !acceptsTerms || !acceptsDataUsage
    ) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes ou incompletos" });
    }

    const userExists = await prisma.user.findFirst({
      where: { OR: [{ email }] },
    });

    if (userExists) return res.status(400).json({ error: "O email já está em uso!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const [name, ...lastNameParts] = fullName.split(" ");
    const lastName = lastNameParts.join(" ");

    const user = await prisma.user.create({
      data: {
        name,
        lastName,

        email,
        password: hashedPassword,
        country,
        phoneNumber: phone,

        birthDate: new Date(),
        gender,
        customGender,
        location,

        interests: {
          create: {
            userInterests: userInterests as UserInterestsEnum[],
            customInterest,
            workPreference,
            workEnvironment,
            companyType,
            userSkills: userSkills as UserSkillsEnum[],
            customSkill,
          },
        },
        education: {
          create: {
            grade,
            wantsFaculty,
            currentInstitution,
            institution,
            courseName,
            startCourseDate,
            endCourseDate,
            studyFormat,
            needsFinancialSupport,
            wantsFinancialInfo,
          },
        },
        employment: {
          create: {
            twoYearGoals: twoYearGoals as TwoYearGoalsEnum[],
            workWhileStudying,
            hasInternshipExperience,
          },
        },
        skills: {
          create: {
            softSkills: softSkills as SoftSkillsEnum[],
            skillsToImprove: skillsToImprove as SoftSkillsEnum[],
            hardSkills: hardSkills as HardSkillsEnum[],
            learningPreference,
            studyFrequency,
          },
        },
        challenges: {
          create: {
            currentDifficulties: currentDifficulties as DifficultiesEnum[],
            thoughtAboutQuitting,
            internetAccess,
            availableDevices: availableDevices as DevicesEnum[],
          },
        },
        socioeconomic: {
          create: {
            participatesInSocialProgram,
            socialProgram,
            householdSize,
            peopleWithIncome,
          },
        },
        completion: {
          create: {
            howFoundUs,
            customHowFoundUs,
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