---
name: sidebar-management
description: How to work with the sidebar and content structure of this site. Use when adding, moving, or reordering pages, or when changing the sidebar configuration.
---

# Sidebar Management

## Principles

The site uses a **hybrid sidebar**: manual groups at the top level, `autogenerate` within groups.

- **Top-level sections** are defined manually in `astro.config.mjs` → `sidebar[]`
- **Within each section**, files are discovered via `autogenerate: { directory: '...' }` — just drop a `.md`/`.mdx` file into the folder and it appears automatically
- **Ordering** is controlled by `_meta.yml` files (powered by `starlight-auto-sidebar`) and `sidebar.order` in frontmatter
- **Slug = file path** — no explicit `slug:` in frontmatter. Moving a file changes its URL

## Adding a new page

1. Create `.md`/`.mdx` file in the appropriate folder under `src/content/docs/`
2. Add frontmatter: `title`, `description`, `draft: true`, `tags`
3. Optionally set `sidebar: { order: N }` to control position within the group

Done. `autogenerate` picks it up automatically.

## Adding a new section or subsection

1. Create the folder with `index.md` + `_meta.yml`
2. Add to `astro.config.mjs` → `sidebar[]` with the appropriate nesting level
3. Update `llms-txt` `customSets` if the new section is top-level

## Controlling order

### Directories (folders as sidebar groups)
Via `_meta.yml` in the folder:
```yaml
order: 3          # position in parent group (lower = higher)
sort: label       # how to sort items inside: 'slug' | 'label' | 'reverse-slug' | 'reverse-label'
label: 'Custom'   # override displayed name
hidden: true      # hide from sidebar
```

### Individual pages
Via frontmatter:
```yaml
sidebar:
  order: 2        # position in parent group
  label: 'Custom' # override displayed title
```

## Renaming a section

1. Update `title` in the section's `index.md`
2. Update `label` in `astro.config.mjs` → `sidebar[]`
3. Update `label` in `llms-txt` → `customSets[]`
4. Update any cross-references in other pages

## Current structure (2026-06-19)

```
src/content/docs/
├── index.mdx                    # Splash page with section directory
├── chronology/                  # Хронология
├── agents/                      # Агенты разработки
│   ├── index.md                 #   Общие сведения
│   ├── claude-code/             #   Claude Code
│   ├── pi/                      #   Pi Coding Agent
│   └── advanced/                #   Продвинутые техники
├── skills/                      # Скиллы и инструменты
├── infra/                       # Инфраструктура
│   ├── litellm/                 #   LiteLLM
│   └── providers/               #   Провайдеры
├── misc/                        # Прочее
├── processes/                   # Практика внедрения
└── library/                     # Библиотека блоков (reusable blocks)
```

## Key files

| File | Purpose |
|---|---|
| `astro.config.mjs` | Sidebar structure, llms-txt customSets |
| `src/content.config.ts` | `autoSidebar` collection (required by `starlight-auto-sidebar`) |
| `src/content/docs/*/_meta.yml` | Per-folder ordering and sorting config |

## Dependencies

- `starlight-auto-sidebar` — enables `_meta.yml` for autogenerate ordering
- `@astrojs/starlight` — built-in `autogenerate`, `sidebar.order` frontmatter
