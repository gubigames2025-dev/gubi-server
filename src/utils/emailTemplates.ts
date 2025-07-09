export function wrapEmail(title: string, content: string): string {
    return `
<!DOCTYPE html>
<html lang="pt-BR"><head>
    <meta charset="UTF-8">
    <title>${title}</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 660px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); padding: 40px 30px;">
                    ${content}
    </table>
  </body>
</html>
    `;
}

export function registerEmailBody(userName: string): string {
    return `
        <tbody><tr>
        <td align="center">
          <h2 style="color: #8f49cb; margin-bottom: 10px;">
            ✨ Seja bem-vindo, ${userName}!
          </h2>
        </td>
      </tr>

      <tr>
        <td align="center">
          <p style="font-size: 16px; line-height: 1.6; margin: 20px 0 10px 0; max-width: 400px;">
            Parabéns! Sua inscrição no <strong>Jornada ProFuturo</strong> foi concluída com sucesso. Agora você tem acesso exclusivo ao <strong>Discovery</strong>, um jogo interativo que vai te ajudar a conhecer melhor seu perfil profissional e suas preferências de carreira.
          </p>
        </td>
      </tr>

      <tr>
        <td align="center">
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 10px 0; max-width: 400px;">
            Antes de começar, leia com atenção e responda com sinceridade — isso será essencial para traçar um resultado alinhado com quem você é.
          </p>
        </td>
      </tr>

      <tr>
        <td align="center" style="padding: 30px 0;">
          <a href="https://discovery.gubi.com.br" style="text-decoration: none;">
            <button style="
              background-color: #8f49cb;
              color: white;
              padding: 12px 24px;
              font-size: 16px;
              border: none;
              border-radius: 6px;
              cursor: pointer;
            ">
              🎮 Iniciar sua jornada
            </button>
          </a>
        </td>
      </tr>

      <tr>
        <td align="center">
          <p style="font-size: 12px; color: #666; max-width: 400px;">
            Se tiver qualquer problema, entre em contato com a nossa equipe de suporte.
          </p>
        </td>
      </tr>
    </tbody>
    `;
}

export function resumeEmailBody(userName: string, fileUrl: string): string {
    return `
        <tbody><tr>
        <td align="center">
          <h2 style="color: #8f49cb; margin-bottom: 10px;">
            🎉 Parabéns, ${userName}!
          </h2>
        </td>
      </tr>

      <tr>
        <td align="center">
          <p style="font-size: 16px; line-height: 1.6; margin: 20px 0 10px 0; max-width: 400px;">
            Você finalizou a experiência interativa que prepara você para refletir sobre seu futuro profissional!
          </p>
        </td>
      </tr>

      <tr>
        <td align="center">
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 10px 0; max-width: 400px;">
            Agora você pode baixar o seu relatório personalizado com orientações exclusivas.
          </p>
        </td>
      </tr>

      <tr>
        <td align="center" style="padding: 30px 0;">
          <a href="${fileUrl}" download="" style="text-decoration: none;">
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
        </td>
      </tr>

      <tr>
        <td align="center">
          <p style="font-size: 12px; color: #666; max-width: 400px;">
            Se tiver qualquer problema com o download, entre em contato com a nossa equipe de suporte.
          </p>
        </td>
      </tr>
    </tbody>
    `;
}