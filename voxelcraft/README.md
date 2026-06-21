# 🟩 Voxelcraft

Um jogo estilo **Minecraft** (mundo de blocos / voxels) que roda no navegador.
Construído com **Spec-Driven Development (SDD)** — toda feature nasce de uma spec.

> Projeto-demo dentro do repositório de perfil. O jogo vive nesta pasta
> (`voxelcraft/`); o `README.md` da raiz do repositório é o currículo do dono e
> não é tocado por este projeto.

## ✨ O que já tem

**Feature 001 — Mundo + câmera**
- Terreno voxel **procedural e determinístico** (mesma seed ⇒ mesmo mundo).
- 3+ tipos de bloco por cor: grama, terra, pedra (e areia nas partes baixas).
- Câmera em **primeira pessoa** com olhar pelo mouse e **voo livre**.
- Render otimizado por **face culling** (só desenha faces expostas).

**Feature 002 — Quebrar / colocar blocos**
- Mira por **raycast** com realce do bloco apontado.
- **Botão esquerdo** quebra, **botão direito** coloca.
- **Hotbar** (`1`–`4`) pra escolher grama/terra/pedra/areia.

**Feature 003 — Física**
- **Gravidade**, **colisão** (não atravessa blocos) e **pulo** (`Espaço`).
- **Modo voo** alternável com `F` (ainda com colisão).

**Feature 004 — Texturas**
- **Atlas procedural** (gerado em runtime, sem arquivos de imagem no repo).
- Visual pixelado (filtro nearest); grama com topo e laterais distintos.

**Feature 005 — Salvar / carregar**
- O mundo **persiste** no `localStorage` (autosave após editar / ao pausar / ao sair).
- Restaura a **posição** ao voltar. Botão **"Novo mundo"** recomeça do zero.

**Feature 007 — Hotbar / inventário**
- **8 blocos**: grama, terra, pedra, areia, madeira, folhas, tábuas, pedregulho.
- Seleção por `1`–`8` **ou roda do mouse**; texturas com orientação corrigida.

## 🎮 Controles

| Ação            | Tecla                |
|-----------------|----------------------|
| Olhar           | Mouse                |
| Mover           | `W` `A` `S` `D`      |
| Pular           | `Espaço`             |
| Voo (liga/desliga) | `F`               |
| Voar (sobe/desce) | `Espaço` / `Shift` |
| Correr          | `Ctrl`               |
| Quebrar bloco   | Botão esquerdo       |
| Colocar bloco   | Botão direito        |
| Escolher bloco  | `1`–`8` ou roda do mouse |
| Pausar          | `Esc`                |

Clique na tela inicial para capturar o mouse e começar.

## 🚀 Como rodar

```bash
cd voxelcraft
npm install
npm run dev      # abre em http://localhost:5173
```

Build estático (publicável no GitHub Pages):

```bash
npm run build    # gera dist/
npm run preview  # serve o build localmente
```

## 🧱 Stack

JavaScript (ES Modules) · [Three.js](https://threejs.org/) · [Vite](https://vitejs.dev/).
Three.js é a única dependência de runtime. Veja `.specs/constitution.md`.

## 🗂️ Estrutura (Spec-Driven Development)

```
voxelcraft/
├── CLAUDE.md            # contexto do agente (lido sempre)
├── README.md            # você está aqui
├── LOOP.md              # loop de desenvolvimento (SDD + modelo Karpathy) + roadmap
├── .specs/
│   ├── constitution.md  # princípios inegociáveis (stack, regras)
│   ├── 001-mundo-voxel-camera/   # spec.md · plan.md · tasks.md
│   └── 002-quebrar-colocar-blocos/
├── docs/adr/            # decisões arquiteturais (memória do projeto)
└── src/                 # código do jogo
```

### Como nasce uma feature nova
1. Cria `.specs/<feature>/spec.md` (intenção + critérios de aceitação).
2. Deriva `plan.md` (arquitetura, contratos).
3. Quebra em `tasks.md` (passos pequenos e verificáveis).
4. Implementa, marcando tasks no **mesmo commit**. Decisão relevante? Vira ADR.

## 🛣️ Próximas features (ideias)
- Quebrar / colocar blocos (raycast + mouse).
- Gravidade, colisão e pulo.
- Texturas (atlas) no lugar de cores sólidas.
- Streaming de chunks (mundo "infinito").
