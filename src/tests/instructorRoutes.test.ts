import request from 'supertest';
import app from '../index';
import { connectToDB, closeDBConnection } from '../db/connect';
import 'dotenv/config';

describe('POST /instructor', () => {
  // Antes de começar os testes, conecta-se ao banco de dados
  beforeAll(async () => {
    if (process.env.MONGO_URI) {
      await connectToDB(process.env.MONGO_URI);
      console.log('Connected to DB');
    } else {
      throw new Error('Invalid URI');
    }
  }, 10000);

  // Depois de terminar os testes, desconecta-se do banco de dados
  afterAll(async () => {
    try {
      await closeDBConnection();
      console.log('Closed DB Connection');
    } catch (error) {
      console.log(error);
    }
  });

  it.only('should create a new instructor and return 201 status', async () => {

    // Cria um objeto com os dados do instrutor
    const instructorData = {
      nome: 'João Silva',
      email: 'joao@example.com',
      password: 'securepassword',
      especialidades: ['Matemática', 'Física'],
      horariosDisponiveis: ['08:00', '10:00'],
    };
    console.log(instructorData);

    // Envia uma requisição POST para a rota /instructor com os dados do instrutor
    const response = await request(app)
      .post('/instructor')
      .send(instructorData);
    console.log('try catch da response OK');
    console.log(response.body);

    // Verifica se o status da resposta é 201, ou seja, se o usuário foi criado
    expect(response.status).toBe(201);

    // Verifica se a resposta contém um objeto Instructor com a propriedade "nome" igual a "João Silva" (nome do instrutor criado)
    expect(response.body.Instructor).toHaveProperty(
      'nome',
      instructorData.nome
    );

    // Verifica se a resposta contém um objeto Instructor com a propriedade "email" igual a "joao@example" (email do instrutor criado)
    expect(response.body.Instructor).toHaveProperty(
      'email',
      instructorData.email
    );

    console.log(response.body.Instructor.password);
    // Verifica se a resposta contém um objeto Instructor com a propriedade "password" definida (diferente de undefined)
    expect(response.body.Instructor.password).toBeDefined;
    
    // Verifica se a resposta contém um objeto Instructor com a propriedade "especialidades" igual a ["Matemática", "Física"] (especialidades do instrutor criado)
    expect(response.body.Instructor).toHaveProperty(
      'especialidades',
      instructorData.especialidades
    );
    
    // Verifica se a resposta contém um objeto Instructor com a propriedade "horariosDisponiveis" igual a ["08:00", "10:00"] (horários disponíveis do instrutor criado)
    expect(response.body.Instructor).toHaveProperty(
      'horariosDisponiveis',
      instructorData.horariosDisponiveis
    );

  }, 30000);
});
