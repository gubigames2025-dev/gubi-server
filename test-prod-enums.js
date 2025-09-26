// Teste para verificar se os enums foram aplicados em produção
const fetch = require('node-fetch');

const testPayload = {
  fullName: "Teste Enums Produção",
  email: "teste_enums_prod@gmail.com",
  password: "Teste@123",
  gender: "masculino",
  location: "Santa Adélia - SP",
  phone: "(11)99238-5778",
  userInterests: ["saude", "ciencias", "comunicacao"],
  userSkills: ["pratica", "comunicacao", "digital"],
  workPreference: "equilibrio",
  acceptsDataUsage: true,
  acceptsTerms: true
};

async function testProdEnum() {
  try {
    console.log('🧪 Testando enums em produção...');
    
    const response = await fetch('https://gubi-server.onrender.com/api/v1/auth/register', {
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
      console.log('✅ Enums funcionando em produção!');
    } else {
      console.log('❌ Ainda há problemas com os enums');
    }
    
  } catch (error) {
    console.error('💥 Erro ao testar:', error.message);
  }
}

testProdEnum();