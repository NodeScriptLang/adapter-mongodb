# NodeScript MongoDB Adapter

Facilitates MongoDB nodes in [NodeScript](https://nodescript.dev).

## Concepts

NodeScript is good at connecting services on the Internet. However, most databases like MongoDB are only available on internal cluster networks.

In order to communicate to MongoDB from NodeScript you need to deploy the adapter application to your cluster.

```mermaid
graph LR
    subgraph Cluster
        adapter[MongoDB Adapter] -- private network --> MongoDB
    end
    subgraph NodeScript Graph
        node[MongoDB Nodes] -- public internet --> adapter
    end
```

A single adapter application is able to connect to multiple different MongoDB databases, thus typically a single adapter deployment is required to facilitate connections to all databases you need.

NodeScript MongoDB Adapter is currently available as a docker image at `ghcr.io/nodescriptlang/adapter-mongodb`.

## Configuration

NodeScript MongoDB Adapter can be configured with the following environment variables:

- **AUTH_SECRET** — authentication shared secret, used to restrict access from graphs to your adapter; graphs must include in `adapterUrl` field as follows: `https://<AUTH_SECRET>@<hostname>`

- **POOL_SIZE** (default: 5) - the maximum number of connections to establish to *each* database the adapter connects to.

- **POOL_TTL_MS** (default: 60_00) - pools created that many millis ago will be recycled (this eliminates connection leaks otherwise occurring with high-throughput scenarios)

- **CONNECT_TIMEOUT_MS** (default: 10_000) — the adapter will throw an error if the connection cannot be established within specified timeout.

- **SWEEP_INTERVAL_MS** (default: 30_000) — the interval at which pools are checked for TTL and closed.

## Resource Requests & Limits

MongoDB Adapter acts as a thin proxy between HTTP and MongoDB driver. When it comes to configuring the compute resources it's best to keep the following in mind:

- There is no heavy processing on the adapter side, so in a typical case the pod should be fine wuth requesting around 0.1 vCPU. Throttling CPU is not recommended.

- The memory requirements largely depends on the payloads being sent and received. The adapter will fully buffer the responses from the database before sending them as JSON. If you don't have a solid idea about the size of the payloads, then start with requesting 400MB memory and monitor the application to see if the adjustments are necessary.

- The memory limit should be set to roughly x2 — x4 range of the requested amount, especially if the load is uneven.

- The adapter is built to be scaled horizontally. For serving many concurrent requests it is recommended to increase replicas count as opposed to increasing the pool size and corresponding resource requests/limits.

## Observability

NodeScript MongoDB Adapter exposes the following Prometheus metrics on `/metrics` endpoint:

- `nodescript_mongodb_adapter_connections` — counters depicting connection pool operations, further narrowed down by the `type` label:

    - `connect` — the connection successfully established, but no connection added to the pool just yet
    - `connectionCreated` — a new connection is added to the pool
    - `connectionClosed` — the pool recycles unused connection
    - `fail` — connection failed

- `nodescript_mongodb_adapter_latency` — histogram with response latencies, includes the following labels:

    - `method` — one of the endpoint methods (e.g. `findOne`, `updateOne`, `updateMany`, etc.)
    - `error` — the error code, omitted if the response was successful


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
