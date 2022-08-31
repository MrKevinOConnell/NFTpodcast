## Getting Started
- install node -> https://nodejs.org/en/download/
- install yarn -> `npm install --global yarn`
- run yarn -> `yarn`
- if on mac, install homebrew https://brew.sh/
  - `brew install postgresql`
  - `brew services start postgresql`
  - `psql postgres`
  - `CREATE DATABASE nft;`
- not sure how to setup postgres on non mac device

To run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Routes

[contract].tsx - view of a contract, whether they have signed in or not (WIP)
index.tsx - basic view of the site (WIP)


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
