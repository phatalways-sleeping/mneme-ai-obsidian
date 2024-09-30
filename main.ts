import { Plugin } from "obsidian";
import { MnemeAIController } from "server/server.controller";
import { MnemeAISettingsTab } from "settings/mnemeAISettingsTab";
import { DEFAULT_SETTINGS, MnemeAISettings } from "types/settings";

export default class MnemeAIPlugin extends Plugin {
	settings: MnemeAISettings;
	serverController: MnemeAIController;

	async onload() {
		this.settings = Object.assign(DEFAULT_SETTINGS, await this.loadData());

		// Config Settings Tab
		this.addSettingTab(new MnemeAISettingsTab(this.app, this));

		this.serverController = new MnemeAIController(this);

		// await this.startServer();

		this.addCommand({
			id: "start-server",
			name: "Start the Web Server",
			checkCallback: (checking) => {
				if (checking) {
					return !this.serverController?.isRunning();
				}
				this.startServer();
			},
		});

		this.addCommand({
			id: "stop-server",
			name: "Stop the Web Server",
			checkCallback: (checking) => {
				if (checking) {
					return !!this.serverController?.isRunning();
				}
				this.stopServer();
			},
		});
	}

	async onunload() {
		await this.stopServer();
	}

	async saveSettings() {
		await this.saveData(this.settings);
		await this.serverController?.reload();
	}

	async startServer() {
		await this.serverController?.start();
		if (this.serverController?.isRunning()) {
			this.app.workspace.trigger("html-server-event", {
				isServerRunning: true,
			});
		}
		return !!this.serverController?.isRunning();
	}

	async stopServer() {
		await this.serverController?.stop();
		this.app.workspace.trigger("html-server-event", {
			isServerRunning: false,
		});
		return !this.serverController?.isRunning();
	}
}
