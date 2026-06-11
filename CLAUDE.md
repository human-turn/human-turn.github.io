# CLAUDE.md

Документационный сайт на **Astro + Starlight**. Этот файл — инструкция, как с проектом работать.

## Команды

```bash
npm run dev          # dev-сервер на http://localhost:4321 (порт фиксированный, strictPort)
npm run dev:force    # то же, но со сбросом content layer cache (astro dev --force)
npm run build        # прод-сборка в ./dist
npm run preview      # локальный просмотр собранного
npm run typecheck    # astro check (типы + диагностика .astro/.mdx)
npm run lint         # eslint .
npm run lint:fix     # eslint . --fix
npm run format       # prettier --write .
npm run format:check # prettier --check .
```

Перед коммитом гнать: `npm run format && npm run lint && npm run typecheck` — все три должны быть зелёными.

**Порт dev-сервера фиксирован (4321, `strictPort`).** Если `npm run dev` падает с «port in use» — значит сервер уже запущен (дубль), новый поднимать не надо: открой существующий на 4321 или гаси старый процесс.

**Залипла картинка/frontmatter в dev?** HMR контент-слоя Astro иногда кэширует ассеты (видно по ошибке вроде `LocalImageUsedWrongly` со старым путём). Лечится сбросом content layer cache: погасить сервер и один раз поднять `npm run dev:force` (= `astro dev --force`, замена ручному `rm -rf .astro`), дальше можно обычным `npm run dev`.

**GitHub:** утилита `gh` доступна — используем её для работы с GitHub (PR, issues, releases, API).

## Структура контента

Страницы лежат в `src/content/docs/`. **URL фиксируется через `slug` во frontmatter** (без slug URL = путь файла). Навигация (сайдбар) описана в `astro.config.mjs`.

Разделы — **по предметным темам** (не по Diátaxis). Тип материала (туториал / how-to / концепт) задаём тегом, а не папкой.

Папка задаёт раздел сайдбара (`autogenerate` по директории), но URL держится на `slug` — поэтому файл можно переносить между папками, не ломая ссылки.

| Папка                    | Раздел сайдбара                 | Что внутри                                               |
| ------------------------ | ------------------------------- | -------------------------------------------------------- |
| `start/`                 | Claude Code                     | вводная (что это/зачем), первые возможности агента       |
| `tools/`                 | Харнесс-менеджмент              | MCP, скиллы + CLI, каталоги скиллов                      |
| `infra/`                 | Инфраструктура: модели и доступ | провайдеры, LiteLLM, локальные модели, прокси            |
| `concepts/processes/`    | Процессы команды                | разделение команд, AI-ревью, контракты, арх-репа, деплой |
| `concepts/architecture/` | Прочие возможности агентов      | разное (напр. генерация Lottie через Claude Code)        |
| `claude-code/`           | Продвинутый Claude Code         | /branch, /fork, работа в больших репозиториях            |
| `library/`               | Библиотека блоков               | служебные блоки и эталоны вёрстки                        |

Плюс `index.mdx` (лендинг, `template: splash`) с mermaid-картой материалов: рамки (`subgraph`) = разделы сайдбара, узлы = страницы (кликабельны).

**Подход к организации (digital garden).** Пишем материал свободно и копим, структуру (сайдбар) пересобираем позже, когда тема «потяжелеет». Чтобы накопление не превратилось в хаос — у каждой страницы с первого дня есть метаданные (см. конвенцию frontmatter). Реорганизация дешёвая: сайдбар — это конфиг, а URL держится через `slug`.

### Конвенция frontmatter

Каждая страница:

```yaml
---
slug: tools/my-page # обязательно: фиксирует URL, правила ниже
title: ...
description: ... # желательно
draft: true # пока не принято на ревью — см. ниже
tags: [инструменты, claude-code, how-to] # обязательно: домен + тип
---
```

**Правила `slug`:** slug = путь файла без расширения на момент создания; дальше не меняется — именно это позволяет переносить файл между папками, не ломая URL. Исключение: страницы под `concepts/**` носят плоский slug `concepts/<имя>` (без `processes`/`architecture`). Index-страницы разделов живут без slug.

**Словарь тегов** (держим узким, расширяем осознанно):

- _Домен:_ `claude-code`, `инфра`, `инструменты`, `безопасность`, `процессы`, `росреалии`, `библиотека` (служебные блоки/эталоны)
- _Тип:_ `туториал`, `how-to`, `концепт`, `справочник`, `воркшоп`
- _Уровень:_ `новичок`, `продвинутый`

Index-страницам раздела достаточно одного тега-домена. Ad-hoc теги (`mermaid`, `ui-мок` и т.п.) не вводим — узкая тема видна по title/description.

### Статусы и публикация

- Статус страниц ведём в `REVIEW.md` (корень репо): `черновик` → `на правках` → `принято`.
- Пока не `принято` — держим `draft: true`. Такие страницы видны в `npm run dev`, но **не попадают в прод-сборку** (`npm run build`). Принято → снимаем флаг.

### Метод авторинга (pattern language, по Ричардсону)

Сайт первичен — растим связанный набор материалов, книгу не пишем (при необходимости она потом собирается срезом по тегу). Принципы:

- **Граф, а не дерево.** У каждой страницы внизу блок `## Связанные материалы` со ссылками на соседние (что решает / чем дополняет / что усложняет). Ценность — в связях; оглавление вторично.
- **Строгий каркас — только для практик и концептов.** Материалы-«паттерны» (тип `концепт`, практики) пишем по скелету из `_TEMPLATE.md`: _Зачем (боль) → Как сейчас / без AI → Решение → Что меняется в команде → Риски и росреалии → Связанные материалы_. Туториалы и how-to — свободная форма, но блок «Связанные материалы» обязателен и в них.
- **Росреалии — отдельный слой.** Импортозамещение моделей (GigaChat/YaGPT vs зарубежные), 152-ФЗ и перс-данные, доступность API — выносим в блок «Риски и росреалии» и помечаем тегом `росреалии`, чтобы вытаскивать отдельной подборкой.
- **Идеи копим в `INBOX.md`.** Конвейер: **инбокс → черновик (`draft: true`) → на правках → принято** (статусы в `REVIEW.md`).

### Добавить страницу

1. Идея сначала падает строкой в `INBOX.md` — захват скиллом `/idea` (сам выбирает секцию, ставит метку опыта, ловит дубли).
2. Когда дозрела — скилл `/draft` разворачивает её в черновик через интервью с автором (тип, папка, frontmatter, регистрация — по конвенциям этого файла). Вручную: создать `*.md` / `*.mdx` в нужной папке раздела, для практик/концептов — копировать из `_TEMPLATE.md`; frontmatter по конвенции выше (как минимум `slug`, `title`, `tags`, `draft: true`).
3. Раздел с `autogenerate` подхватит файл сам. Порядок — через `sidebar.order` во frontmatter.
4. Вписать строку в `REVIEW.md`.

### Гочи Starlight (важно)

- **Starlight ≥ 0.39**: короткая форма `{ label, autogenerate }` удалена. Группу с автогенерацией обязательно оборачивать:
  ```js
  { label: 'Руководства', items: [{ autogenerate: { directory: 'guides' } }] }
  ```
- Любой `slug` в сайдбаре должен соответствовать существующей странице, иначе сборка падает.
- **llms.txt:** при изменении структуры разделов (переименование/добавление/удаление папок сайдбара) — синхронизировать `customSets` в конфиге плагина `@rttnd/starlight-llms-txt` (в `astro.config.mjs`), иначе в `llms.txt` и `_llms-txt/*.txt` рассинхрон с реальной структурой сайта.

## Качество кода

- **TypeScript**: `tsconfig` расширяет `astro/tsconfigs/strictest` (включая `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`). Не использовать `any` — `unknown` + type guards; не использовать `as` без необходимости; предпочитать `satisfies`, дискриминированные юнионы, `as const`.
- **ESLint**: flat config (`eslint.config.js`) — `typescript-eslint` + `eslint-plugin-astro` (recommended). `eslint-config-prettier` идёт последним.
- **Prettier**: табы, одинарные кавычки, `printWidth: 100`, `proseWrap: preserve` (прозу в markdown не переносит). Плагин `prettier-plugin-astro`.
- **Алиас импортов**: `~/*` → `src/*` (в `tsconfig.json`). В рецептах и компонентах используем его вместо относительных путей — не зависит от глубины страницы.
- **a11y-линтинг отложен**: `eslint-plugin-jsx-a11y` пока не поддерживает ESLint 10 (issue jsx-eslint/eslint-plugin-jsx-a11y#1075). Вернуть, когда выйдет совместимый релиз.

## Интерактив и «плюшки»

### Терминал / код-блоки (готово из коробки)

Starlight тянет **Expressive Code** — терминальные/редакторные фреймы, подсветка строк, диффы, копирование. Заголовок включает фрейм:

````md
```bash title="Установка"
npm install
```
````

### Компоненты Starlight

```mdx
import {
	Tabs,
	TabItem,
	Card,
	CardGrid,
	Steps,
	FileTree,
	Aside,
	Badge,
} from '@astrojs/starlight/components';
```

### Острова других фреймворков

Starlight рендерит компоненты React/Vue/Svelte/Solid в MDX. Интерактив включается клиентскими директивами: `client:load`, `client:visible`, `client:idle`, `client:only="<framework>"`.

### Remotion (встраивание анимаций)

Рецепт на будущее — react/remotion в проект пока не подключены. Два пути — выбирать по тому, нужна ли интерактивность.

**A. Живой интерактивный `<Player>`** (анимация рендерится в браузере, можно параметризовать/управлять):

```bash
npm i remotion @remotion/player
npx astro add react       # добавит @astrojs/react + react/react-dom
```

Обёртка с ленивой загрузкой композиции (меньше начального бандла):

```tsx
// src/components/RemotionDemo.tsx
import { Player } from '@remotion/player';
import { useCallback } from 'react';

export default function RemotionDemo() {
	const lazyComponent = useCallback(() => import('~/remotion/MyComp'), []);
	return (
		<Player
			lazyComponent={lazyComponent}
			durationInFrames={120}
			compositionWidth={1280}
			compositionHeight={720}
			fps={30}
			controls
			loop
			style={{ width: '100%' }}
		/>
	);
}
```

```mdx
import RemotionDemo from '~/components/RemotionDemo';

<RemotionDemo client:only="react" />
```

> **Важно:** Remotion лезет к browser-API, поэтому SSR ему противопоказан — используем `client:only="react"` (или `client:visible` для отложенной гидрации). Для тяжёлых демо давать постер-картинку первого кадра.

**B. Рендер в видео + `<video>`** (если интерактив не нужен): отрендерить композицию в MP4/WebM через Remotion CLI и встроить как `<video>`. Легче по CPU и бандлу, предсказуемое воспроизведение, поддерживает субтитры. GIF — только для совсем коротких превью (тяжёлый и без управления); из современных — WebP/APNG лучше GIF.

Правило: **нужна интерактивность → Player-остров; просто показать → видео.**

### Lottie (векторные анимации, в т.ч. из After Effects)

Вектор: крошечный вес, масштаб без потерь, прозрачность, можно управлять (play/pause/segments/скорость) и реагировать на скролл/ховер. Рендерим через `lottie-web` — без React. В проекте уже есть рабочий пример: компонент `src/components/LottieNeuralNet.astro` и туториал `library/lottie-embed.mdx` (`draft: true`).

Откуда берётся `.json`:

- **из After Effects** — плагин Bodymovin / LottieFiles экспортирует композицию в `.json`;
- **кодом** — генераторы в `scripts/` (`gen-neural-net-lottie.mjs`, `gen-fork-context-lottie.mjs`); перегенерация: `node scripts/<генератор>.mjs`.

Файл анимации кладём в `public/` (отдаётся из корня, напр. `/neural-net.json`). Шаблон плеера:

```astro
---
const { src = '/your-animation.json' } = Astro.props;
---

<div class="lottie" data-src={src}></div>

<script>
	import lottie from 'lottie-web';
	for (const el of document.querySelectorAll('.lottie')) {
		const src = el instanceof HTMLElement ? el.dataset.src : undefined;
		if (src)
			lottie.loadAnimation({
				container: el,
				renderer: 'svg',
				loop: true,
				autoplay: true,
				path: src,
			});
	}
</script>
```

- **Умеет:** формы, заливки/обводки, трансформы (позиция/масштаб/прозрачность), trim-path (прорисовка линий), текст, безье-изинг, луп.
- **Не тянет:** часть AE-эффектов (blur, некоторые маски) и растровые слои — сложные сцены проверять на экспорте.
- Альтернатива плееру: веб-компонент dotLottie `@lottiefiles/dotlottie-wc` (поддерживает сжатый `.lottie`).

Когда что: **«нарисованная» сцена из AE → Lottie; реакция на пользователя → Rive; программная/датадривен → Remotion; фон без интерактива → видео.**
