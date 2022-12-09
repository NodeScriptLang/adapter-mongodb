import { MongoProtocol, mongoProtocol } from '@nodescript/adapter-mongodb-protocol';
import { Logger } from '@nodescript/logger';
import { dep } from '@nodescript/mesh';
import { RpcEvent, RpcHandler, RpcMethodResponse } from '@nodescript/protocomm';
import { WebSocket } from 'ws';

import { MongoProtocolImpl } from './MongoProtocolImpl.js';
import { SessionContext } from './SessionContext.js';

export class WsHandler {

    @dep({ key: 'ws' }) private ws!: WebSocket;
    @dep() private logger!: Logger;
    @dep() private protocolImpl!: MongoProtocolImpl;
    @dep() private sessionContext!: SessionContext;

    private handler: RpcHandler<MongoProtocol>;

    constructor() {
        this.handler = new RpcHandler(
            mongoProtocol,
            this.protocolImpl,
            res => this.sendResponse(res),
            evt => this.sendEvent(evt));
    }

    async init() {
        try {
            this.ws.on('message', data => this.onWsMessage(data.toString()));
            this.ws.on('close', () => this.onWsClose());
            this.logger.info('New WS session');
        } catch (error) {
            this.logger.error('Session init failed', { error });
            this.ws.close();
        }
    }

    private sendResponse(res: RpcMethodResponse) {
        const msg = JSON.stringify(res);
        this.logger.debug(`<<< ${msg}`);
        this.ws.send(msg);
    }

    private sendEvent(evt: RpcEvent) {
        const msg = JSON.stringify(evt);
        this.logger.debug(`*** ${msg}`);
        this.ws.send(msg);
    }

    private onWsMessage(msg: string) {
        this.logger.debug(`>>> ${msg}`);
        this.handler.processMessage(msg);
    }

    private async onWsClose() {
        try {
            await this.sessionContext.destroy();
            this.logger.info('WS connection closed');
        } catch (error) {
            this.logger.warn('WS cleanup failed', { error });
        }
    }

}
