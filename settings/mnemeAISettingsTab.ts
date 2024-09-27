import { App, PluginSettingTab, Setting } from "obsidian";
import { MnemeAIPlugin } from "plugins/mnemeAIPlugin";
import { SettingConfig } from "types/settings";

export class MnemeAISettingsTab extends PluginSettingTab {
	plugin: MnemeAIPlugin;
	settings: SettingConfig[];

	constructor(app: App, plugin: MnemeAIPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.settings = [
			{
				name: "Secrets",
				description: "Secrets for MnemeAI",
				placeholder: "Enter your secrets here",
				value: this.plugin.settings.secretKey,
				onChange: async (value) => {
					this.plugin.settings.secretKey = value;
					await this.plugin.saveSettings();
				},
			},
		];
	}

	display(): void {
		let { containerEl } = this;

		containerEl.createEl("h2", { text: "MnemeAI Settings" });

		let builder = new SettingBuilder(containerEl);

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
