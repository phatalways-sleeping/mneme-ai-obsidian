import { App, PluginSettingTab, Setting } from "typings";
import MnemeAiServerPlugin from "../main";

export class MnemeAiServerPluginSettingsTab extends PluginSettingTab {
	constructor(app: App, private plugin: MnemeAiServerPlugin) {
		super(app, plugin);
	}

	async saveAndReload() {
		await this.plugin.saveSettings();
		const serverIsRunning = !!this.plugin.serverController?.isRunning();
		if (serverIsRunning) {
			await this.plugin.stopServer();
			await this.plugin.startServer();
		}
	}

	display() {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", {
			text: `${this.plugin.manifest.name} ${this.plugin.manifest.version}`,
		});

		new Setting(containerEl)
			.setName("Start Server automatically.")
			.setTooltip("Default: False")
			.setDesc(
				"If true the server will start inmediately after loading the plugin."
			)
			.addToggle((cb) => {
				cb.setValue(this.plugin.settings.startOnLoad);
				cb.onChange(async (value) => {
					this.plugin.settings.startOnLoad = value;
					await this.saveAndReload();
				});
			});

		new Setting(containerEl)
			.setName("Hostname")
			.setTooltip("Default: localhost")
			.addText((text) => {
				text.setValue(this.plugin.settings.hostname);
				text.onChange(async (value) => {
					this.plugin.settings.hostname = value;
					await this.saveAndReload();
				});
			});

		new Setting(containerEl)
			.setName("Port")
			.setTooltip("Default: 3000")
			.addText((text) => {
				text.setValue(this.plugin.settings.port.toString());
				text.onChange(async (value) => {
					this.plugin.settings.port = parseInt(value);
					await this.saveAndReload();
				});
			});
	}
}
