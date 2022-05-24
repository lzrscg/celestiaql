# CelestiaQL
This is a rewrite of the original CelestiaQL codebase. The purpose of this is to replace bdjuno in order to index Celestia data into the Big Dipper block explorer.

## Set up
1. `npm i`
2. `docker-compose up`
3. `npm run hasura:apply` (this should happen automatically via docker, but it doesn't)

## How to generate models
The sequelize models can be generated from the bdjuno schema.
1. `docker-compose up`
2. `npm run gen:sequelize`