# n8n-nodes-z-api-icarodev

Node de comunidade n8n para integração completa com a API Z-API (WhatsApp).

**Desenvolvido por @icarodev**

Esta é uma versão atualizada e expandida do node Z-API, incluindo todos os recursos mais recentes da API.

## Instalação

Siga o [guia de instalação](https://docs.n8n.io/integrations/community-nodes/installation/) na documentação de nodes de comunidade do n8n.

```bash
npm install n8n-nodes-z-api-icarodev
```

## Credenciais

1. Criar conta: Crie uma conta no [Z-API](https://www.z-api.io/)
2. Criar Instância: Após criar a conta, crie uma instância no painel Z-API
3. Obter ID e Token: Vá nas configurações da instância para encontrar seu ID e Token
4. Obter Client Token: Navegue até "Segurança" → "Client Token" → Gere e ative

No n8n, adicione novas credenciais Z-API com:
- Instance ID
- Instance Token
- Client Token

## Recursos & Operações

### Mensagem
- Enviar Texto, Imagem, Vídeo, Áudio, Documento
- Enviar Localização, Contato, Link, Sticker
- Enviar Lista, Enquete
- Enviar/Remover Reação
- Deletar, Ler, Encaminhar Mensagem

### Instância
- Obter QR Code, Status, Informações do Telefone
- Reiniciar, Desconectar

### Grupo
- Criar, Obter Metadados, Obter Link de Convite
- Adicionar/Remover Participante, Sair

### Chat
- Obter Chats, Arquivar, Deletar

### Contato
- Obter Contatos, Obter Foto de Perfil
- Verificar Número WhatsApp

### Perfil
- Obter Perfil, Atualizar Nome/Status/Foto

### 🆕 Canal (Newsletter)
- Criar, Listar, Buscar Canais
- Seguir/Deixar de Seguir
- Obter Metadados

### 🆕 Comunidade
- Criar, Listar Comunidades
- Vincular/Desvincular Grupos
- Obter Metadados

### 🆕 Status (Stories)
- Enviar Texto, Imagem, Vídeo no Status

### 🆕 Catálogo
- Enviar Produto, Catálogo
- Enviar Status do Pedido

### 🆕 Evento
- Enviar, Editar, Responder Eventos

## Node Trigger

O node Z-API Trigger escuta eventos de webhook:
- Mensagem Recebida
- Atualizações de Status de Mensagem
- Status da Conexão
- Presença no Chat
- Conectado/Desconectado

Configure a URL do webhook no painel Z-API apontando para a URL de webhook do seu n8n.

## Recursos

- [Documentação de Nodes de Comunidade n8n](https://docs.n8n.io/integrations/community-nodes/)
- [Documentação Z-API](https://developer.z-api.io/)

## Autor

**@icarodev**

## Licença

MIT
