# Log

TODO: Clear Account Information: Displaying additional information about each account, such as account type, account number, or associated transactions.
TODO: Edit Account: Add the ability for users to edit account details. This could include changing the account name, updating the balance, or modifying any other relevant account information.
TODO: Confirmation Dialog: Adding a confirmation dialog or prompt before deleting an account. This helps prevent accidental deletions and allows users to confirm their actions.
TODO: Implement filters based on account categories

- User:

At least one of the following fields is required: name or email.
hashedPassword is required if you want to store the user's password.
Other fields are optional.

- UserAccount:

name is required.
balance is required.
userId (referencing a User) is required.

- Transaction:

amount is required.
description is required.
category is required.
accountId (referencing an Account) is required.
userId (referencing a User) is required.

- Budget:

budgetAmount is required.
spentAmount is required.
userId (referencing a User) is required.

- Goal:

name is required.
goalAmount is required.
currentAmount is required.
userId (referencing a User) is required.

- Reminder:

title is required.
amount is required.
date is required.
userId (referencing a User) is required.
