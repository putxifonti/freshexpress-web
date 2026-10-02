# Contributing to FreshExpress

Thank you for your interest in contributing to FreshExpress! 🌱

## How to contribute

### Reporting bugs

If you find a bug, please open an issue with:

- A clear description of the problem
- Steps to reproduce it
- Expected behaviour vs actual behaviour
- Screenshots if applicable
- System information (browser, OS, etc.)

### Suggesting features

New ideas are welcome! Open an issue with:

- Description of the feature
- Use case / problem it solves
- Possible implementations (optional)

### Submitting Pull Requests

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/putxifonti/freshexpress-web.git
   ```
3. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/my-new-feature
   ```
4. **Make your changes** and make sure that:
   - The code follows the project style
   - You have added tests if necessary
   - The documentation is up to date
5. **Commit** your changes:
   ```bash
   git commit -m "feat: add new feature X"
   ```
6. **Push** to your branch:
   ```bash
   git push origin feature/my-new-feature
   ```
7. **Open a Pull Request** with a clear description of the changes

## Code style

### General conventions

- Use TypeScript whenever possible
- Follow Astro conventions for components
- Use Tailwind CSS for styles
- Keep variable and function names consistent with the surrounding code
- Write user-facing UI in Catalan; keep comments clear and consistent

### Commit format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Formatting (does not affect code)
- `refactor:` - Code refactoring
- `test:` - Add or modify tests
- `chore:` - General maintenance

### Examples:

```
feat: add rating system for delivery drivers
fix: correct error in cart total calculation
docs: update README with new instructions
```

## Project structure

```
src/
├── components/     # Reusable components
├── layouts/        # Page layouts
├── lib/            # Utilities and helpers
├── pages/          # Pages and API routes
│   ├── api/        # REST endpoints
│   ├── admin/      # Admin pages
│   └── repartidor/ # Delivery driver pages
└── styles/         # Global styles
```

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables:

   ```bash
   cp .env.example .env
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open http://localhost:4321

## Verification

```bash
npm ci
npm run build
```

There is no automated `npm run test` script yet. For UI changes, manually check affected routes and links; for database changes, test against a disposable database, never production.

## Database

The schema, six companies and 58 products are initialized only for a **new, empty** MySQL instance using the three curated scripts described in [DEPLOYMENT.md](DEPLOYMENT.md). Do not run them against existing data. They assume the Docker MySQL entrypoint has created the application DB user.

## Questions?

If you have questions, you can:

- Open an issue with the `question` label
- Contact the team at info@freshexpress.cat

Thank you for contributing! 💚
