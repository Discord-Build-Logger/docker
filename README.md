# Discord Build Logger

# Installation

```shell
git clone git@github.com:Discord-Build-Logger/docker.git --recurse-submodules
```

## Configuration

- Set the `POSTGRES_` variables in the `.env` file.
- Configure `API_PORT`. This should listen on localhost.
- If you have an api for getting builds by ID, put the `URL` and `AUTH` token in `INTERNAL_BUILD_GRABBER_URL` and `INTERNAL_BUILD_GRABBER_AUTH` respectively.

> Note that the API will not be able to execute build scrapes if the build grabber url and auth is not configured.

> The URL takes two parameters, `hash` (the build id), and `auth`, the authentication token. If your endpoint doesn't require auth, just put some random value.

## Running

Run the program with Docker Compose.

```
docker compose up [-d]