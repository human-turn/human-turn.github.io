# Статус рецензирования контента

Дашборд готовности страниц. Технический файл — в сайт не попадает.

Статусы: `черновик` — написано, ждёт ревью; `на правках` — есть замечания;
`принято` — вычитано и одобрено.

Пока страница не `принято`, в её frontmatter держим `draft: true` — такие
страницы видны в `npm run dev`, но **не попадают в прод-сборку** (`npm run build`).
Принято → снимаем `draft: true`.

| Страница                                             | Путь                                                         | Статус   | Заметки                |
| ---------------------------------------------------- | ------------------------------------------------------------ | -------- | ---------------------- |
| Lottie через Claude Code                             | src/content/docs/concepts/architecture/lottie-claude-code.md | черновик | ждёт ревью             |
| Вставляем Lottie в статью                            | src/content/docs/library/lottie-embed.mdx                    | черновик | смотрели визуально, ок |
| Схема (Mermaid)                                      | src/content/docs/library/diagram-mermaid.md                  | черновик | проверка движка        |
| Мок интерфейса Claude Code                           | src/content/docs/library/block-claude-code.mdx               | черновик | эталонный блок         |
| Claude Code: что это и зачем                         | src/content/docs/start/claude-code.md                        | черновик | заготовка, ждёт текста |
| Скиллы и CLI                                         | src/content/docs/tools/skills-cli.md                         | черновик | заготовка, ждёт текста |
| MCP — что это и зачем                                | src/content/docs/tools/mcp.md                                | черновик | заготовка, ждёт текста |
| Каталоги скиллов — внутренние маркетплейсы           | src/content/docs/tools/skills-catalog.md                     | черновик | заготовка, ждёт текста |
| Распознавание аудио и голосовой ввод                 | src/content/docs/claude-code/voice-input.md                  | черновик | заготовка, ждёт текста |
| Провайдеры и модели: OpenRouter, DeepSeek, Anthropic | src/content/docs/infra/providers-models.md                   | черновик | заготовка, ждёт текста |
| LiteLLM Proxy                                        | src/content/docs/infra/litellm-proxy.md                      | черновик | заготовка, ждёт текста |
| LiteLLM → Anthropic                                  | src/content/docs/infra/litellm-anthropic.md                  | черновик | заготовка, ждёт текста |
| Локальные и кастомные модели на LiteLLM              | src/content/docs/infra/local-models.md                       | черновик | заготовка, ждёт текста |
| OpenRouter как бекенд для экспериментов              | src/content/docs/infra/openrouter-backend.md                 | черновик | заготовка, ждёт текста |
| OpenWebUI                                            | src/content/docs/infra/openwebui.md                          | черновик | заготовка, ждёт текста |
| Claude Code на локальных и кастомных моделях         | src/content/docs/infra/claude-code-local-models.md           | черновик | заготовка, ждёт текста |
| Форк против заражения контекста                      | src/content/docs/claude-code/fork-context.mdx                | черновик | первый драфт, на ревью |
| Ветка диалога (/branch)                              | src/content/docs/claude-code/branch-sessions.md              | черновик | заготовка, ждёт текста |
| Разделение на команды                                | src/content/docs/concepts/processes/team-split.md            | черновик | заготовка, ждёт текста |
| AI код-ревью в GitLab через Claude Code              | src/content/docs/concepts/processes/ai-review-gitlab.md      | черновик | заготовка, ждёт текста |
| AI-ревью как барьер откровенной чепухи               | src/content/docs/concepts/processes/ai-review-barrier.md     | черновик | заготовка, ждёт текста |
| Точки трения в производстве                          | src/content/docs/concepts/processes/friction-points.md       | черновик | заготовка, ждёт текста |
| Работа в большом проекте с множеством репозиториев   | src/content/docs/claude-code/multi-repo.md                   | черновик | заготовка, ждёт текста |
| Рабочий пайплайн для деплоя                          | src/content/docs/concepts/processes/deploy-pipeline.md       | черновик | заготовка, ждёт текста |
| OpenAPI в отдельном репозитории как жёсткий контракт | src/content/docs/concepts/processes/openapi-contract.md      | черновик | заготовка, ждёт текста |
| Подход к ведению архитектурного репозитория          | src/content/docs/concepts/processes/arch-repo.md             | черновик | заготовка, ждёт текста |
| Арх-репа и актуализация документации по коду         | src/content/docs/concepts/processes/arch-docs-sync.md        | черновик | заготовка, ждёт текста |
| Встроенные инструменты Pi через settings.json        | src/content/docs/pi/pi-default-tools.md                      | черновик | первый драфт           |
| Фоновые задачи в tmux через pi-tmux                  | src/content/docs/pi/pi-tmux.md                               | черновик | первый драфт           |
