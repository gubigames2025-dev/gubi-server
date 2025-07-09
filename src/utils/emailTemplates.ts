export function wrapEmail(content: string): string {
    return `
        <!DOCTYPE html>
        <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <title>Relatório</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333;">
                <div style="
                    max-width: 600px;
                    margin: auto;
                    background-color: #fff;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                ">
                    ${content}
                </div>
            </body>
        </html>
    `;
}

export function resumeEmailBody(userName: string, fileUrl: string, logoUrl: string): string {
    return `
        <img src="${logoUrl}" alt="Logo da Empresa" style="max-width: 150px; margin-bottom: 20px;"/>
        <h2 style="color: #8f49cb;">🎉 Parabéns, <span style="color: #333;">${userName}</span>!</h2>
        <p style="font-size: 16px; line-height: 1.6; margin: 10px 0; max-width: 400px;">
            Você finalizou a experiência interativa que prepara você para refletir sobre seu futuro profissional!
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 10px 0; max-width: 400px;">
            Agora você pode baixar o seu relatório personalizado com orientações exclusivas.
        </p>
        <div style="margin: 30px 0;">
        <a href="${fileUrl}" download style="text-decoration: none;">
            <button style="
            background-color: #8f49cb;
            color: white;
            padding: 12px 24px;
            font-size: 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            ">
                📄 Baixar relatório
            </button>
        </a>
        </div>
        <p style="font-size: 12px; color: #666; max-width: 400px;">
            Se tiver qualquer problema com o download, entre em contato com a nossa equipe de suporte.
        </p>
    `;
}