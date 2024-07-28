## Prerequisite

- `Node.js` should be installed before proceed further.
- A `MongoDB Atlas` account
- (Optional) For API testing `Postman`

## Installation

Run the following code after cloning or downloading the project.

```bash
npm install
```

After that, you need to setup `.env` file. The `.env` file should contain 3 things for at least now,

1. `MONGO_URI`
2. `JWT_SECRET`
3. `JWT_LIFESPAN`

After setting all this up, you can start the server by running the following command

```bash
npm start
```

If you can see a log in the terminal that says

```bash
Server is listening on port 3000...
```

you are good to go, if not then troubleshoot.

Good luck 🍀.
