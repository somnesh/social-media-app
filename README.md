# Social Media App (similar to Twitter)

A social media app inspired by Twitter. It is a full-stack web application that uses various web technologies for its implementation.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisite](#prerequisite)
- [Installation](#installation)
<!-- - [Usage](#usage)
- [Project Structure](#project-structure)
- [License](#license) -->

## Features

- Users can create an account and existing users can login to their account.
- The user can create posts, which can be only, text, photos, or videos.
- User can edit their posts after publishing.
- Users can like and comment on other posts posted by other users.
- Users can check their profile and other people's profile as well.

## Technologies Used

**Frontend**:

- **Core:** HTML, CSS, JavaScript
- **Library:** React.js

**Backend**:

- **Core:** Node.js
- **Framework:** Express.js

**Database**

- MongoDB Atlas

## Prerequisite

1. `Node.js`
2. `Express.js`
3. `React`
4. `MongoDB Atlas` account
5. **IDE:** `Visual Studio Code` (Recommend) or any other as per your choice.
6. (Optional) `Postman` For API testing

## Installation

### Follow the step-by-step procedure for your local development setup:

**Clone the repository:**
First, clone the repository, for any help or step-by-step procedure on how to clone a repository please check out this article:
https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository

**Intermediate Steps:**
After cloning or downloading the project in your terminal change the current directory to the project folder.
By running the following command, [note: if you are using VS code then you can skip this part just press ``ctrl+ `(backtick)`` to open the terminal within VS code]

```bash
cd your-local-path/social-media-app
```

**Main Setup:**
There are 2 individual setups required:

1. [Frontend](#client-setup)
2. [Backend](#server-setup)

### Client Setup

For setting up the client side, you need to install some packages. Before that make sure to change the directory in your terminal,

```bash
cd client
```

Then run the following command,

```bash
npm install
```

This will install all the necessary packages. After all packages are downloaded and installed successfully run the following command,

```bash
npm run dev
```

If everything is good then you should see:

![Vite server running screenshot](images/vite.png)

### Server Setup:

Before you do anything in the server setup, you must set up the `.env` file. In the backend, the `.env` file should contain the following,

1. `MONGO_URI`
2. `JWT_SECRET`
3. `JWT_REFRESH_SECRET`
4. `JWT_LIFESPAN`
5. `JWT_REFRESH_LIFESPAN`
6. `CLOUDINARY_CLOUD_NAME`
7. `CLOUDINARY_CLOUD_API`
8. `CLOUDINARY_CLOUD_API_SECRET`
9. `CLOUDINARY_URL`
10. `NODEMAILER_EMAIL`
11. `NODEMAILER_PASSWORD`
12. `NODEMAILER_SERVICE`
13. `URL_ENCRYPTION_SECRET`
14. `API_URL`
15. `CLIENT_URL`
16. `RESET_PASSWORD_TOKEN_SECRET`
17. `RESET_PASSWORD_TOKEN_SECRET_EXPIRATION`

The `MONGO_URI` is your `MongoDB atlas` database connection string.
The `JWT_SECRET` contains an Encryption key, you need to create an Encryption key 256bit. You can use this website for the key generation: https://acte.ltd/utils/randomkeygen.

On the client side, the `.env` file should contain the following,

1. `VITE_API_URL`
2. `VITE_UNSPLASH_API`
3. `VITE_APP_URL`
4. `VITE_SERVER_URL`
5. `VITE_URL_ENCRYPTION_SECRET`
6. `VITE_CLOUDINARY_CLOUD_NAME`
7. `VITE_CLOUDINARY_CLOUD_API`

After setting all this up, again make sure to change the directory in your terminal,

```bash
cd server
```
After changing the directory, run the following command,

```bash
npm install
```
This will install all the necessary packages. Then you can start the server by running the following command,

```bash
npm test
```

If you can see a log in the terminal that says,

```bash
Server is listening on port 3000...
```

you are good to go, if not then troubleshoot. Good luck 🍀.
