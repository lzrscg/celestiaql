# CelestiaQL
This is a rewrite of the original CelestiaQL codebase. The purpose of this is to replace bdjuno in order to index Celestia data into the Big Dipper block explorer.

## How to generate models
1. Build and run `database/Dockerfile` (remember to expose the port `-p 5432:5432`, i.e. `docker run -p 5432:5432 pg-celestiaql:latest`)
2. `npm run gen:sequelize`