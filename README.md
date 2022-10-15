# Cope Notes Interview Task

## The API

### Running Local Environment
### API Documentation
### Test Coverage
### What can be improved?

## The Client

### Running Local Environment
### What can be improved?

## Folder Structure
```bash
.
|-- README.md
|-- api
|   |-- Dockerfile
|   |-- Dockerfile.local
|   |-- README.md
|   |-- databases
|   |   |-- Message.json
|   |   |-- User.json
|   |   `-- UserMessage.json
|   |-- docker-compose.local.yml
|   |-- docker-compose.yml
|   |-- docs
|   |   `-- swagger.json
|   |-- jest.config.ts
|   |-- package.json
|   |-- src
|   |   |-- config
|   |   |   |-- database.ts
|   |   |   |-- env.ts
|   |   |   |-- logger.ts
|   |   |   `-- sendgrid.ts
|   |   |-- index.ts
|   |   |-- middleware
|   |   |   |-- authMiddleware.ts
|   |   |   |-- index.ts
|   |   |   |-- userContext.ts
|   |   |   `-- validators
|   |   |       |-- messageValidators.ts
|   |   |       `-- userValidators.ts
|   |   |-- modules
|   |   |   |-- index.ts
|   |   |   |-- mailSender
|   |   |   |   `-- mailingService.ts
|   |   |   |-- message
|   |   |   |   |-- messageController.ts
|   |   |   |   |-- messageModel.ts
|   |   |   |   |-- routes.ts
|   |   |   |   `-- types.ts
|   |   |   `-- user
|   |   |       |-- routes.ts
|   |   |       |-- types.ts
|   |   |       |-- userController.ts
|   |   |       |-- userMessageModel.ts
|   |   |       `-- userModel.ts
|   |   |-- server.ts
|   |   |-- shared
|   |   |   `-- types.ts
|   |   `-- tests
|   |       |-- helpers.ts
|   |       `-- mailingService.test.ts
|   |-- tsconfig.json
|   `-- yarn.lock
|-- client
|   |-- Dockerfile.local
|   |-- README.md
|   |-- components
|   |   |-- clickableCard.js
|   |   |-- layout.js
|   |   |-- newMessageDialog.js
|   |   `-- newUserDialog.js
|   |-- config
|   |   |-- axios.js
|   |   |-- createEmotionCache.js
|   |   `-- theme.js
|   |-- next.config.js
|   |-- package.json
|   |-- pages
|   |   |-- _app.js
|   |   |-- _document.js
|   |   |-- api
|   |   |   `-- hello.js
|   |   |-- config
|   |   |   `-- index.jsx
|   |   |-- index.jsx
|   |   |-- messages
|   |   |   `-- index.jsx
|   |   `-- users
|   |       `-- index.jsx
|   |-- public
|   |   |-- favicon.ico
|   |   `-- vercel.svg
|   |-- styles
|   |   |-- Home.module.css
|   |   `-- globals.css
|   `-- yarn.lock
`-- docker-compose.local.yml
```