# AGENTS.md

Документационный сайт **HumanTurn** на Astro + Starlight: знания об AI-разработке — Claude Code, Pi Coding Agent, харнесс-менеджмент, инференс-модели, процессы команды.

> **Дух проекта:** удобная среда AI-разработки. Мы копим проверенный опыт (pattern language), растим связанный граф материалов (digital garden), учитываем российскую специфику (росреалии). Сайт первичен — книга собирается позже срезом.

Подробный контекст для человека: [README.md](README.md).

## Команды

```bash
npm run dev          # dev-сервер на http://localhost:4321 (strictPort)
npm run dev:force    # сброс content layer cache (вместо rm -rf .astro)
npm run build        # прод-сборка в ./dist
npm run preview      # локальный просмотр собранного
npm run typecheck    # astro check
npm run lint         # eslint .
npm run lint:fix     # eslint . --fix
npm run format       # prettier --write .
npm run format:check # prettier --check .
```

Перед коммитом: `npm run format && npm run lint && npm run typecheck` — все три зелёные.

**Порт 4321, `strictPort`.** Если «port in use» — сервер уже запущен, новый не поднимай.

**Залипла картинка/frontmatter в dev?** HMR кэширует ассеты. `npm run dev:force` (= `astro dev --force`).

**GitHub:** утилита `gh` доступна.

## Структура контента

Страницы в `src/content/docs/`. URL фиксируется `slug` во frontmatter. Навигация в `astro.config.mjs`.

| Папка                    | Раздел                          | Что внутри                                       |
| ------------------------ | ------------------------------- | ------------------------------------------------ |
| `start/`                 | Claude Code                     | вводная, первые возможности                      |
| `pi/`                    | Pi Coding Agent                 | вводная, конфигурация, пакеты                    |
| `tools/`                 | Харнесс-менеджмент              | MCP, скиллы + CLI, каталоги                      |
| `infra/`                 | Инфраструктура: модели и доступ | провайдеры, LiteLLM, локальные модели            |
| `concepts/processes/`    | Процессы команды                | разделение команд, AI-ревью, контракты, арх-репа |
| `concepts/architecture/` | Прочие возможности агентов      | разное (Lottie и т.п.)                           |
| `claude-code/`           | Продвинутый Claude Code         | /branch, /fork, мульти-репо                      |
| `library/`               | Библиотека блоков               | служебные блоки и эталоны                        |

### Конвенция frontmatter

```yaml
---
slug: tools/my-page # обязательно: путь файла без расширения на момент создания, не менять
title: '...'
description: '...' # желательно
draft: true # пока не готово к публикации
tags: [инструменты, how-to] # обязательно: домен + тип
---
```

**Правила `slug`:** slug = путь файла без расширения на момент создания, не меняется. Для `concepts/processes/*` — плоский `concepts/<имя>`. Index-страницы разделов без slug.

**Словарь тегов:**

- _Домен:_ `claude-code`, `pi`, `инфра`, `инструменты`, `безопасность`, `процессы`, `росреалии`, `библиотека`
- _Тип:_ `туториал`, `how-to`, `концепт`, `справочник`, `воркшоп`
- _Уровень:_ `новичок`, `продвинутый`

### Статусы и публикация

`draft: true` — страница видна в `npm run dev`, но **не в прод-сборке**. Готово к публикации → `draft: false`.

### Digital garden и паттерны

- **Граф, а не дерево.** У каждой страницы блок `## Связанные материалы` со ссылками на соседние.
- **Практики и концепты** — по каркасу: Зачем (боль) → Как сейчас → Решение → Что меняется → Риски и росреалии → Связанные материалы.
- **Туториалы и how-to** — свободная форма, но `## Связанные материалы` обязателен.
- **Росреалии** — импортозамещение моделей, 152-ФЗ, доступность API — отдельным блоком, тег `росреалии`.
- **Идеи** копим в `INBOX.md`: инбокс → черновик → публикация.

### Добавить страницу

1. Идея → `/idea` (пишет строку в `INBOX.md`).
2. Когда дозрела → `/writing-article` (ведёт через интервью, создаёт черновик).
3. Вручную: создать `.md`/`.mdx` в нужной папке, frontmatter по конвенции, slug, tags, `draft: true`.
4. Раздел с `autogenerate` подхватит сам.

## Качество кода

- **TypeScript**: `astro/tsconfigs/strictest`, без `any`, без `as` без необходимости.
- **ESLint**: flat config, `typescript-eslint` + `eslint-plugin-astro` + `eslint-config-prettier`.
- **Prettier**: табы, одинарные кавычки, `printWidth: 100`, `proseWrap: preserve`, `prettier-plugin-astro`.
- **Алиас**: `~/*` → `src/*`.
- **a11y-линтинг отложен** (eslint-plugin-jsx-a11y ждёт ESLint 10).

## Когда какой скилл использовать

- Хочешь коммит → `/caveman-commit`
- Хочешь анимацию (Lottie JSON) → `/lottie-animator`
- Хочешь анимацию (CSS/GSAP/Framer Motion) → `/motion-design`
- Хочешь зафиксировать идею для сайта → `/idea`
- Хочешь написать статью → `/writing-article`
