# ts-app-starter

Scaffold a TypeScript project with ESLint and Jest configured out of the box.

## Usage

Use this command to scafold an empty TypeScript project with ESLint and Jest configured.

```bash
npx ts-app-starter
```

Use project types to get boilerplates for that type of project.

```bash
npx ts-app-starter express
```

For example, the above command Will install `express`, `@types/node`, and `@types/express`.

### Project Types

- `express`
  - Installs `express`, `@types/node`, `@types/express`.
  - Writes a simple express server to `src/server.ts`.
- `node`
  - Installs `@types/node`.
  - writes a Hello World program to `src/index.ts`.
