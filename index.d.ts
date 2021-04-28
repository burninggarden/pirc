/* eslint-disable camelcase */

declare module 'pirc' {
	interface ServerConfig {
		readonly name?: string;
		readonly port?: number;
		readonly motd?: string;
		readonly hostname?: string;
		readonly channel_modes?: string;
		readonly log_incoming_messages?: boolean;
		readonly log_outgoing_messages?: boolean;
	}

	export interface ConnectionConfig {
		readonly hostname: string;
		readonly port: number;
		readonly nick: string;
		readonly username: string;
		readonly realname: string;
	}

	class Channel {
		public getTopic(): string;
	}

	export class Message {
		public getBody(): string;
		public getNick(): string;
		public hasChannel(): boolean;
		public getChannel(): Channel;
		public getChannelName(): string;
	}

	interface ConnectCallback {
		(error: Error | null): void;
	}

	interface DestroyCallback {
		(error: Error | null): void;
	}

	interface MessageCallback {
		(message: Message): void;
	}

	interface TopicCallback {
		(error: Error | null): void;
	}

	export class Server {
		public constructor(config: ServerConfig);
		public listen(port?: number): void;
	}

	export class Client {
		public connectToServer(
			config: ConnectionConfig,
			callback: ConnectCallback
		): void;

		public on(event: 'message', callback: MessageCallback): void;
		public destroy(callback: DestroyCallback): void;
		public joinChannel(channel: string): void;
		public sendMessageToChannel(body: string, channel: string): void;
		public sendMessageToNick(body: string, nick: string): void;
		public setTopicForChannel(topic: string, channel: string): void;
	}
}
