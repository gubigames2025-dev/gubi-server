const axios = require('axios');

// Teste com gender e location vazios
const testOptionalFields = async () => {
  try {
    const response = await axios.post('http://localhost:3001/api/v1/auth/register', {
      fullName: "Test User Optional",
      email: "test-optional@test.com",
      password: "password123",
      // gender: "", // campo vazio/não enviado
      // location: "", // campo vazio/não enviado
      acceptsTerms: true,
      acceptsDataUsage: true,
      userInterests: ["tecnologia", "negocios"],
      userSkills: ["comunicacao", "organizacao"]
    });
    
    console.log('✅ Sucesso! Registro com campos opcionais funcionando');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Erro no teste:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      console.log('Servidor não está rodando ou não acessível');
    } else {
      console.log('Error:', error.message);
      console.log('Full error:', error);
    }
  }
};

// Teste com gender e location preenchidos
const testWithFields = async () => {
  try {
    const response = await axios.post('http://localhost:3001/api/v1/auth/register', {
      fullName: "Test User With Fields",
      email: "test-with-fields@test.com",
      password: "password123",
      gender: "masculino",
      location: "São Paulo",
      acceptsTerms: true,
      acceptsDataUsage: true,
      userInterests: ["tecnologia", "negocios"],
      userSkills: ["comunicacao", "organizacao"]
    });
    
    console.log('✅ Sucesso! Registro com campos preenchidos funcionando');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Erro no teste com campos:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      console.log('Servidor não está rodando ou não acessível');
    } else {
      console.log('Error:', error.message);
      console.log('Full error:', error);
    }
  }
};

console.log('🧪 Testando campos opcionais...\n');

// Executa os testes
testOptionalFields().then(() => {
  console.log('\n🧪 Testando com campos preenchidos...\n');
  return testWithFields();
}).then(() => {
  console.log('\n✅ Todos os testes concluídos!');
}).catch(err => {
  console.log('❌ Erro geral:', err);
});