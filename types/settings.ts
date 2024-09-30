export interface MnemeAISettings {
	host: string;
	port: number;
}

export interface SettingConfig {
	name: string;
	description: string;
	placeholder: string;
	value: string; // reference to the value in the settings object
	onChange: (value: string) => void;
}

export const DEFAULT_SETTINGS: MnemeAISettings = {
	host: "127.0.0.1",
	port: 3000,
};
