## Getting Started

Creat new and config file '.env' in root folder

```Bash
DATABASE_URL="sqlserver://servername:port;database=Data_LapTrinh_De6_Web;user=___;password=____;trustServerCertificate=true"
```

First, run the development server:

```bash
# step 1:
npm run i

# step 2:
npx prisma generate

# step 3:
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
