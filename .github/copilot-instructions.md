# Project Guidelines — Dynamic Form Wizard Builder

## Tech Stack

- **React 19** (function components only) + **TypeScript 6**
- **Vite 8** for bundling; **Vitest 4** for testing
- **react-hook-form 7** with `zodResolver` for form state and validation
- **Zod 4** for both config schemas and form value schemas
- **@tanstack/react-query 5** for server state (not yet wired to the wizard)
- **CSS Modules** exclusively — no Tailwind, no utility frameworks

## Architecture

The wizard has three layers:

1. **Config layer** (`schemas/wizardConfig.ts`): Zod discriminated-union schema that validates the wizard definition at runtime via `wizardConfigSchema.parse(config)`.
2. **Orchestrator** (`components/FormWizard.tsx`): Owns all `react-hook-form` state (`useForm`, `useWatch`, `trigger`). Handles field rendering via a helper function `renderField(...)`, not a sub-component. Delegates step navigation to `useFormWizard`.
3. **Leaf inputs** (`components/form-controls/`): Purely presentational — receive `id`, `name`, `register`, `error` props only. No internal form state.

## Conventions

### Components

- **Named exports only** — never default-export components.
- **`type` aliases, not `interface`** — use `type Props = { ... }` defined just above the component.
- **`import type`** for all type-only imports.
- Leaf inputs always receive `error` as `string | undefined`, never the raw RHF `FieldError` object.
- `FieldPath<WizardFormValues>` for the `name` prop; never `string`.
- Accessibility: every input has a matching `id` prop and the label uses `htmlFor={id}`.

### Schemas & Types

- **All domain types come from `z.infer<>`** — no hand-written interfaces for data shapes.
- Keep form-value schemas in `schemas/formSchema.ts` and config schemas in `schemas/wizardConfig.ts`.
- Cross-field validation lives as `.refine()` on the top-level `wizardFormSchema`.
- Config must always be validated at runtime with `wizardConfigSchema.parse(...)` — both in `App.tsx` and in tests.
- Locale-driven copy lives in `src/i18n/locales/en.json`; use `i18next`/`react-i18next` via `src/i18n/i18n.ts`.
- Prefer locale data over hardcoded UI text in components, schemas, and tests.

### CSS / Styling

- Every component has a paired `ComponentName.module.scss` file co-located with it.
- Apply styles with `className={styles.className}`; combine classes with template literals: `` `${styles.button} ${styles.nextButton}` ``.
- Vitest is configured with `classNameStrategy: 'non-scoped'`, so test assertions use the raw class name: `toHaveClass('nextButton')`.

### TypeScript

- No `any` — use `unknown` where the type is truly unknown.
- Type assertions (`as`) only where strictly necessary.
- Use `ReturnType<typeof useForm<WizardFormValues>>['register']` for precise `register` prop types.

## Build & Test Commands

```bash
npm run dev       # Vite dev server
npm run build     # tsc -b && vite build
npm run test      # vitest (watch)
npm run test:run  # vitest run (CI / single-pass)
```

## Testing Conventions

- Test files live in `src/components/__tests__/`, not alongside each component file.
- Global setup: `src/test/setupTests.ts` — imports `@testing-library/jest-dom/vitest`.
- `vitest.config.ts` is separate from `vite.config.ts` (not merged).
- `globals: true` is set — but still import `describe`, `it`, `expect` explicitly from `vitest` in test files.
- Parse config with `wizardConfigSchema.parse({...})` at module scope (not inside `beforeEach`).
- Use `userEvent.setup()` for all user interactions — never `fireEvent`.
- Query by accessible role/label using locale text where possible.
- Use `screen.findByText(...)` (async) after user actions that trigger async state changes; use `screen.getByText(...)` (sync) for immediately visible elements.
- Write large integration-style tests that exercise a full user flow end-to-end — one `it` block per scenario.
- No mocking of react-hook-form or Zod — use the real implementations.
