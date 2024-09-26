import { App, PluginSettingTab, Setting } from "obsidian";
import { MnemeAIPlugin } from "plugins/mnemeAIPlugin";

export class MnemeAISettingsTab extends PluginSettingTab {
	plugin: MnemeAIPlugin;

	constructor(app: App, plugin: MnemeAIPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.secrets)
				.onChange(async (value) => {
					this.plugin.settings.secrets = value;
					await this.plugin.saveSettings();
				}));
	}
}
