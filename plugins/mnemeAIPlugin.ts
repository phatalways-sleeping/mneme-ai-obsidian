import { Plugin } from "obsidian";
import { MnemeAISettingsTab } from "settings/mnemeAISettingsTab";
import { DEFAULT_SETTINGS, MnemeAISettings } from "types/settings";

export class MnemeAIPlugin extends Plugin {
	settings: MnemeAISettings;

	async onload() {
		await this.loadSettings();

		// Config Settings Tab
		this.addSettingTab(new MnemeAISettingsTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
