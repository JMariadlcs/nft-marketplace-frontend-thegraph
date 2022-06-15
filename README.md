# NFT MARKETPLACE FRONTEND MORALIS 🦄

This is a one of the two Frontend implementation of a NFT Marketplace from Patrick Alpha's fcc. The backend repo can be found [here](https://github.com/JMariadlcs/nft-marketplace-backend).

The frontend of this project is being implemented in two different ways:

1. Using [Moralis Indexer Frontend](https://github.com/JMariadlcs/nft-marketplace-frontend-moralis).
2. Using TheGraph.

The workshop followed to complete this repo is [this one](https://github.com/PatrickAlphaC/nextjs-nft-marketplace-moralis-fcc).

The repo that we are going to implement is like [this one](https://www.youtube.com/watch?v=gyMwXuJrbJQ&t=15996s).

## PROJECT

Objetives of the frontend project:

1. Home Page: ✅
    1. Show recently listed NFTs.
        1. If you are the owner, you can update the listing.
        2. If you are NOT the owner, you can buy de listing.
2. Sell Page: ✅
    1. You can list your NFT to be sold.
    2. Withdraw proceeds.

## CREATE SIMILAR PROJECT FROM SCRATCH

-   Create Next.js project:

```bash
yarn create next-app .
```

-   Add Moralis to interact with front-end:

```bash
yarn add moralis react-moralis
```

-   Add Moralis web3uikit to interact with front-end:

```bash
yarn add web3uikit

```

-   Add tailwindcss (CSS formarter):

```bash
yarn add --dev tailwindcss postcss autoprefixer
```

-   Initialize tailwindcss:

```bash
yarn tailwindcss init -p
```

-   Override [tailwind.config.js](https://github.com/JMariadlcs/nft-marketplace-frontend-moralis/blob/main/tailwind.config.js) with the code inside this file.
-   Override [global.css](https://github.com/JMariadlcs/nft-marketplace-frontend-moralis/blob/main/styles/globals.css)

## RUN LOCAL SERVER

```bash
yarn dev
```

You will have your local server running at: `http://localhost:3000`.

-   Open new bash terminal to use while yarn server is running

## USE MORALIS SERVER

### LISTEN FOR EVENTS

We are using Moralis server (centralized) to listen for events. We are indexing the events off-chain and then read them from data-base. Setup a server to listen for these events to be fired and then add them to a database.

To do so:

1. Go to [moralis.io](https://moralis.io/) and create a dApp.
2. Inside [_app.js]:
   Replace

```bash
<MoralisProvider initializeOnMount={false}>
```

by

```bash
  <MoralisProvider appId ="xxx" serverUrl="xxx">
```

**REMINDER**: user enviromental variables.

3. Create an event entry on Moralis database.

    1. Connect it to our blockchain:

    - Go to [backend repo](https://github.com/JMariadlcs/nft-marketplace-backend) and start local blockchain:

    ```bash
    yarn hardhat node
    ```

    - Download your required [frpc](https://github.com/fatedier/frp/releases) version. (If you are MAC user: frp_0.36.2_darwin_amd64).
    - We are using `frpc` and `frpc.ini`
    - Create new folder [frp](https://github.com/JMariadlcs/nft-marketplace-frontend-moralis/tree/main/frp) and paste the above metioned files.
    - Paste what Moralis gives you inside [frpc.ini](https://github.com/JMariadlcs/nft-marketplace-frontend-moralis/blob/main/frp/frpc.ini):

    ```bash
    [common]
    server_addr = nmk4ye9zkaww.usemoralis.com
    server_port = 7000
    token = WVoNKUfNOt
    [hardhat]
    type = http
    local_port = 8545
    custom_domains = nmk4ye9zkaww.usemoralis.com
    ```

    - Go to [frp](https://github.com/JMariadlcs/nft-marketplace-frontend-moralis/tree/main/frp) and execute:

    ```bash
    ./frpc -c frpc.ini
    ```

    OR

    - Follow the intructions to install [Moralis CLI](https://docs.moralis.io/moralis-dapp/tools/moralis-admin-cli). (inside [frp](https://github.com/JMariadlcs/nft-marketplace-frontend-moralis/tree/main/frp))
    - Go to [package.json](https://github.com/JMariadlcs/nft-marketplace-frontend-moralis/blob/main/package.json) and under scripts include:

    ```bash
    "moralis:sync": "moralis-admin-cli connect-local-devchain --chain hardhat --moralisSubdomain XXXX.com --frpcPath ./frp/frpc"
    ```

    - Include CLI API key and Master Key (API SECRET KEY) inside `.env`.
    - Execute by terminal:

    ```bash
    yarn moralis:sync
    ```

4. Indicate which contract, events and what do when it hears the events.
    - Create a similar script that the one in [addEvents.js](https://github.com/JMariadlcs/nft-marketplace-frontend-moralis/blob/main/addEvents.js) and fill it with the events information (information of the events can be grab from [NftMarketplace.json](https://github.com/JMariadlcs/nft-marketplace-backend/blob/main/deployments/localhost/NftMarketplace.json)).
    - Execute just 1 TIME:
    ```bash
    node addEvents.js
    ```

Refresh Moralis Database and **SUCCESS, EVENTS ADDED** ✅.

-> Now you can exeucte scripts for example [mint-and-list](https://github.com/JMariadlcs/nft-marketplace-backend/blob/main/scripts/mint-and-list.js) and check if database listen for the events emited.

    ```bash
    yarn hardhat run scripts/mint-and-list.js --network localhost
    ```

**🚨SUPER IMPORTANT**: everytime you stop and start again you local hardhat node you must RESET LOCAL CHAIN (moralis Server) for it to continue listening events correctly. You should also delete manually database entries on Moralis Database if you are running local blockchain because if you start a new one the past entries are still appearing.

### USE CLOUD FUNCTIONS

Cloud Functions are used to, for example, update Moralis Database table. Functions found on [cloudFunctions](https://github.com/PatrickAlphaC/nextjs-nft-marketplace-moralis-fcc/blob/main/cloudFunctions/updateActiveItems.js) script under `cloudFunctions`folder.

-   Install moralis admin cli:

```bash
sudo npm install -g moralis-admin-cli
```

-   Create [cloudFunctions](https://github.com/PatrickAlphaC/nextjs-nft-marketplace-moralis-fcc/blob/main/cloudFunctions/updateActiveItems.js) script under `cloudFunctions`folder.

-   Go to [package.json](https://github.com/JMariadlcs/nft-marketplace-frontend-moralis/blob/main/package.json) and under scripts include:

    ```bash
    "moralis:cloud": "moralis-admin-cli watch-cloud-folder --moralisSubdomain XXX.com --autoSave 1 --moralisCloudfolder ./cloudFunctions"
    ```

-   Execute by terminal:

    ```bash
    yarn moralis:cloud
    ```

You will see:

```bash
ncc: Version 0.29.2
ncc: Compiling file index.js into CJS
Changes Uploaded Correctly
```

Close it when you have already the functions udpated! -> only start it when you want to update the functions inside [updateActiveItems.js](https://github.com/JMariadlcs/nft-marketplace-frontend-moralis/blob/main/cloudFunctions/updateActiveItems.js).

-   Now you can exeucte scripts for example [mint-and-list](https://github.com/JMariadlcs/nft-marketplace-backend/blob/main/scripts/mint-and-list.js) or any other script and see that databaseLogs are updated!:

    ```bash
    yarn hardhat run scripts/mint-and-list.js --network localhost
    ```

    Refresh Moralis Database and **SUCCESS** ✅. You can now check new Database table added with entries or new logs on Moralis Database, depending on what you have inside [updateActiveItems.js](https://github.com/JMariadlcs/nft-marketplace-frontend-moralis/blob/main/cloudFunctions/updateActiveItems.js).

**🚨SUPER IMPORTANT**: everytime you stop and start again you local hardhat node you must RESET LOCAL CHAIN (moralis Server) for it to continue listening events correctly. You should also delete manually database entries on Moralis Database if you are running local blockchain because if you start a new one the past entries are still appearing.
