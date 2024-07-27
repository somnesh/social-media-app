## Prerequisite
- `Node.js` should be installed before proceed further.
- A `MongoDB Atlas` account
## Installation
Run the following code after cloning or downloading the project.
```terminal
npm install
```
After that you need to setup 2 files, `.env` and `.gitignore`. The `.env` file should contain 3 things for atleast now, 
1. `MONGO_URI`
2. `JWT_SECRET`
3. `JWT_LIFESPAN`
   
and the `.gitignore` file should contain the following,
1. `/node_modules`
2. `.env`
   
After setting all this up, you can start the server by running the following command
```terminal
npm start
```
If you can see a log in the terminal that says
```terminal
Server is listening on port 3000...
```
you are good to go, if not then troubleshoot.
Good luck.
