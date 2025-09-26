// Teste para verificar se os novos enums funcionam
const testPayloadWithNewEnums = {
  fullName: "Teste Novos Enums",
  email: "teste_novos_enums@gmail.com",
  password: "Teste@123",
  gender: "masculino",
  location: "São Paulo - SP",
  phone: "(11)99999-9999",
  userInterests: ["ciencias", "esportes", "saude"], // Testando novos valores
  userSkills: ["pratica", "teoria", "criativa"], // Testando novos valores
  workPreference: "estabilidade-financeira", // Testando novo valor
  acceptsDataUsage: true,
  acceptsTerms: true
};

console.log('Payload de teste com novos enums:', JSON.stringify(testPayloadWithNewEnums, null, 2));