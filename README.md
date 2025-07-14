# Welcome to your Lovable project

## Running Tests

To run all unit and component tests:

```sh
npm run test
```

To check coverage:

```sh
npm run test -- --coverage
```

## Continuous Integration

This project runs tests automatically on every push and pull request via GitHub Actions (see `.github/workflows/ci.yml`).

## Playwright E2E Testing

For end-to-end browser tests, install Playwright:

```sh
npm install --save-dev playwright
```

Then run:

```sh
npx playwright install
```

Add your E2E tests in a `tests/e2e/` directory. See the [Playwright docs](https://playwright.dev/) for examples.


## Project info

**URL**: https://lovable.dev/projects/4db3904e-c787-4e8c-ab04-c56a4ed7ab49

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/4db3904e-c787-4e8c-ab04-c56a4ed7ab49) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/4db3904e-c787-4e8c-ab04-c56a4ed7ab49) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
