<h1 align="center">Fábio Alves Festinalli</h1>

<p align="center">
  <b>Senior .NET Engineer · Application Security · Distributed &amp; Event-Driven Systems</b>
</p>

<p align="center">
  📍 Porto Alegre, Rio Grande do Sul, Brasil<br/>
  ✉️ fabiofestinalli@gmail.com · 🔗 <a href="https://linkedin.com/in/fabiofestinalli">linkedin.com/in/fabiofestinalli</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt=".NET"/>
  <img src="https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white" alt="C#"/>
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/Apache%20Kafka-231F20?style=for-the-badge&logo=apachekafka&logoColor=white" alt="Kafka"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/OWASP-000000?style=for-the-badge&logo=owasp&logoColor=white" alt="OWASP"/>
</p>

---

## 🧭 Resumo

Engenheiro .NET sênior com mais de 10 anos em fábrica de software e produto, especializado em **Segurança de Aplicações (AppSec)** e **sistemas distribuídos de missão crítica** — com forte atuação no domínio bancário/financeiro.

Experiência sólida em C#, ASP.NET / .NET Core, APIs RESTful, DDD, CQRS e arquiteturas orientadas a eventos (Kafka), com foco em **consistência transacional, idempotência, observabilidade ponta-a-ponta e segurança por padrão** (OWASP). Atuação frequente com postura de tech lead/arquiteto: decisão de stack, ADRs, análise de impacto e validação antes de release.

---

## 📌 Projetos em destaque

### [BankMore](https://github.com/festinalli/BankMore-Challenge) — plataforma bancária event-driven com antifraude em tempo real
Sistema bancário onde **toda transferência passa por um pipeline de detecção de fraude antes de ser efetivada**.
- **.NET 8** (Clean Architecture + CQRS/MediatR), **Apache Kafka**, **PostgreSQL**, **Redis**, **Angular**, Docker Compose.
- Antifraude em **PyFlink** (KeyedProcessFunction + RocksDB + exactly-once) com scoring híbrido (regras + modelo).
- **Outbox pattern** Postgres↔Kafka com DLQ e replay, **Avro + Schema Registry**, **PIX real** (DICT/SPI ISO 20022, MED, QR EMVCo, mTLS na RSFN).
- Observabilidade com **Prometheus + Grafana**, **19 ADRs** documentando decisões e trade-offs, ~81% de cobertura de testes (incl. e2e).

### [CompraProgramada](https://github.com/festinalli/CompraProgramada-Challenge) — automação de aportes para corretora
Plataforma que automatiza aportes mensais numa cesta recomendada, com motor de compra e rebalanceamento.
- **.NET 8** (Clean Architecture + CQRS/MediatR), **Angular 17**, **MySQL** (EF Core Migrations), **Apache Kafka**, Docker Compose, Swagger.
- Motor de compra (lote padrão/fracionário, distribuição proporcional, custódia), rebalanceamento e cálculo de IR publicado em Kafka.
- Segurança: **JWT + RBAC** com permissões finas, **PBKDF2**, defesa contra **IDOR**, rate limiting nos endpoints de auth, sem credenciais default.

---

## 🚀 Competências principais

### 🎯 Especialidade (diferencial)
- Application Security: OWASP, SQL Injection, XSS, CSRF, hardening de legado
- SAST/DAST: CodeQL, OWASP ZAP, Nuclei
- Automação de segurança: pipelines de varredura, remediação assistida de vulnerabilidades, validação de não-regressão
- Análise de impacto: mapeamento da superfície HTTP (grafo Controller→Action) e da camada de dados

### 🛠️ Backend & arquitetura
- C#, ASP.NET 4.x / ASP.NET Core, .NET / .NET Core, MVC, WPF
- APIs RESTful, Swagger/OpenAPI, DDD, CQRS/MediatR, JWT/RBAC
- Arquitetura event-driven, Outbox pattern, idempotência, consistência transacional
- Workers/background services, Web Forms/WCF (legado)

### 🗄️ Dados, mensageria & infra
- **Dados & cache:** SQL Server, Azure SQL, MySQL, PostgreSQL, Oracle, MongoDB, Redis
- **Mensageria & streaming:** Apache Kafka, Schema Registry/Avro, RabbitMQ, Amazon SQS, PyFlink
- **Cloud & infra:** Microsoft Azure, AWS (EC2/S3), Docker, Git, CI/CD (GitHub Actions)
- **Observabilidade:** OpenTelemetry, Jaeger, Prometheus, Grafana, Loki
- **Frontend & outras:** Angular, Vue.js, HTML/CSS/JavaScript, PHP/Laravel, Python
- **Metodologias:** Scrum, Kanban, OOP, Design Patterns, TDD/BDD, UML, ADRs

---

## 💼 Experiência

### GotoBiz — Dev Senior .NET | AppSec
**março de 2026 – Presente · Porto Alegre, RS**

Desenvolvedor sênior .NET especializado em segurança de aplicações, em produtos internos da GotoBiz e em sistema ERP corporativo de grande porte (monolito .NET, 50+ módulos).

- Remediação de vulnerabilidades OWASP (SQL Injection, XSS, CSRF) em monolito .NET legado, em lotes com validação de não-regressão, integração de CodeQL e varreduras DAST (OWASP ZAP, Nuclei).
- Plataforma de observabilidade de código / análise de impacto: mapeamento da superfície HTTP real (grafo Controller→Action) e da camada de repositório, prevendo "o que quebra ao alterar X" antes de cada release.
- Guardião Jurídico — Add-in de Outlook (Office.js) para validação de propostas comerciais em tempo real, com motor de 35 regras de negócio e fingerprint de templates.
- Arquitetura de observabilidade/SOC com OpenTelemetry (.NET) + Jaeger + Prometheus + Grafana, sem lock-in de fornecedor.

*Stack:* .NET/C#, ASP.NET MVC, Python, OWASP/CodeQL/ZAP/Nuclei, OpenTelemetry, Office.js, Azure SQL, Docker, GitHub Actions.

### BLP TECH (Consultoria e Projetos) — Desenvolvedor .NET / Python
**janeiro de 2023 – março de 2026 · Porto Alegre e Região**

Projetos para clientes internacionais com foco em backend Python, automação de segurança e aplicações web com frontend Angular.

- Ferramenta de análise de segurança de código (Python + .NET): lê relatórios de vulnerabilidade em PDF, cria cópia isolada do projeto, analisa a estrutura (.sln, .csproj, .cs) e aplica correções automatizadas em C# com pattern matching e validação de consistência.
- Backends e serviços em Python para automação de rotinas; integração com APIs de terceiros.
- Aplicações web com frontend Angular consumindo APIs Python.

*Stack:* Python, Angular, .NET/.NET Core, C#, ASP.NET Core, DDD, CQRS, JWT, Docker, Git, Application Security.

### Up Store Express — Coordenador de TI
**fevereiro de 2017 – dezembro de 2023 · Cachoeira do Sul, RS**

Revenda autorizada Apple com sistema proprietário de Trade-In (avaliação e precificação de iPhones usados em tempo real).

- Implementei metodologias ágeis (Scrum/Kanban) e defini stacks tecnológicas de projetos estratégicos.
- Coordenei equipes de TI, defini KPIs de desempenho/qualidade e estruturei funções e responsabilidades da área.
- Controlei budget de TI e defini arquitetura de sistemas (escalabilidade, segurança, boas práticas).

*Stack:* AWS (EC2/S3), PHP/Laravel, Vue.js, MySQL/SQLite, Scrum/Kanban, CI/CD.

### Longview Tecnologia — Tech Lead .NET
**agosto de 2015 – fevereiro de 2017**

Fábrica de software de soluções sob medida.

- Coordenei equipe de desenvolvimento .NET; responsável por escolha tecnológica e orientação técnica.
- Conduzi soluções complexas e levantamentos para implantação de novos sistemas.

*Stack:* C#, ASP.NET MVC, EF/LinqToSql, SQL Server, TFS, DDD, TDD, Scrum.

### EZ Commerce — Analista Desenvolvedor de Sistemas III
**março de 2015 – julho de 2015**

Plataforma SaaS de design, usabilidade e marketing digital.

- Desenvolvi funcionalidades críticas (C#, ASP.NET MVC) e participei de microsserviços/integração (WCF, WF, SOA).
- Apliquei OOP, Design Patterns, TDD, DDD, BDD; bancos relacionais (SQL Server) e não-relacionais (MongoDB, Redis, Solr).

### ITS Group (cliente Braskem) — Analista Desenvolvedor de Sistemas II
**julho de 2014 – março de 2015**

Sistema de inspeção crítica para caldeiras e tanques (segurança e manutenção preditiva industrial).

- Interface em WPF para técnicos de campo; lógica de negócio em C# (.NET 4.0, LINQ); persistência em SQL Server via Entity Framework.

### Accera (hoje Neogrid) — System Analyst II
**abril de 2014 – julho de 2014**

Inteligência de dados (SaaS/Big Data) para varejo e indústria.

- Funcionalidades web (ASP.NET MVC, C#, .NET 4.0); otimização de acesso a dados (EF, LINQ, SQL Server) no ciclo completo de SDLC.

### HP (clientes Itaú e Globo/Projac) — Software Developer .NET
**julho de 2013 – abril de 2014**

Soluções críticas para mídia/entretenimento e setor bancário.

- Sistemas para Globo (The Voice, Melhores do Ano, Canal Viva) em C#/VB.NET, MVC/Web Forms, WCF, SQL Server/Oracle.
- Sistemas para o Itaú em C#.NET com SQL Server; otimização de consultas e conectividade.

### Medialine — Programador .NET
**abril de 2013 – junho de 2013**

Agência digital full-service.

- Websites e plataformas de alta performance (C#, .NET 4.5, SQL Server); implantação de metodologias ágeis.

### Stefanini — Desenvolvimento
**outubro de 2011 – março de 2013**

Consultoria global de tecnologia (fábrica de software digital).

- Multiprojetos C#.NET e PHP para clientes estratégicos do RS; participação na certificação MPS.BR.
- Projetos de governo (Sefaz-RS, FDRH, Portal da Educação) e sistema de votação online do Sport Club Internacional.

---

## 🎓 Formação acadêmica

- **UniRitter** — Bacharel em Sistemas de Informação (2009 – 2014)
- **Kaplan College, New York** — Inglês (2013)

## 🌐 Idiomas

- 🇧🇷 Português — nativo
- 🇺🇸 Inglês — profissional (leitura/escrita técnica; conversação em evolução)

---

<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=festinalli&show_icons=true&theme=tokyonight" alt="GitHub Stats"/>
</p>

<p align="center"><i>"Engenharia previsível: decisões documentadas, consistência transacional e segurança por padrão."</i></p>
