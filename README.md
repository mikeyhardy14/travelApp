# Travel App with Subdomain Architecture

This project demonstrates a Next.js application with a subdomain-based architecture. The main application is available under the "app" subdomain with integrated dashboard, chat, and explore features.

## Features

- **Main App** (localhost:3000) - The main landing page with links to the app subdomain
- **App Subdomain** (app.localhost:3000) - The authenticated application with:
  - Dashboard - User dashboard for managing trips and travel plans
  - Chat - Chat functionality for communicating with travel companions
  - Explore - Discover and explore travel itineraries

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
yarn install
```

### Running the Development Server

```bash
# Standard development mode
npm run dev
# or
yarn dev

# With subdomain support
npm run dev:subdomains
# or
yarn dev:subdomains
```

### Setting up Local Subdomains

For local development, you need to set up subdomains on your local machine. The easiest way is to modify your hosts file:

#### Windows
1. Open Notepad as administrator
2. Open file: `C:\Windows\System32\drivers\etc\hosts`
3. Add the following lines:
```
127.0.0.1 localhost
127.0.0.1 app.localhost
```
4. Save the file

#### macOS/Linux
1. Open terminal
2. Edit hosts file: `sudo nano /etc/hosts`
3. Add the following lines:
```
127.0.0.1 localhost
127.0.0.1 app.localhost
```
4. Save the file (Ctrl+O, then Ctrl+X)

### Accessing the Application

After starting the development server, you can access:
- Main app: http://localhost:3000
- App subdomain: http://app.localhost:3000

## Application Structure

The app subdomain has its own layout with a navigation bar for switching between:
- Dashboard (default landing page)
- Chat
- Explore

Each section provides specific functionality while maintaining a consistent navigation experience.

## Architecture

The application uses Next.js rewrites to route subdomain requests to the correct pages:

- Main app - serves from `app/page.tsx`
- App subdomain - serves from `app/app/*` with:
  - Dashboard - `app/app/dashboard/page.tsx`
  - Chat - `app/app/chat/page.tsx`
  - Explore - `app/app/explore/page.tsx`

## Production Deployment

When deploying to production:

1. Update the domain in `next.config.mjs` to your actual domain
2. Ensure your DNS settings are configured for the app subdomain
3. Configure your web server to properly route subdomain requests to the Next.js application

## Technologies Used

- Next.js 14.x
- React 18.x
- Tailwind CSS
- TypeScript

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
