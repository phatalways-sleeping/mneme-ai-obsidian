import { Plugin } from 'typings';
import { PluginSettings, DEFAULT_SETTINGS } from './settings/settings';
import { ServerController } from './server/controller';
import { MnemeAiServerPluginSettingsTab } from './settings/settingsTab';

export default class MnemeServerPlugin extends Plugin {
  public settings!: PluginSettings;

  serverController?: ServerController;

  async onload() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

    this.app.workspace.onLayoutReady(async () => {

      this.addSettingTab(new MnemeAiServerPluginSettingsTab(this.app, this));

      this.serverController = new ServerController(this);

      if (this.settings.startOnLoad) {
        await this.startServer();
      } else {
        this.app.workspace.trigger('mneme-ai-event', {
          isServerRunning: false,
        });
      }

      this.addCommand({
        id: 'start-server',
        name: 'Start the Web Server',
        checkCallback: (checking) => {
          if (checking) {
            return !this.serverController?.isRunning();
          }
          this.startServer();
        },
      });

      this.addCommand({
        id: 'stop-server',
        name: 'Stop the Web Server',
        checkCallback: (checking) => {
          if (checking) {
            return !!this.serverController?.isRunning();
          }
          this.stopServer();
        },
      });
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
      this.app.workspace.trigger('mneme-ai-event', {
        isServerRunning: true,
      });
    }
    return !!this.serverController?.isRunning();
  }

  async stopServer() {
    await this.serverController?.stop();
    this.app.workspace.trigger('mneme-ai-event', { isServerRunning: false });
    return !this.serverController?.isRunning();
  }
}
