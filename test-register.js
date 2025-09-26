// Teste para reproduzir o erro do registro
import fetch from 'node-fetch';

const testPayload = {
  fullName: "Wilson Andrade",
  email: "rasystemsistemas+test@gmail.com", // Mudando email para não conflitar
  password: "Suporte@1",
  gender: "masculino",
  location: "Águas da Prata - SP",
  phone: "(11)99238-5778",
  userInterests: ["saude", "comunicacao"], // Removendo "ciencias" que não existe
  userSkills: ["comunicacao"], // Removendo "pratica" e "digital" que não existem
  workPreference: "equilibrio",
  acceptsDataUsage: true,
  acceptsTerms: true
};

async function testRegister() {
  try {
    console.log('🧪 Testando registro com payload:', JSON.stringify(testPayload, null, 2));
    
    const response = await fetch('http://localhost:3001/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testPayload)
    });

    const result = await response.text();
    
    console.log('\n📊 Resultado:');
    console.log('Status:', response.status);
    console.log('Response:', result);
    
    if (response.ok) {
      console.log('✅ Registro bem-sucedido!');
    } else {
      console.log('❌ Erro no registro');
    }
    
  } catch (error) {
    console.error('💥 Erro ao testar:', error.message);
  }
}

testRegister();