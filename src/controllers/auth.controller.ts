import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken";
import sendEmail from "../utils/sendEmail";

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
      fullName, email, password, phone, birthDate,
      gender, customGender, location,

      userInterests, customInterest, workPreference,
      workEnvironment, companyType, userSkills, customSkill,

      grade, wantsFaculty, currentInstitution, institution,
      studyFormat, needsFinancialSupport, wantsFinancialInfo,

      twoYearGoals, workWhileStudying, hasInternshipExperience,

      softSkills, skillsToImprove, hardSkills, learningPreference, studyFrequency,

      currentDifficulties, thoughtAboutQuitting, internetAccess, availableDevices,

      participatesInSocialProgram, socialProgram, householdSize, peopleWithIncome,

      howFoundUs, customHowFoundUs, acceptsTerms, acceptsDataUsage
    } = req.body as RegisterRequest;

    if (
      !fullName || !email || !password || !birthDate || !gender || !location ||
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
        phoneNumber: phone,

        birthDate: new Date(birthDate),
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

    sendEmail({
      toEmail: user.email,
      toName: user.name,
      subject: "Bem-vindo ao Gubi Jornada ProFuturo!",
      htmlContent: `
        <!DOCTYPE html>
        <html lang="pt-br">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bem-vindo ao Gubi Jornada ProFuturo!</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; background-color: #fff; color: #1a1a1a; padding: 20px; margin: 0; }
              h1 { color: #007acc; }
              p { color: #333; margin-bottom: 15px; }
              a { display: inline-block; padding: 10px 20px; background-color: #007acc; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px; }
              a:link, a:visited, a:hover, a:active { color: #fff; }
            </style>
          </head>
          <body>
            <h1>Seja bem-vindo, <span>${user.name}</span>!</h1>
            <p>Parabéns! Sua inscrição no <strong>Gubi Jornada ProFuturo</strong> foi concluída com sucesso.</p>
            <p>Agora você tem acesso exclusivo ao <strong>Gubi Discovery</strong>, um jogo interativo que vai te ajudar a conhecer melhor seu perfil profissional e suas preferências de carreira.</p>
            <p>Antes de começar, leia com atenção e responda com sinceridade — isso será essencial para traçar um resultado alinhado com quem você é.</p>
            <a href="http://discovery.gubi.com.br/">JOGAR AGORA!</a>
            <p>Nos vemos lá!</p>
          </body>
        </html>
      `,
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

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ error: "Preencha todos os campos!" });

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