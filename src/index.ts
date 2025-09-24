import express from 'express';
import cors from 'cors';
import path from 'path';
import authRouter from "./routes/auth";
import discoveryRouter from "./routes/discovery";
import profileRouter from "./routes/profile";
import emailTestRouter from "./routes/email-test";
import { setupSwagger } from './swagger';

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Swagger docs em português disponível em ambos ambientes
setupSwagger(app);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/discovery', discoveryRouter);
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/email-test', emailTestRouter);


// Exporta o app para uso em serverless (Vercel)
export default app;

// Executa localmente apenas se chamado diretamente
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}