import express, { Handler } from "express";

import { IncomingMessage, Server, ServerResponse } from "http";
import MnemeServerPlugin from "../main";

export class ServerController {
	app: express.Application;
	server?: Server<typeof IncomingMessage, typeof ServerResponse>;

	constructor(private plugin: MnemeServerPlugin) {
		this.app = express();

		this.app.use(express.urlencoded());

		this.app.use(express.json());

		this.app.get("/health", this.handleHealthCheck);

		this.app.get("/file/latest", this.handleGetLatestUpdate);

		this.app.post("/file/canvas", this.handlePostNewFile);

		this.app.put("/file/canvas", this.handlePutFile);
	}

	handleHealthCheck: Handler = (req, res) => {
		res.status(200).json({ status: "the server is running" });
	};

	handleGetLatestUpdate: Handler = async (req, res) => {
		// retrieve the query parameter from the request
		const { name } = req.query;

		if (!name) {
			res.status(400).json({
				status: "error",
				message: "you must provide the full path of the file",
			});
			return;
		}

		// check if the file exists
		const file = this.plugin.app.vault.getFileByPath(name as string);

		if (!file) {
			res.status(404).json({
				status: "error",
				message: "file does not exist",
			});
			return;
		}

		// read the file content
		const content = await this.plugin.app.vault.read(file);

		res.status(200).json({
			name: name,
			canvas: JSON.parse(content),
		});
	};

	handlePostNewFile: Handler = (req, res) => {
		const [success, name, canvas] = this.preprocessing(req, res);

		if (!success) return;

		// check if the file name already exists
		const file = this.plugin.app.vault.getAbstractFileByPath(name);

		if (file) {
			res.status(400).json({
				status: "error",
				message: "file already exists",
			});
			return;
		}

		this.plugin.app.vault.create(name, JSON.stringify(canvas, null, 2));

		res.status(200).json({
			message: "New file created at " + name,
		});
	};

	handlePutFile: Handler = (req, res) => {
		const [success, name, canvas] = this.preprocessing(req, res);

		if (!success) return;

		// check if the file name already exists
		const file = this.plugin.app.vault.getFileByPath(name);

		if (!file) {
			res.status(400).json({
				status: "error",
				message: "file does not exist",
			});
			return;
		}

		this.plugin.app.vault.modify(file, JSON.stringify(canvas, null, 2));

		res.status(200).json({
			message: "File updated at " + name,
		});
	};

	private preprocessing(req: express.Request, res: express.Response) {
		if (!req.body) {
			res.status(400).json({
				status: "error",
				message: "no body provided",
			});
			return [false, null, null];
		}

		// retrieve the file name and content from the request body
		const { name, canvas } = req.body;

		if (!name || !canvas) {
			res.status(400).json({
				status: "error",
				message: "missing name or canvas",
			});
			return [false, null, null];
		}

		return [true, name, canvas];
	}

	async start() {
		if (!this.server || !this.server.listening) {
			this.server = await new Promise<
				| Server<typeof IncomingMessage, typeof ServerResponse>
				| undefined
			>((resolve) => {
				try {
					if (this.server?.listening) return resolve(this.server);
					const server = this.app.listen(
						this.plugin.settings.port,
						this.plugin.settings.hostname,
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
