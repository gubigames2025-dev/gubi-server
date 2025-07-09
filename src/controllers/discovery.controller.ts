import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import sendEmail from "../utils/sendEmail";
import { wrapEmail, resumeEmailBody } from "../utils/emailTemplates";

const prisma = new PrismaClient();

export const updateDiscoveryProgress = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = (req as any).id;
    const { completedLevels, answers } = req.body;

    if (!id || !Array.isArray(completedLevels) || !Array.isArray(answers)) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    if (answers.length !== 26) {
      return res.status(400).json({ error: "Must have exactly 26 answers" });
    }

    await prisma.discoveryProgress.upsert({
      where: { userId: id },
      create: {
        userId: id,
        completedLevels,
        answers,
      },
      update: {
        completedLevels,
        answers,
      },
    });

    return res.status(200).json({ message: "Updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const sendResume = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = (req as any).id;
    const email = (req as any).email;
    const { number } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!number)
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });

    if (!user)
      return res.status(404).json({ error: "Usuário não encontrado" });

    const fileUrl = `https://old.gubi.com.br/resume/${number}.pdf`;
    const logoUrl = "../assets/images/gubi-logo.png";

    const bodyHtml = resumeEmailBody(user.name, fileUrl, logoUrl);
    const htmlContent = wrapEmail(bodyHtml);

    await sendEmail({
      toEmail: email,
      toName: user.name,
      subject: "Seu Relatório de Orientação Profissional",
      htmlContent
    });

    await prisma.discoveryProgress.update({
      where: { userId: id },
      data: { resume: number },
    });

    return res.json({ type: "success", status: "Email enviado e resumo atualizado com sucesso." });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ type: "error", status: "Erro interno, tente novamente mais tarde." });
  }
}