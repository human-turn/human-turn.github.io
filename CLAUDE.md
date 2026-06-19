@AGENTS.md

## Claude-специфичные оверрайды

### Гочи Starlight (важно при правках astro.config.mjs и контента)

- **Starlight ≥ 0.39**: короткая форма `{ label, autogenerate }` удалена. Группу с автогенерацией обязательно оборачивать:
  ```js
  { label: 'Руководства', items: [{ autogenerate: { directory: 'guides' } }] }
  ```
- Любой `slug` в сайдбаре должен соответствовать существующей странице, иначе сборка падает.
- **llms.txt:** при изменении структуры разделов — синхронизировать `customSets` в `@rttnd/starlight-llms-txt` (в `astro.config.mjs`), иначе `llms.txt` и `_llms-txt/*.txt` рассинхрон.
