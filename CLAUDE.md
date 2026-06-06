# CLAUDE.md

Документационный сайт на **Astro + Starlight**. Этот файл — инструкция, как с проектом работать.

## Команды

```bash
npm run dev          # dev-сервер на http://localhost:4321
npm run build        # прод-сборка в ./dist
npm run preview      # локальный просмотр собранного
npm run typecheck    # astro check (типы + диагностика .astro/.mdx)
npm run lint         # eslint .
npm run lint:fix     # eslint . --fix
npm run format       # prettier --write .
npm run format:check # prettier --check .
```

Перед коммитом гнать: `npm run format && npm run lint && npm run typecheck` — все три должны быть зелёными.

## Структура контента (Diátaxis)

Страницы лежат в `src/content/docs/`. **Путь файла = URL.** Навигация (сайдбар) описана в `astro.config.mjs`.

Разделы организованы по [Diátaxis](https://diataxis.fr/) — деление по цели читателя:

| Папка          | Тип        | Зачем читателю             |
| -------------- | ---------- | -------------------------- |
| `tutorials/`   | Туториалы  | научиться с нуля, по шагам |
| `guides/`      | How-to     | решить конкретную задачу   |
| `reference/`   | Справочник | посмотреть точные факты    |
| `explanation/` | Концепции  | понять «почему так»        |

Плюс `getting-started.md` (быстрый старт) и `index.mdx` (лендинг, `template: splash`).

Структуру строим **под задачи читателя**, а не под устройство кода.

### Добавить страницу

1. Создать `*.md` / `*.mdx` в нужной папке раздела. Frontmatter минимум: `title`, желательно `description`.
2. Раздел с `autogenerate` подхватит файл сам. Порядок — через `sidebar.order` во frontmatter.

### Гочи Starlight (важно)

- **Starlight ≥ 0.39**: короткая форма `{ label, autogenerate }` удалена. Группу с автогенерацией обязательно оборачивать:
  ```js
  { label: 'Руководства', items: [{ autogenerate: { directory: 'guides' } }] }
  ```
- Любой `slug` в сайдбаре должен соответствовать существующей странице, иначе сборка падает.

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

Два пути — выбирать по тому, нужна ли интерактивность.

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

Вектор: крошечный вес, масштаб без потерь, прозрачность, можно управлять (play/pause/segments/скорость) и реагировать на скролл/ховер. Рендерим через `lottie-web` — без React. В проекте уже есть рабочий пример: компонент `src/components/LottieNeuralNet.astro` и демо на главной (`/`).

Откуда берётся `.json`:

- **из After Effects** — плагин Bodymovin / LottieFiles экспортирует композицию в `.json`;
- **кодом** — пример-генератор `scripts/gen-neural-net-lottie.mjs` (перегенерация: `node scripts/gen-neural-net-lottie.mjs`).

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
