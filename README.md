# HumanTurn

Документационный сайт об AI-разработке: Claude Code, Pi Coding Agent, харнесс-менеджмент (MCP/скиллы/CLI), инференс-модели, процессы команды.

Стек: [Astro](https://astro.build) + [Starlight](https://starlight.astro.build).

## Быстрый старт

```bash
npm install
npm run dev        # http://localhost:4321
```

## Команды

| Команда             | Что делает                    |
| ------------------- | ----------------------------- |
| `npm run dev`       | Dev-сервер на localhost:4321  |
| `npm run dev:force` | Сброс кэша контент-слоя + dev |
| `npm run build`     | Прод-сборка в `dist/`         |
| `npm run preview`   | Просмотр собранного           |
| `npm run typecheck` | Проверка типов Astro          |
| `npm run lint`      | ESLint                        |
| `npm run format`    | Prettier                      |

Перед коммитом: `npm run format && npm run lint && npm run typecheck`.

## Структура

```
src/content/docs/   — страницы (md/mdx)
src/components/     — Astro-компоненты
src/styles/         — CSS
public/             — статика (Lottie-анимации и др.)
scripts/            — генераторы Lottie-анимаций
```

## Контрибьютинг

1. Идея → `/idea` (скилл, пишет в `INBOX.md`)
2. Дозрела → `/writing-article` (скилл, ведёт через интервью к черновику)
3. Или вручную: создать `.md`/`.mdx` в нужной папке `src/content/docs/`, frontmatter по конвенциям из [`AGENTS.md`](AGENTS.md)
4. `npm run format && npm run lint && npm run typecheck` перед коммитом

## Для AI-агентов

Инструкции для агентов (Claude Code, Pi, Codex и др.) — в [`AGENTS.md`](AGENTS.md).

Скиллы проекта — в `.agents/skills/`.
