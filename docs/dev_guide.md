## Running locally

Install with `npm i` then run with `npm run dev`. Ensure you have MongoDb running with a database and collection(s) configured.

Make requests to http://localhost:8183/Mongo/<endpoint>. Refer to the schemas in /protocol for further information on the requirements for each request.

### Load Nodes into Nodescript

1. Ensure you have a `.env` file in the `nodes` directory of this repo, with the following variables:

```
    NODESCRIPT_API_URL=http://localhost:32001
    NODESCRIPT_API_TOKEN=
    NODESCRIPT_WORKSPACE_ID=
```

2. If not already cloned, in a different directory clone [Nodescript](https://github.com/ubio/nodescript-platform) repo and follow the instructions in the documentation to get it running locally.

3. Sign into NodeScript and create a new workspace. Copy the Workspace Id from the URL into `NODESCRIPT_WORKSPACE_ID` in `.env`.

4. Create an access token:

    - go to `http://localhost:8082/user/tokens`
    - generate a new token
    - copy the token and paste it into the `NODESCRIPT_API_TOKEN` in `.env` file you created above


5. With `.env` filled, run `npm run publish:nodes`. Make sure the logs list the published nodes.

6. Open (or reload) any graph locally and confirm that the adapter-sql nodes are now available.

**NOTE** - To actually use the nodes in nodescript, you will need to be running this adapter server locally or have a link to a deployed instance of it.
