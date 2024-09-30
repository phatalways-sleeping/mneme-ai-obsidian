import MnemeAIPlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";
import { SettingConfig } from "types/settings";

export class MnemeAISettingsTab extends PluginSettingTab {
	plugin: MnemeAIPlugin;
	settings: SettingConfig[];

	constructor(app: App, plugin: MnemeAIPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.settings = [
			{
				name: "Host",
				description: "The hostname of the MnemeAI server",
				placeholder: "localhost",
				value: this.plugin.settings.host,
				onChange: async (value) => {
					this.plugin.settings.host = value;
					await this.plugin.saveSettings();
				},
			},
			{
				name: "Port",
				description: "The port of the MnemeAI server",
				placeholder: "3000",
				value: this.plugin.settings.port.toString(),
				onChange: async (value) => {
					this.plugin.settings.port = parseInt(value);
					await this.plugin.saveSettings();
				},
			},
		];
	}

	display(): void {
		const { containerEl } = this;

		containerEl.createEl("h2", { text: "MnemeAI Settings" });

		const builder = new SettingBuilder(containerEl);

		this.settings.forEach((setting) => {
			builder.create(setting);
		});
	}
}

class SettingBuilder {
	containerEl: HTMLElement;

	constructor(containerEl: HTMLElement) {
		this.containerEl = containerEl;
	}

	create(obj: SettingConfig) {
		return new Setting(this.containerEl)
			.setName(obj.name)
			.setDesc(obj.description)
			.addText((text) =>
				text
					.setPlaceholder(obj.placeholder)
					.setValue(obj.value)
					.onChange(obj.onChange)
			);
	}
}
