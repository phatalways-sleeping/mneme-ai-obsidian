import { Plugin } from "obsidian";
import { DEFAULT_SETTINGS, MnemeAISettings } from "shared/mnemeAISettings";

export class MnemeAIPlugin extends Plugin {
	settings: MnemeAISettings;

	async onload() {
		await this.loadSettings();
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
