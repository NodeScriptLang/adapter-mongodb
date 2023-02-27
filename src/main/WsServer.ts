import { HttpServer } from '@nodescript/http-server';
import { Logger } from '@nodescript/logger';
import { IncomingMessage } from 'http';
import { config } from 'mesh-config';
import { dep, Mesh } from 'mesh-ioc';
import { WebSocket, WebSocketServer } from 'ws';

import { WsHandler } from './session/WsHandler.js';

export class WsServer {

    @config({ default: '/ws' }) WS_PREFIX!: string;

    @dep() private httpServer!: HttpServer;
    @dep() private logger!: Logger;
    @dep({ key: 'webSocketScope' })
    private createMesh!: () => Mesh;

    private wss: WebSocketServer | null = null;

    async start() {
        if (this.wss) {
            return;
        }
        const server = this.httpServer.getServer();
        if (!server) {
            throw new Error('WsServer should start after HttpServer');
        }
        this.wss = new WebSocketServer({
            server,
            path: this.WS_PREFIX,
        });
        this.wss.on('connection', (ws, req) => this.onConnection(ws, req));
        this.wss.on('listening', () => {
            this.logger.info('WsServer listening');
        });
    }

    async stop() {
        if (this.wss) {
            this.wss.close();
        }
        this.wss = null;
        this.logger.info('WsServer stopped');
    }

    protected onConnection(ws: WebSocket, req: IncomingMessage) {
        const mesh = this.createMesh();
        mesh.constant('ws', ws);
        mesh.constant('wsHeaders', req.headers);
        mesh.resolve(WsHandler).init();
    }
}
