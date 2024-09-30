import express, { Application } from "express";
import { IncomingMessage, Server, ServerResponse } from "http";
import { handleHealthCheck, handlePostRequest } from "./server.handler";
import MnemeAIPlugin from "main";

export class MnemeAIController {
	inner: Application;
	server?: Server<typeof IncomingMessage, typeof ServerResponse>;

	constructor(private plugin: MnemeAIPlugin) {
		this.inner = express();
		this.plugin = plugin;

		// middleware
		this.inner.use(express.json());
		this.inner.use(express.urlencoded({ extended: true }));


		// routes
		this.inner.get("/health", handleHealthCheck);
		this.inner.get("/canvas", handleHealthCheck);
		this.inner.post("/canvas", handlePostRequest);
	}

	async start() {
		if (!this.server || !this.server.listening) {
			this.server = await new Promise<
				| Server<typeof IncomingMessage, typeof ServerResponse>
				| undefined
			>((resolve) => {
				try {
					if (this.server?.listening) return resolve(this.server);
					const server = this.inner.listen(
						this.plugin.settings.port,
						this.plugin.settings.host,
						() => {
							resolve(server);
						}
					);
				} catch (error) {
					console.error("error trying to start the server", error);
					resolve(undefined);
				}
			});
		}
	}

	async stop() {
		if (this.server && this.server.listening) {
			await new Promise<void>((resolve) => {
				this.server?.close((err) => {
					err && console.error(err);
					resolve();
				});
			});
		}
	}

	async reload() {
		if (!this.isRunning()) return;
		await this.stop();
		await this.start();
	}

	isRunning() {
		return this.server?.listening;
	}
}
