# Unit-test-Dynamic-Form-Wizard-Builder

Production-ready React + TypeScript boilerplate for a dynamic multi-step form wizard with strict type safety, schema validation, and advanced unit testing.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run test`
- `npm run test:run`

## i18n

- `i18next` and `react-i18next` power localization.
- UI copy, wizard config text, and validation messages live in `src/i18n/locales/en.json`.
- Use `src/i18n/i18n.ts` for the shared i18n instance and config access.
- Keep tests aligned with locale-driven labels and messages instead of hardcoded strings.
