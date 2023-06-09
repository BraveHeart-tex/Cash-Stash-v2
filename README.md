<link rel="stylesheet" href="./markdown.css">

# Cash Stash | Personal Finance Application

<img src='./showcase_imgs/cashstash_desktop_dasboard.png' width='1000'/>

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

## SHOWCASE

- Below, you can find the screenshots of the application in various screen sizes.

### Mobile View

- Dashboard
    <div class="img-gallery">
      <img src="./showcase_imgs/cashstash_mobile_dashboard.png" width="300" />
      <img src="./showcase_imgs/cashstash_darkmode_mobile.png" width="340" />
      <img src='./showcase_imgs/cashstash_dashboard_mobile_2.png' width='340'/>
    </div>

- Accounts Page
    <div class="img-gallery">
      <img src="./showcase_imgs/cashstash_accounts_mobile.png" width="300" />
      <img src="./showcase_imgs/cashstash_mobile_account_2.png" width="290" />
    </div>

- Goals Page
    <div class="img-gallery">
      <img src="./showcase_imgs/cashstash_goal_mobile.png" width="300" />
    </div>

- Budgets Page

    <div class="img-gallery">
      <img src="./showcase_imgs/cashstash_mobile_budgets1.png" width="300" />
      <img src="./showcase_imgs/cashstash_mobile_budget2.png" width="300" />
    </div>

- Transactions Page
    <div class="img-gallery">
      <img src="./showcase_imgs/cashstash_mobile_transactions.png" width="300" />
      <img src="./showcase_imgs/cashstash_transactions_desktop.png" width="300" />
    </div>

- Reports Page
    <div class="img-gallery">
      <img src="./showcase_imgs/cashstash_reports_mobile.png" width="300" />
      <img src="./showcase_imgs/cashstash_reports_desktop.png" width="300" />
    </div>

- Authentication Pages
    <div class="img-gallery">
      <img src="./showcase_imgs/cashstash_signin.png" width="300" />
      <img src="./showcase_imgs/cashstash_signup.png" width="300" />
    </div>

## Tech Stack

- The front end of the application is built with
  - Next.js
  - Chakra UI
  - Redux Toolkit for application wide state management
  - Victory Charts
  - React Hook Form for form validation
  - Axios for HTTP requests
- The back end of the application is built with
  - Next.js 13 App Folder
  - Prisma with PostgreSQL
  - Next Auth for authentication and authorization
  - Cloudinary for image uploads
