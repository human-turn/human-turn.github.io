# План рефакторинга репозитория

## Контекст

Репозиторий `human-turn` — документационный сайт на Astro + Starlight о AI-разработке. Накопил структурный долг:

1. **CLAUDE.md (228 строк)** — перегружен: руководство по проекту, конвенция авторинга, справочник тегов, тулчейн, рецепты Remotion/Lottie, глоссарий Starlight. Разгружается в `AGENTS.md` (стандарт [agents.md](https://agents.md/)). **Claude Code пока не читает `AGENTS.md` нативно** (issues #6235, #50778 открыты), поэтому `CLAUDE.md` остаётся как минимальный файл с `@AGENTS.md` — рекомендованный Anthropic паттерн для кросс-инструментальной совместимости.
2. **Скиллы размазаны**: `.claude/skills/` (idea, draft, lottie-animator, motion-design), `.agents/skills/` (caveman-commit), `skills-lock.json` + `/skills/` (в гитигноре). Унифицируем в `.agents/skills/`.
3. **`/draft` скилл** — удаляем. Вместо него — новый скилл `/writing-article`.
4. **README.md** — стоковый Starlight, переписываем под проект.
5. **`_TEMPLATE.md` в корне** — переезжает в `references/` скилла `writing-article`.
6. **`REVIEW.md`** — удаляем. `draft: true/false` во frontmatter страниц уже несёт статус, grep'ом находятся все черновики. Лишняя точка синхронизации.
7. **`.claude/settings.json`** — снести (ненужный).
8. **`.pi/settings.json`** — в гитигноре, оставляем как есть.

---

## Подход

1. **AGENTS.md** — единая точка входа для любого агента. `CLAUDE.md` → минимальный файл с `@AGENTS.md` (импорт, рекомендованный Anthropic). В AGENTS.md:
   - **Дух проекта** — что это за среда, цели, идея (удобная среда AI-разработки)
   - Краткое описание проекта, ссылка на README для человеческого контекста
   - Команды (dev/build/lint), тулчейн, качество кода
   - Структура контента, конвенция frontmatter
   - Реестр практик: pattern language, digital garden, росреалии
   - **Карта скиллов** — когда какой скилл использовать
2. **Скиллы в `.agents/skills/`** — все (проектные + внешние) через `skills-lock.json` + `npx skills`. `.agents/` убрать из `.gitignore`.
3. **Новый скилл `writing-article`** — заменяет удалённый `/draft`:
   - Выкусывает идею из INBOX.md (отмечает `[x]`)
   - Исследует тему в интернете, предлагает варианты названия
   - Проводит человека через процесс написания (интервью → черновик)
   - В конце напоминает про факт-чекинг (в субагентах)
   - `_TEMPLATE.md` → `references/template.md` внутри этого скилла
4. **README.md** — переписать: что за проект, для кого, как запустить, контрибьютинг, ссылка на AGENTS.md для агентов.
5. **Удалить**: `.claude/settings.json`, `.claude/skills/draft/`, `REVIEW.md`.

---

## Решения (все приняты)

| Что                        | Решение                                                                      |
| -------------------------- | ---------------------------------------------------------------------------- |
| CLAUDE.md → AGENTS.md      | `CLAUDE.md` = `@AGENTS.md` (импорт). Claude Code не читает AGENTS.md нативно |
| Инбокс                     | `INBOX.md` остаётся в корне                                                  |
| REVIEW.md                  | **Удалить**. `draft: true/false` во frontmatter достаточно                   |
| Скиллы                     | Все через `skills-lock.json` + `npx skills` в `.agents/skills/`              |
| Проектные скиллы в lock    | `sourceType: "local"` (подтверждено докой)                                   |
| `/draft`                   | Удалить. Замена: `/writing-article`                                          |
| `_TEMPLATE.md`             | Переезжает в `references/` скилла `writing-article`                          |
| `.claude/settings.json`    | Снести                                                                       |
| `.pi/settings.json`        | В гитигноре, не трогаем                                                      |
| `.agents/` в `.gitignore`  | Убрать (скиллы коммитятся)                                                   |
| README.md                  | Переписать под проект (включая контрибьютинг)                                |
| CONTRIBUTING.md            | Не нужен, всё в README                                                       |
| Карта скиллов в AGENTS.md  | 👍                                                                           |
| Реестр практик в AGENTS.md | Да: pattern language, digital garden, росреалии                              |

---

## Файлы к изменению

| Файл                              | Действие                                                                                      |
| --------------------------------- | --------------------------------------------------------------------------------------------- |
| `AGENTS.md`                       | **Создать** — дух проекта + команды + конвенции + карта скиллов + практики + ссылка на README |
| `CLAUDE.md`                       | Переписать в `@AGENTS.md` (импорт) + Claude-специфичные оверрайды (если нужны)                |
| `.agents/skills/writing-article/` | **Создать** — SKILL.md + references/template.md (из `_TEMPLATE.md`)                           |
| `_TEMPLATE.md`                    | **Удалить** (перенесён в references скилла)                                                   |
| `.claude/skills/draft/`           | **Удалить**                                                                                   |
| `.claude/skills/idea/`            | Перенести в `.agents/skills/idea/`                                                            |
| `.claude/skills/lottie-animator/` | Перенести в `.agents/skills/lottie-animator/`                                                 |
| `.claude/skills/motion-design/`   | Перенести в `.agents/skills/motion-design/`                                                   |
| `.agents/skills/caveman-commit/`  | Оставить, обновить пути если нужно                                                            |
| `.claude/settings.json`           | **Удалить**                                                                                   |
| `README.md`                       | **Переписать**                                                                                |
| `REVIEW.md`                       | **Удалить**                                                                                   |
| `.gitignore`                      | Убрать `.agents/` из игнор-листа                                                              |
| `skills-lock.json`                | Обновить: пути на `.agents/skills/`, добавить локальные скиллы                                |
| `INBOX.md`                        | Без изменений                                                                                 |
| `astro.config.mjs`                | Без изменений                                                                                 |
| `.pi/settings.json`               | Без изменений (в гитигноре)                                                                   |

---

## Шаги

- [x] 1. Создать `AGENTS.md` (дух проекта + команды + конвенции + карта скиллов + практики + ссылка на README)
- [x] 2. Переписать `CLAUDE.md` в `@AGENTS.md` (импорт) + Claude-специфичные оверрайды если нужны
- [x] 3. Создать `.agents/skills/writing-article/SKILL.md` с `references/template.md`
- [x] 4. Перенести `.claude/skills/idea/` → `.agents/skills/idea/`
- [x] 5. Перенести внешние скиллы (lottie-animator, motion-design, caveman-commit) в `.agents/skills/` через `npx skills`
- [x] 6. Удалить `.claude/skills/draft/`, `.claude/settings.json`, `REVIEW.md`, `_TEMPLATE.md`
- [x] 7. Обновить `.gitignore` — убрать `.agents/`
- [x] 8. Обновить `skills-lock.json` — пути на `.agents/skills/`, локальные скиллы с `sourceType: "local"`
- [x] 9. Переписать `README.md`
- [x] 10. Пройтись по всем скиллам — проверить что ссылки внутри не бьются
- [x] 11. Прогнать `npm run format && npm run lint && npm run typecheck`

---

## Проверка

1. `npm run dev` — сайт поднимается на 4321
2. `npm run build` — прод-сборка без ошибок
3. Claude Code читает `CLAUDE.md` → импортирует `@AGENTS.md` — оба файла работают
4. `/idea` работает — пишет в `INBOX.md`
5. `/writing-article` работает — выкусывает идею, предлагает название, ведёт интервью, создаёт черновик
6. `/caveman-commit` работает
7. Внешние скиллы (lottie-animator, motion-design) доступны
8. Pi видит скиллы через `.pi/settings.json` → `.agents/skills/`
