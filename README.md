# clinic-pulse-api

## Local development

### Setup

The following tools need to be installed on your system in advance:

- `git`: `>=2`
- `nodejs`: `>=16 <17`
- `npm`: `>=8 <9`
- `docker`: `>=18.09`
- `docker-compose`: `>=1.28.6` (service profiles is not supported until version `1.28.0`)

### Install dependency

First clone the repository, then run the following commands to install the dependencies:

```shell
npm clean-install
```

**please do not use the command npm install as it might upgrade dependencies unintentionally**

### Setup database

1. Setup environment variables by coping `.env-sample` file to `.env` and fill it proper values
2. Run the PostgreSQL using docker-compose:

```shell
docker-compose --profile dev up -d [--build]
```

If you encounter problems with docker-compose, you may run:

```
$ docker-compose down [--rmi local] [--remove-orphans] [-v]
```

- `docker-compose down` will stop & remove the containers
- `--rmi local` will remove local images
- `--remove-orphans` will remove unneeded orphan containers
- `-v` will remove volumes (**WARNING: THIS WILL WIPE ALL YOUR OLD LOCAL DATABASE DATA**)

### Running the application

```shell
npm run dev
```

### Lint and formatting

We recommend that you use [Visual Studio Code](https://code.visualstudio.com/) to work on the project. We use [ESLint](https://github.com/eslint/eslint) & [Prettier](https://github.com/prettier/prettier) to keep our code consistent in terms of style and reducing defects. We recommend installing the the [ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) & [Prettier Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) as well.

Reference: [Setting up ESlint with Standard and Prettier](https://medium.com/nerd-for-tech/setting-up-eslint-with-standard-and-prettier-be245cb9fc64)

### Other Extension

- [pretty-ts-errors](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors): make TS error message readable

### Local API testing

We use [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension to test the API locally. You can find the API test scripts in `docs/scripts` folder.

### Migrations

Generate new migration file from an entity:

Automatic migration generation creates a new migration file and writes all sql queries that must be executed to update the database.
If no there were no changes generated, the command will exit with code 1.

```
$ npm run typeorm migration:generate ./migrations/{MigrationName}
```

Run migrations:

```
$ npm run typeorm migration:run
```

Reverts last executed migration:

```
$ npm run typeorm migration:revert
```
