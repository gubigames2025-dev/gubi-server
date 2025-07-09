import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import sendEmail from "../utils/sendEmail";

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

    await sendEmail({
      toEmail: email,
      toName: user.name,
      subject: "Seus resultados!",
      htmlContent: `
        <!DOCTYPE html>
        <html lang="pt-BR">
          <head>
            <meta charset="UTF-8" />
            <title>Resultados Disponíveis</title>
          </head>
          <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333;">
            <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
              <h2 style="color: oklch(0.565 0.258 289.042);">Parabéns!</h2>
              <p style="font-size: 16px; line-height: 1.5;">
                Você concluiu todos os testes. Agora você pode baixar seus resultados clicando no botão abaixo:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${fileUrl}" download style="text-decoration: none;">
                  <button style="background-color: oklch(0.565 0.258 289.042); color: white; padding: 12px 24px; font-size: 16px; border: none; border-radius: 6px; cursor: pointer;">
                    Baixar Resultado
                  </button>
                </a>
              </div>
              <p style="font-size: 14px; color: #666;">
                Se você tiver qualquer problema com o download, entre em contato conosco.
              </p>
            </div>
          </body>
        </html>
      `,
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