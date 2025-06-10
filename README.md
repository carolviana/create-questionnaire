# Criador de Questionários

Uma aplicação web para criar e gerenciar questionários estruturados, com suporte para exportação nos formatos eQuest2 e eQuest3.

## Funcionalidades

- Criação e edição de questionários com múltiplos blocos de perguntas
- Gerenciamento de perguntas com diferentes tipos (texto, número, única escolha, múltipla escolha)
- Suporte para opções de resposta personalizadas
- Dependências entre perguntas
- Exportação para os formatos eQuest2 e eQuest3
- Salvamento automático no navegador
- Interface intuitiva e responsiva

## Como Usar

1. Abra o arquivo `index.html` em um navegador web moderno
2. Preencha os metadados do questionário (título, descrição e versão)
3. Crie blocos de perguntas usando o botão "Adicionar Bloco"
4. Adicione perguntas aos blocos usando o botão "Adicionar Pergunta"
5. Configure as perguntas com suas opções e dependências
6. Exporte o questionário no formato desejado (eQuest2 ou eQuest3)

## Estrutura do Projeto

- `index.html` - Interface principal da aplicação
- `styles.css` - Estilos da aplicação
- `js/`
  - `models.js` - Classes de dados (Question, Block, Questionnaire)
  - `questionnaire.js` - Gerenciamento de questionários
  - `ui.js` - Interface do usuário e interações
  - `main.js` - Inicialização da aplicação

## Formatos de Exportação

### eQuest2
```json
[
   {
      "Titulo do bloco de perguntas": [
         {
            "type": "TipoDaPergunta",
            "id": "ID-unico",
            "title": "Texto da pergunta",
            "behavior": "Instruções para o entrevistador",
            "Op1": "Opção de resposta 1",
            "Op2": "Opção de resposta 2",
            // ... mais opções ...
            "OpOther": "Outra Opção de resposta",
            "allowOnlyNumbers": boolean,
            "size": "Tamanho da resposta",
            "replication": "ID",
            "reference": "ID",
            "showDontKnow": boolean,
            "showDontAnswer": boolean,
            "showDontAllow": boolean,
            "dependencies": [
               {
                  "dependencyID": "ID",
                  "dependencyValue": "Opçao de resposta"
               }
            ]
         }
      ]
   }
]
```

### eQuest3
```json
{
  "title": "Titulo do questionario",
  "description": "descrição do questionario",
  "questionnaireVersion": "string",
  "blocks": [
    {
      "title": "Titulo do bloco de perguntas",
      "questions": [
        {
          "type": "TipoDaPergunta",
          "id": "ID-unico",
          "title": "Texto da pergunta",
          "behavior": "Instruções para o entrevistador",
          "media": "URL",
          "Options": { [key: int]: "Opção de resposta" },
          "OpOther": "Outra Opção de resposta",
          "replication": "ID",
          "reference": "ID",
          "size": "Tamanho da resposta",
          "allowOnlyNumbers": boolean,
          "showDontKnow": boolean,
          "showDontAnswer": boolean,
          "showDontAply": boolean,
          "dependencies": [
            {
              "dependencyID": "ID",
              "dependencyValue": "Opçao de resposta",
              "operator": "tipo de operação"
            }
          ]
        }
      ]
    }
  ]
}
```

## Requisitos

- Navegador web moderno com suporte a JavaScript ES6+
- LocalStorage habilitado para salvamento automático

## Desenvolvimento

Este projeto é desenvolvido em JavaScript vanilla, sem dependências externas. Para contribuir:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request 