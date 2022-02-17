# CelestiaQL
CelestiaQL's goal is to provide a powerful querying engine and developer-friendly API for accessing `payForMessage` data on [Celestia](https://celestia.org). This can allow develoers to easily build dApps with Celestia as the backend. It can also help developers and users debug on-chain activity. Lastly, it enables a birds-eye view into how people are using Celestia.

## How to run
1. Install `celestia-appd`. [Instructions are here.](https://mzonder.notion.site/Celestia-Application-validator-node-Install-devnet-2-3a3087806d8b492ca937133c1fbca947)
2. Step 1 might take a while. Once it is done catching up, start Celestia. Do this either one of two ways: start the service (following the above instructions) or run the command `celestia-appd start`.
3. Install and run [MongoDB](https://www.mongodb.com/try/download/community).
4. Clone this Git repo `git clone https://github.com/lzrscg/celestiaql && cd celestiaql`
5. Make sure you have `nodejs` and `npm` installed. If not, you can use the [official website](https://nodejs.org/en/download) or [nvm](https://github.com/nvm-sh/nvm).
6. `npm i`
7. `npm start`
8. (optional) if you want to develop, install the [protobuf compiler](https://grpc.io/docs/protoc-installation).

## How this is different from Juno
> [Juno](https://github.com/fissionlabsio/juno) is a Cosmos Hub blockchain data aggregator and exporter that provides the ability for developers and clients to query for indexed chain data. Celestia uses a forked versin of Juno by [Forbole](https://github.com/forbole).

Juno is great! However, CelestiaQL has a different goals and a different approach.

### MongoDB
Juno previously used [MongoDB](https://www.mongodb.com), but now it exclusively uses PostgreSQL. While PG is a great database, it is not optimal for storing `payForMessage` data. This is because `payForMessage` data is unstructured and is better stored in a [document database](https://www.mongodb.com/document-databases). MongoDB allows for rich and complex queries aggregating and filtering through many varied documents.

### NodeJS
There isn't a very good justification for this. In fact, this would have been easier in Go. I started developing this in Node because I am quicker at experimenting in it. Then, after going down the rabbit hole, I did too much in Node to want go back.

Node does have one advantage over Go. In my opinion, there is better tooling for providing nice APIs for users.

### CelesJS
CelesJS (name inspired by [CosmJS](https://github.com/cosmos/cosmjs)) is a collection of JS classes and functions that help JavaScript projects work with Celestia. It is basically a reimplementation of parts of [celestia-app](https://github.com/celestiaorg/celestia-app) in pure JS as well as some [tendermint](https://github.com/tendermint/tendermint) data structures.

At this time, the functionality wholely revolves around building up the namespaced merkel tree to generate commitment share hashes. In CelestiaQL, this is used to match block data with the messages inside of the transactions.

### Lightweight
CelestiaQL does not store the same data that Juno does. Both can be run alongside each other and would compliment each other nicely. Juno does not index the data inside of the blocks, whereas that is the only thing that CelestiaQL indexes (along with a minimal amount of metadata). CelestiaQL also makes much less requests than Juno, pulling just the blocks and not every individual transaction.

## Status
_In Development_

Currently, it will start syncing blocks and successfully add messages to MongoDB. Unfortunately, there is a bug that prevents the history from fully syncing. GraphQL API coming soon.

### Known bugs
* **History syncing fails** - somewhere there is a block that breaks the sync process. This stems from the CelesJS implementation of the NMT.

### Features to add (in order of approx. priority)
* Listen for new blocks
* Preventing syncing history multiple times
* Custom parsers (this will allow you to parse every message inside of a namespace to check for validity and serialize it to JSON so that it can be queried on the DB)
* Custom reducers (this will allow you to calculate state over time by processing messages in order)
* GraphQL API
* Block explorer UI
* Subscriptions
* Send `payForMessages` using the API