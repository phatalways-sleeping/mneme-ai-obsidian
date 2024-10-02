export type PluginSettings = {
	port: number;
	hostname: string;
	startOnLoad: boolean;
};

export const DEFAULT_SETTINGS: PluginSettings = {
	port: 8080,
	hostname: "127.0.0.1",
	startOnLoad: true,
};
