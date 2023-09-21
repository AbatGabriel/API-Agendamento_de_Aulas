# API de Agendamento de Aulas

Essa aplicação consiste em um backend para a administração de agendamento de aulas de alunos com instrutores. A partir dessa aplicação, é possível cadastrar dados de alunos e instrutores, edita-los e deleta-los, além de permitir o upload de documentos(txt, docx e pdf) e associá-los a agendamentos existentes.

## Autores

- **Ana Leticia Vieira Reis de Carvalho** - [ana.carvalho.pb@compasso.com.br](ana.carvalho.pb@compasso.com.br)
- **Gabriel Abat** - [gabriel.abat.pb@compasso.com.br](gabriel.abat.pb@compasso.com.br)
- **Heitor Lorençao Busato** - [heitor.busato.pb@compasso.com.br](heitor.busato.pb@compasso.com.br)
- **Lucas Scommegna** - [lucas.scommegna.pb@compasso.com.br](lucas.scommegna.pb@compasso.com.br)
- **Saulo de Freitas** - [saulo.freitas.pb@compasso.com.br](saulo.freitas.pb@compasso.com.br)
- **Vinicius Francisco Pinha** - [vinicius.pinha.pb@compasso.com.br](vinicius.pinha.pb@compasso.com.br)

## Iniciando a aplicação

Primeiramente, clone o repositório atual na sua máquina, pelo terminal a partir do seguinte comando:

```
git clone <link HTTPS ou SSH> .
```

Após, utilize o seguinte comando no terminal, estando localizado na pasta da aplicação:

```
npm install
```

Na seção "Database" da sua conta MongoDB, escolha uma data base, clique em connect, escolha a opção "Drivers" para o "Connect to your application" e copie a connection string gerada para a Database.

Modifique o nome do arquivo ".env.example" para ".env", e no valor "MONGO_URI" iguale a connection string gerada, lembrando de completar os parametros dela. A connection string tem o seguinte formato:

```
mongodb+srv://<nome-do-usuario>:<password>@<host>.mongodb.net/<database-name>?retryWrites=true&w=majority
```

Sendo os campos "password" a senha da sua database, "database-name" o nome da database a ser criada e o campo "nome-do-usuario" o seu nome de usuário no MongoDB e o campo "host" o cluster do seu banco de dados, sendo esses dois últimos campos gerados automaticamente.

Copie o Cloud Name de sua conta no cloudinary e cole no valor "CLOUD_NAME" dentro do arquivo ".env". Também copie a API Key e cole no valor "CLOUD_API_KEY", o mesmo para a API Secret que deve ser colada no valor "CLOUD_API_SECRET".

Após essas configurações da aplicação do MongoDB e do Cloudinary, está na hora de configurar o Postman.

Com o aplicativo do Postman aberto e com sua conta logada, clique no canto superior esquerdo, na seção "My workspace" em import e arraste o arquivo "API-Agendamento-de-Aulas.postman_collection".
Após isso, todas as rotas do Postman já estarão configuradas para serem testadas.

Dessa forma, a aplicação está praticamente configurada. Após tudo isso, digite no terminal o seguinte comando para iniciar a aplicação:

```
npm start
```

## Utilização da aplicação

Após as instalações anteriores terem sido feitas, e a aplicação estar rodando após o comando "npm start", todas as requisições para as rotas serão feitas através do Postman, e serão explicadas a seguir.

## Students Routes

### Rota POST/student

A requisição para essa rota criará os dados de um estudante, sendo esses dados enviados pelo corpo da requisição e devem ser em formato JSON. O body enviado deve conter os seguintes campos:

```
{
    "nome": string,
    "email": string,
    "password": string,
    "role": string
}
```

Após o sucesso da requisição, será retornado, em formato JSON os dados do aluno criado no banco de dados, alem de ser gerado um campo "\_id" com o valor identificador único para o aluno.

### Rota POST/student/login

A requisição para essa rota fará a autenticação e o login de algum aluno existente no banco de dados. Os dados de "email" e "password" devem ser enviados no corpo da requisição, em formato JSON, seguindo o seguinte modelo:

```
{
    "email": string,
    "password": string
}
```

Após a autenticação ser feita com sucesso, será enviado como resposta uma mensagem de sucesso e o valor do token JWT do aluno logado.

### Rota GET/students

A requisição para essa rota retornará os dados de todos os alunos criados em formato JSON. Para que seja feita essa requisição, deve ser passado o valor do Bearer Token em "Authorization".

### Rota PUT/student/:id

A requisição para essa rota atualizará os dados do aluno que tiver seu id informado. Para que seja feita essa requisição, deve ser informado o id do aluno a ser atualizado e o valor do Bearer Token em "Authorization".

Após isso, devem ser fornecidos os dados a serem atualizados no corpo da requisição em formato JSON, sendo os campos possíveis de serem atualizados os seguintes:

```
{
    "nome": string,
    "email": string,
}
```

Após isso, será retornado, em formato JSON, os dados do aluno já atualizados.

### Rota DELETE/student/:id

A requisição para essa rota deletará os dados do aluno que tiver seu id informao. Para que seja feita essa requisição, deve ser informado o id do aluno a ser deletado e o valor do Bearer Token em "Authorization".

## Instructors Routes

### Rota POST/instructor

A requisição para essa rota criará os dados de um instrutor, sendo esses dados enviados pelo corpo da requisição e devem ser em formato JSON. O body enviado deve conter os seguintes campos:

```
{
    "nome": string,
    "email": string,
    "password": string,
    "especialidades": [string],
    "horariosDisponiveis": [string]
}
```

Após o sucesso da requisição, será retornado, em formato JSON os dados do instrutor criado no banco de dados, alem de ser gerado um campo "\_id" com o valor identificador único para o instrutor.

### Rota POST/instructor/login

A requisição para essa rota fará a autenticação e o login de algum instrutor existente no banco de dados. Os dados de "email" e "password" devem ser enviados no corpo da requisição, em formato JSON, seguindo o seguinte modelo:

```
{
    "email": string,
    "password": string
}
```

Após a autenticação ser feita com sucesso, será enviado como resposta uma mensagem de sucesso e o valor do token JWT do instrutor logado.

### Rota GET/instructors

A requisição para essa rota retornará os dados de todos os instrutores cadastrados em formato JSON. Para que seja feita essa requisição, deve ser passado o valor do Bearer Token em "Authorization".

### Rota PUT/instructor/:id

A requisição para essa rota fará a atualização dos dados do instrutor logado. Para que seja feita essa requisição, deve ser informado o id do instrutor a ser atualizado e o valor do Bearer Token em "Authorization".

Após isso, devem ser fornecidos os dados a serem atualizados no corpo da requisição em formato JSON, sendo os campos possíveis de serem atualizados os seguintes:

```
{
    "nome": string,
    "email": string,
    "especialidades": [string],
    "horariosDisponiveis": [string]
}
```

Após isso, será retornado, em formato JSON, os dados do instrutor já atualizados.

### Rota DELETE/instructor/:id

A requisição para essa rota deletará todos os dados do instrutor logado. Para que seja feita essa requisição, deve ser informado o id do instrutor a ser deletado e o valor do Bearer Token em "Authorization".

## Scheduling Routes

### Rota GET/schedules

A requisição para essa rota retornará os dados de todos os agendamentos criados em formato JSON. Para que seja feita essa requisição, deve ser passado o valor do Bearer Token em "Authorization".

### Rota POST/schedule

A requisição para essa rota criará os dados de um agendamento. Para que essa requisição seja feita, é necessário, primeiramente, passar o valor do Bearer Token do aluno logado em "Authorization".

Após isso, devem ser fornecidos os dados a serem atualizados no corpo da requisição em formato JSON, o body enviado deve conter os seguintes campos:

```
{
    "instrutor":"string",
    "aluno":"string",
    "horario":[string],
    "materia":[string]
}
```

Nos campos aluno e instrutor devem ser informados os seus respectivos IDs.

Após o sucesso da requisição, será retornado, em formato JSON os dados do agendamento criado no banco de dados, além de ser gerado um campo "\_id" com o valor identificador do agendamento, que será o mesmo ID do instrutor.

### Rota PUT/schedule/:id

A requisição para essa rota fará a atualização dos dados de um agendamento. Para que essa requisição seja feita, é necessário, passar o valor do Bearer Token do aluno logado em "Authorization".

Após isso, devem ser fornecidos os dados a serem atualizados no corpo da requisição em formato JSON, sendo os campos possíveis de serem atualizados os seguintes:

```
{
    "instrutor":"string",
    "aluno":"string",
    "horario":[string],
    "materia":[string]
}
```

Após isso, será retornado, em formato JSON, os dados do agendamento já atualizados.

### Rota DELETE/schedule/:id

A requisição para essa rota deletará o agendamento que tiver seu ID informado ao fazer a requisição. Para que essa requisição seja feita, é necessário passar o valor do Bearer Token do aluno logado em "Authorization".

## Upload Routes

### Rota POST/schedule/:id/upload

A requisição para essa rota fará o upload do arquivo e o anexará a um agendamento que tiver seu ID informado ao fazer a requisição. Para que essa requisição seja feita, é necessário, primeiramente, passar o valor do Bearer Token do usuário logado em "Authorization".

Após isso, na seção body deverá ser selecionada a opção form-data, e informada uma key chamada "file" tendo como tipo File, o value deverá ser o arquivo a ser anexado ao agendamento. O documento deverá ser do tipo txt, docx ou pdf com tamanho máximo de 3mb.

Após o sucesso da requisição, será retornado em formato JSON o link do arquivo no cloudinary.

### Rota GET/schedule/:id/uploads

A requisição para essa rota retornará os links de todos os uploads do agendamento que tiver seu ID informado ao fazer a requisição em formato JSON. Para que seja feita essa requisição, deve ser passado o valor do Bearer Token do usuário logado em "Authorization".

### Rota POST/schedule/:id/uploads/remove

A requisição para essa rota deletará o upload do agendamento que tiver seu ID informado ao fazer a requisição. Para que essa requisição seja feita, é necessário passar o valor do Bearer Token do usuário logado em "Authorization".

O arquivo a ser deletado será o que tiver seu index informado no corpo da requisição em formato JSON, que deverá ser da seguinte forma:

```
{
    "index":number
}
```

Para saber o index de um upload, deve-se primeiro consultar a rota "Get Schedule Uploads".

## Rota DOCS

A documentação do Swagger dessa aplicação pode ser acessada pela rota "/api-docs".

## Tecnologias utilizadas

- [Bcryptjs](https://www.npmjs.com/package/bcrypt) - Biblioteca para hashear senhas.
- [Cloudinary](https://www.npmjs.com/package/cloudinary) - Managear o upload de arquivos para a nuvem.
- [Concurrently](https://www.npmjs.com/package/concurrently) - Biblioteca para rodar diferentes scripts npm de forma simultânea.
- [cookie-parser](https://www.npmjs.com/package/cookie-parser) - Biblioteca para popular o req.cookies.
- [dotenv](https://www.npmjs.com/package/dotenv) - Biblioteca de gerenciamento de variáveis ambiente.
- [Express](https://expressjs.com/pt-br/) - Framework Back-End.
- [express-async-errors](https://www.npmjs.com/package/express-async-errors) - try/catch wrapper.
- [express-fileupload](express-fileupload) - Biblioteca para fazer o upload de arquivos.
- [http-status-codes](https://www.npmjs.com/package/http-status-codes) - Biblioteca para auxiliar a escrita de status codes na aplicação.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - Manager para tokens JWT.
- [MongoDB](https://www.mongodb.com/pt-br) - Banco de dados não-relacional.
- [Mongoose](https://mongoosejs.com/) - Modelador de objetos de MongoDB para NodeJS
- [Nodemon](https://www.npmjs.com/package/nodemon) - Atualizador de aplicações Node.js.
- [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express) - Biblioteca para documentação de aplicações backend.
- [TypeScript](https://www.typescriptlang.org/) - Superset, para tipagem de JavaScript.
- [yamljs](https://www.npmjs.com/package/yamljs) - Parser e encoder de arquivos YAML.
