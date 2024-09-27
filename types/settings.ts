export interface MnemeAISettings {
	secretKey: string;
	username: string;
	birthday: Date;
}

export interface SettingConfig {
	name: string;
	description: string;
	placeholder: string;
	value: string; // reference to the value in the settings object
	onChange: (value: string) => void;
}

export const DEFAULT_SETTINGS: MnemeAISettings = {
	secretKey: "my-little-secret",
	username: "my-username",
	birthday: new Date(),
};
