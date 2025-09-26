// Teste com o payload exato que estava falhando
const fetch = require('node-fetch');

const originalPayload = {
  fullName: "Wilson Andrade",
  email: "rasystemsistemas+test2@gmail.com", // Mudando email para não conflitar
  password: "Suporte@1",
  gender: "masculino",
  location: "Santa Adélia - SP", 
  phone: "(11)99238-5778",
  userInterests: ["saude", "ciencias", "comunicacao"],
  userSkills: ["pratica", "comunicacao", "digital"],
  workPreference: "equilibrio",
  acceptsDataUsage: true,
  acceptsTerms: true
};

async function testOriginalPayload() {
  try {
    console.log('🧪 Testando payload original que estava falhando...');
    
    const response = await fetch('https://gubi-server.onrender.com/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(originalPayload)
    });

    const result = await response.text();
    
    console.log('\n📊 Resultado:');
    console.log('Status:', response.status);
    console.log('Response:', result);
    
    if (response.ok) {
      console.log('✅ Payload original funcionando!');
    } else {
      console.log('❌ Ainda há problemas');
    }
    
  } catch (error) {
    console.error('💥 Erro ao testar:', error.message);
  }
}

testOriginalPayload();