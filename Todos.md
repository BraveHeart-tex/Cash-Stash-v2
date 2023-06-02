# Log

TODO: Refactor Modal and forms to Redux Toolkit
TODO: Fix insight chart rendering issue
TODO: Implement creating, editing, and deleting notification functionality

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
