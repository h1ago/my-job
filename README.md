# MyJob

Bot para monitoramento automatizado de oportunidades de emprego (vagas e publicações) no LinkedIn.

## 🚀 Tecnologias Utilizadas

- **TypeScript**
- **Puppeteer**
- **Telegram Bot API**
- **Axios**
- **File System (fs)**

## 🏗️ Arquitetura e Padrões de Projeto

### Clean Architecture

O projeto adota os princípios da Clean Architecture, com separação clara de responsabilidades:

- **Domain Layer**: Entidades de negócio (`Job`, `Post`) e regras de domínio.
- **Application Layer**: Casos de uso (`SearchJobUseCase`, `SearchPostUseCase`).
- **Infrastructure Layer**: Implementações concretas (fetchers, repositórios, notificadores).
- **Facades**: Orquestração dos casos de uso.

### Padrões de Projeto Utilizados

- **Repository Pattern**: Abstração da persistência de dados.
- **Strategy Pattern**: Estratégias distintas para buscas de vagas e postagens.
- **Facade Pattern**: Interface unificada para operações complexas.
- **Factory Pattern**: Criação controlada de entidades.
- **Dependency Injection**: Inversão de dependências para maior desacoplamento.

---

**⚠️ Aviso**: Este bot é para uso educacional e pessoal. Respeite os termos de uso do LinkedIn. Use com responsabilidade.
