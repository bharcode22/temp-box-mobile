import RNFS from 'react-native-fs';

export interface GameProgress {
  currentLevel: number;
  unlockedLevels: number[];
  completedLevels: number[];
}

export const getProgressFilePath = () => `${RNFS.DocumentDirectoryPath}/game_progress.json`;

export const loadGameProgress = async (): Promise<GameProgress> => {
  try {
    const path = getProgressFilePath();
    const fileExists = await RNFS.exists(path);
    if (fileExists) {
      const content = await RNFS.readFile(path, 'utf8');
      const parsed = JSON.parse(content);
      return {
        currentLevel: parsed.currentLevel || 1,
        unlockedLevels: parsed.unlockedLevels || [1],
        completedLevels: parsed.completedLevels || [],
      };
    }
  } catch (err: any) {
    console.error('❌ Gagal membaca progres game:', err.message);
  }
  // Default progress
  return {
    currentLevel: 1,
    unlockedLevels: [1],
    completedLevels: [],
  };
};

export const saveGameProgress = async (progress: GameProgress): Promise<boolean> => {
  try {
    const path = getProgressFilePath();
    await RNFS.writeFile(path, JSON.stringify(progress), 'utf8');
    return true;
  } catch (err: any) {
    console.error('❌ Gagal menyimpan progres game:', err.message);
    return false;
  }
};
