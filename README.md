<link rel="stylesheet" href="./markdown.css">

# Cash Stash | Personal Finance Application

<img src='https://res.cloudinary.com/dmwafn98h/image/upload/v1698497726/rafs6puj7vrr2zpw4n0p.jpg' width='1000'/>

Cash Stash is a personal finance application that offers various functionalities. Users can create account with different account types, create transactions related to their accounts, create goals, budgets and reminders. The UI of the application is built with Chakra UI and Next.js to offer the best user experience on all screen sizes.

## Live Demo

You can check out the live of of this application from this [link](https://cash-stash.vercel.app)

- You can use the following credentials to sign in to the application
  > Email: testUser@gmail.com
  > Password: testuser123

## Key Features

1. Create an account by signing up. You can use your Google or Github account to sign in.
1. Once signed in, users can create an account by providing the necessary information.
1. Users can add financial goals in different categories.
1. Users can add budgets and their progress is displayed automatically by the specified current amount.
1. Users can register transactions with their related accounts.
1. The application also offers users to create, read, update and delete their accounts, budgets, goals and transactions.
1. Users can also see insights generated from their financial data within the application.
1. The application is responsive on all screen sizes and also supports accessibility features and dark / light mode.

## Tech Stack

- The front end of the application is built with
  - Next.js
  - Shadcn UI
  - Redux Toolkit for application wide state management
  - Recharts
  - React Hook Form and Zod for form validation
  - Axios for HTTP requests
- The back end of the application is built with
  - Next.js 13 App Directory with Server Actions
  - Prisma with PostgreSQL
  - JWT for authentication and auhtorization middleware
  - Cloudinary for image uploads
