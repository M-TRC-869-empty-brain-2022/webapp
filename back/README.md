# webapp backend

## database
get a postgres database running
```sh
docker run --name db-secu -p 5432:5432 \
    -e POSTGRES_USER=user \
    -e POSTGRES_PASSWORD=pwd \
    -e POSTGRES_DB=secu \
    postgres:12-alpine
```

## backend env
```sh
cp .env.example .env  # duplicate `.env.example` to `.env`
```
### change its content
- add a real jwt secret to it.  
- change the database credentials to match your database.

## run
```sh
yarn      # install dependencies
yarn dev  # run the server with hot reload
```