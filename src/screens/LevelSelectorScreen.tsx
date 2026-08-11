import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StatusBar, Text, TouchableOpacity, StyleSheet, Modal, Alert, PermissionsAndroid, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { Header } from '../components/Header';
import { Trophy, Lock, CheckCircle2, PlayCircle, Download, FileText } from 'lucide-react-native';
import ViewShot, { ViewShotRef } from 'react-native-view-shot';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { styles as globalStyles } from '../styles/App.styles';
import { loadGameProgress, saveGameProgress, GameProgress } from '../services/gameService';
import levelsData from '../data/levels.json';

interface LevelConfig {
  id: number;
  batch: number;
  batchTitle: string;
  type: string;
  target: string;
  blocks: string[];
}

interface LevelSelectorScreenProps {
  navigation: any;
}

export const LevelSelectorScreen: React.FC<LevelSelectorScreenProps> = ({ navigation }) => {
  const [progress, setProgress] = useState<GameProgress>({ currentLevel: 1, unlockedLevels: [1], completedLevels: [] });
  const isFocused = useIsFocused();

  // State untuk melacak batch yang sedang diunduh
  const [downloadingBatch, setDownloadingBatch] = useState<{ id: number; title: string; text: string } | null>(null);

  // Ref untuk menangkap gambar ViewShot
  const viewShotRef = useRef<ViewShotRef>(null);

  // Muat progress level setiap kali screen ini difokuskan
  useEffect(() => {
    if (isFocused) {
      const fetchProgress = async () => {
        const savedProgress = await loadGameProgress();
        setProgress(savedProgress);
      };
      fetchProgress();
    }
  }, [isFocused]);

  // Logika memilih level untuk dimainkan
  const handleSelectLevel = async (levelId: number) => {
    const updatedProgress = {
      ...progress,
      currentLevel: levelId,
    };
    setProgress(updatedProgress);
    await saveGameProgress(updatedProgress);
    navigation.navigate('Game');
  };

  // Helper untuk memeriksa dan meminta izin penyimpanan Android
  const checkAndroidStoragePermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;

    try {
      const version = Number(Platform.Version);
      if (version >= 33) {
        const hasReadMedia = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
        if (hasReadMedia) return true;

        const request = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
        return request === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const hasWrite = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (hasWrite) return true;

        const request = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        return request === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn('❌ Gagal memeriksa izin:', err);
      return false;
    }
  };

  // Fungsi mengunduh (menyimpan) berkas Batch sebagai gambar
  const handleSaveBatchImage = async () => {
    if (!viewShotRef.current) return;

    try {
      const hasPermission = await checkAndroidStoragePermission();
      if (!hasPermission) {
        Alert.alert(
          'Izin Ditolak',
          'Dibutuhkan izin akses media penyimpanan untuk mengunduh gambar paragraf.'
        );
        return;
      }

      const tempUri = await viewShotRef.current.capture();
      await CameraRoll.saveAsset(tempUri, { type: 'photo', album: 'WordPuzzleGame' });

      Alert.alert(
        'Berhasil Diunduh',
        'Satu paragraf diary utuh dari batch ini telah disimpan sebagai gambar di galeri foto Anda!'
      );
      setDownloadingBatch(null);
    } catch (err: any) {
      console.error('❌ Gagal mengunduh gambar batch:', err.message);
      Alert.alert('Gagal Mengunduh', err.message || 'Terjadi kesalahan sistem.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#2A0825' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor="#2A0825" />
        <Header title="Levels" subtitle="Pilih Level Puzzle" Icon={Trophy} />

        <ScrollView style={globalStyles.container}>
          {(() => {
            // Group levels by batch
            const batches = (levelsData as LevelConfig[]).reduce((acc, level) => {
              const existing = acc.find(b => b.id === level.batch);
              if (existing) {
                existing.levels.push(level);
              } else {
                acc.push({
                  id: level.batch,
                  title: level.batchTitle,
                  levels: [level]
                });
              }
              return acc;
            }, [] as Array<{ id: number; title: string; levels: LevelConfig[] }>);

            return batches.map((batch) => {
              const isBatchCompleted = batch.levels.every(l => progress.completedLevels?.includes(l.id));

              return (
                <View key={batch.id} style={localStyles.batchCard}>
                  <View style={localStyles.batchHeaderRow}>
                    <Text style={localStyles.batchTitleText}>{batch.title}</Text>
                    {isBatchCompleted ? (
                      <TouchableOpacity
                        style={localStyles.downloadBatchButton}
                        onPress={() => {
                          const fullText = batch.levels.map(l => l.target).join(' ');
                          setDownloadingBatch({
                            id: batch.id,
                            title: batch.title,
                            text: fullText
                          });
                        }}
                      >
                        <Download color="#FFF385" size={14} />
                        <Text style={localStyles.downloadButtonText}>Unduh Paragraf</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={[localStyles.downloadBatchButton, { opacity: 0.4 }]}>
                        <Lock color="#666" size={12} />
                        <Text style={[localStyles.downloadButtonText, { color: '#666' }]}>Terkunci</Text>
                      </View>
                    )}
                  </View>
                  <View style={localStyles.batchDivider} />

                  <View style={localStyles.listContainer}>
                    {batch.levels.map((level) => {
                      const isCompleted = progress.completedLevels?.includes(level.id) || false;
                      const isActive = level.id === progress.currentLevel;
                      const isLocked = !progress.unlockedLevels?.includes(level.id);

                      return (
                        <View
                          key={level.id}
                          style={[
                            localStyles.levelItem,
                            isCompleted && localStyles.completedItem,
                            isActive && localStyles.activeItem,
                            isLocked && localStyles.lockedItem,
                          ]}
                        >
                          <View style={localStyles.levelInfo}>
                            <View style={localStyles.iconContainer}>
                              {isCompleted && <CheckCircle2 color="#FF5E97" size={24} />}
                              {isActive && <PlayCircle color="#FFF385" size={24} />}
                              {isLocked && <Lock color="#666" size={24} />}
                            </View>

                            <View style={localStyles.textContainer}>
                              <Text
                                style={[
                                  localStyles.levelTitle,
                                  isLocked && { color: '#666' }
                                ]}
                              >
                                Level {level.id}
                              </Text>
                              <Text style={localStyles.levelType}>
                                {level.type === 'susun_kalimat' ? 'Susun Kalimat' : 'Susun Kata'}
                              </Text>

                              {/* Tampilkan pesan status berdasarkan pencapaian */}
                              {isCompleted && (
                                <Text style={localStyles.statusCompletedText}>Selesai</Text>
                              )}
                              {isActive && (
                                <Text style={localStyles.statusActiveText}>Sedang Dimainkan</Text>
                              )}
                              {isLocked && (
                                <Text style={localStyles.statusLockedText}>Terkunci</Text>
                              )}
                            </View>
                          </View>

                          {/* Tombol aksi bermain / replay */}
                          {!isLocked && (
                            <TouchableOpacity
                              style={[
                                localStyles.playButton,
                                isCompleted ? localStyles.replayButtonBg : localStyles.activeButtonBg
                              ]}
                              onPress={() => handleSelectLevel(level.id)}
                            >
                              <Text style={localStyles.playButtonText}>
                                {isCompleted ? 'Main Lagi' : 'Mainkan'}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            });
          })()}

          {/* Spacer */}
          <View style={{ height: 30 }} />
        </ScrollView>

        {/* Modal Download Batch Paragraf */}
        {downloadingBatch && (
          <Modal
            visible={!!downloadingBatch}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setDownloadingBatch(null)}
          >
            <View style={localStyles.modalContainer}>
              {/* Card visual yang disembunyikan off-screen (untuk di-capture oleh ViewShot berisi teks asli) */}
              <View style={{ position: 'absolute', left: -9999, width: Dimensions.get('window').width - 48 }}>
                <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.95 }} style={{ width: '100%' }}>
                  <View style={localStyles.diaryCard}>
                    <View style={localStyles.diaryBadgeContainer}>
                      <FileText color="#FF5E97" size={32} />
                      <Text style={localStyles.diaryBadgeTitle}>BHAR OVT DIARY</Text>
                      <Text style={localStyles.diaryBadgeSubtitle}>{downloadingBatch.title}</Text>
                    </View>

                    <View style={localStyles.quoteDecorationLeft}>
                      <Text style={localStyles.quoteMark}>“</Text>
                    </View>

                    <Text style={localStyles.diaryText}>
                      {downloadingBatch.text}
                    </Text>

                    <View style={localStyles.quoteDecorationRight}>
                      <Text style={localStyles.quoteMark}>”</Text>
                    </View>

                    <View style={localStyles.diaryFooter}>
                      <Text style={localStyles.diaryFooterText}>Terbuka setelah menyelesaikan semua level pada Batch {downloadingBatch.id}</Text>
                      <Text style={[localStyles.diaryFooterText, { marginTop: 2 }]}>Word Puzzle Game</Text>
                    </View>
                  </View>
                </ViewShot>
              </View>

              {/* Card visual preview yang tampil di screen modal (tanpa preview paragraf asli) */}
              <View style={[localStyles.diaryCard, { width: '100%' }]}>
                <View style={localStyles.diaryBadgeContainer}>
                  <FileText color="#FF5E97" size={32} />
                  <Text style={localStyles.diaryBadgeTitle}>BHAR OVT DIARY</Text>
                  <Text style={localStyles.diaryBadgeSubtitle}>{downloadingBatch.title}</Text>
                </View>

                <View style={localStyles.quoteDecorationLeft}>
                  <Text style={localStyles.quoteMark}>“</Text>
                </View>

                <Text style={[localStyles.diaryText, { color: '#FFF385', fontWeight: 'bold' }]}>
                  Unduh paragraf ini untuk mendapatkan full paragraf
                </Text>

                <View style={localStyles.quoteDecorationRight}>
                  <Text style={localStyles.quoteMark}>”</Text>
                </View>

                <View style={localStyles.diaryFooter}>
                  <Text style={localStyles.diaryFooterText}>Terbuka setelah menyelesaikan semua level pada Batch {downloadingBatch.id}</Text>
                  <Text style={[localStyles.diaryFooterText, { marginTop: 2 }]}>Word Puzzle Game</Text>
                </View>
              </View>

              {/* Tombol Tindakan */}
              <View style={localStyles.modalActions}>
                <TouchableOpacity
                  style={[localStyles.modalButton, { backgroundColor: '#4A1542', borderColor: '#FF5E97', borderWidth: 1 }]}
                  onPress={() => setDownloadingBatch(null)}
                >
                  <Text style={[localStyles.modalButtonText, { color: '#FF5E97' }]}>Tutup</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[localStyles.modalButton, { backgroundColor: '#FF5E97' }]}
                  onPress={handleSaveBatchImage}
                >
                  <Download color="#2A0825" size={18} style={{ marginRight: 8 }} />
                  <Text style={[localStyles.modalButtonText, { color: '#2A0825' }]}>Simpan Gambar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </SafeAreaView>
    </View>
  );
};

const localStyles = StyleSheet.create({
  batchCard: {
    backgroundColor: 'rgba(74, 21, 66, 0.3)',
    borderColor: '#4A1542',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  batchHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  downloadBatchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A0825',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#4A1542',
  },
  downloadButtonText: {
    color: '#FFF385',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(26, 6, 37, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  diaryCard: {
    backgroundColor: '#4A1542',
    borderColor: '#FF5E97',
    borderWidth: 2,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#FF5E97',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    width: '100%',
  },
  diaryBadgeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  diaryBadgeTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FF5E97',
    letterSpacing: 1.5,
    marginTop: 8,
  },
  diaryBadgeSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF385',
    marginTop: 2,
  },
  diaryText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFEBF3',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
    marginVertical: 12,
    paddingHorizontal: 8,
  },
  quoteDecorationLeft: {
    alignSelf: 'flex-start',
    height: 10,
  },
  quoteDecorationRight: {
    alignSelf: 'flex-end',
    height: 10,
  },
  quoteMark: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF5E97',
    opacity: 0.5,
    lineHeight: 36,
  },
  diaryFooter: {
    marginTop: 20,
    borderTopColor: '#2A0825',
    borderTopWidth: 1,
    width: '100%',
    paddingTop: 10,
    alignItems: 'center',
  },
  diaryFooterText: {
    fontSize: 9,
    color: '#FFF385',
    opacity: 0.6,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalButtonText: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  batchTitleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FF5E97',
    letterSpacing: 0.5,
  },
  batchDivider: {
    height: 1,
    backgroundColor: '#4A1542',
    marginVertical: 12,
  },
  listContainer: {
    marginVertical: 0,
  },
  levelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4A1542',
    borderWidth: 1,
    borderColor: '#4A1542',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  completedItem: {
    borderColor: '#FF5E97',
  },
  activeItem: {
    borderColor: '#FFF385',
  },
  lockedItem: {
    backgroundColor: 'rgba(74, 21, 66, 0.4)',
    borderColor: 'transparent',
    shadowOpacity: 0.05,
    elevation: 1,
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFEBF3',
  },
  levelType: {
    fontSize: 11,
    color: '#FFF385',
    opacity: 0.8,
    marginTop: 2,
  },
  statusCompletedText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FF5E97',
    marginTop: 4,
  },
  statusActiveText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFF385',
    marginTop: 4,
  },
  statusLockedText: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  playButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButtonBg: {
    backgroundColor: '#FF5E97',
  },
  replayButtonBg: {
    backgroundColor: '#4A1542',
    borderColor: '#FF5E97',
    borderWidth: 1,
  },
  playButtonText: {
    color: '#FFEBF3',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
