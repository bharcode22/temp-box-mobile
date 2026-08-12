import RNFS from 'react-native-fs';

export interface AppConfig {
  vpsUrl: string;
  apiKey: string;
}

export const getConfigPath = () => `${RNFS.DocumentDirectoryPath}/config.json`;

export const loadSavedConfig = async (): Promise<AppConfig | null> => {
  try {
    const path = getConfigPath();
    const fileExists = await RNFS.exists(path);
    if (fileExists) {
      const content = await RNFS.readFile(path, 'utf8');
      const parsed = JSON.parse(content);
      return {
        vpsUrl: parsed.vpsUrl || '',
        apiKey: parsed.apiKey || '',
      };
    }
  } catch (err: any) {
    console.error('❌ Gagal membaca konfigurasi:', err.message);
  }
  return null;
};

export const saveConfig = async (vpsUrl: string, apiKey: string): Promise<boolean> => {
  try {
    const config: AppConfig = { vpsUrl, apiKey };
    await RNFS.writeFile(getConfigPath(), JSON.stringify(config), 'utf8');
    return true;
  } catch (err: any) {
    console.error('❌ Gagal menyimpan konfigurasi:', err.message);
    return false;
  }
};
