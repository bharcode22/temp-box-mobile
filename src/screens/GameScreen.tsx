import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StatusBar, Text, TouchableOpacity, StyleSheet, Modal, Dimensions, PermissionsAndroid, Platform, Alert, Animated, PanResponder, ActivityIndicator, NativeModules } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { Header } from '../components/Header';
import { Gamepad2, RefreshCw, Award, ArrowRight, Download } from 'lucide-react-native';
import ViewShot, { ViewShotRef } from 'react-native-view-shot';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { styles as globalStyles } from '../styles/App.styles';
import { loadGameProgress, saveGameProgress } from '../services/gameService';
import { shuffleArray, validateAnswer } from '../utils/gameUtils';
import levelsData from '../data/levels.json';

interface LevelConfig {
  id: number;
  type: string; // 'susun_kalimat' | 'susun_kata'
  target: string;
  blocks: string[];
}

interface PlayBlock {
  id: string; // ID unik (misal: "0-Budi")
  text: string;
}

export const GameScreen: React.FC = () => {
  // Game States
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [levelConfig, setLevelConfig] = useState<LevelConfig | null>(null);
  const [shuffledBlocks, setShuffledBlocks] = useState<PlayBlock[]>([]);
  const [selectedBlocks, setSelectedBlocks] = useState<PlayBlock[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);



  // ViewShot Ref (digunakan pada Phase 4 untuk snapshot galeri)
  const viewShotRef = useRef<ViewShotRef>(null);

  // Refs & Layouts untuk Drag and Drop
  const canvasRef = useRef<View>(null);
  const blockRefs = useRef<{ [key: string]: View | null }>({});
  const [canvasLayout, setCanvasLayout] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  const [blockLayouts, setBlockLayouts] = useState<{ [key: string]: { x: number, y: number, width: number, height: number } }>({});

  // 1. Muat/Muat ulang progress level terakhir saat aplikasi dibuka atau difokuskan
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const initializeGame = async () => {
        setIsLoading(true);
        const progress = await loadGameProgress();
        setCurrentLevelId(progress.currentLevel);
        setIsLoading(false);
      };
      initializeGame();
    }
  }, [isFocused]);

  // 2. Setel ulang level saat level aktif berubah
  useEffect(() => {
    if (isLoading) return;

    // Cari konfigurasi level dari dataset JSON
    const config = (levelsData as LevelConfig[]).find(l => l.id === currentLevelId);

    if (config) {
      setLevelConfig(config);

      // Bungkus kata-kata asli menjadi objek PlayBlock dengan ID unik
      const initialBlocks: PlayBlock[] = config.blocks.map((text, idx) => ({
        id: `${idx}-${text}`,
        text
      }));

      // Acak potongan kata
      setShuffledBlocks(shuffleArray(initialBlocks));
      setSelectedBlocks([]);
      setIsCompleted(false);
      setShowSuccessModal(false);
    } else {
      setLevelConfig(null);
    }
  }, [currentLevelId, isLoading]);

  // 3. Logika memilih kata (tambah ke pilihan)
  const handleSelectBlock = (block: PlayBlock) => {
    if (isCompleted) return;

    // Hapus dari baki pilihan acak (shuffled) menggunakan functional update
    setShuffledBlocks(prev => prev.filter(b => b.id !== block.id));

    // Tambahkan ke baki jawaban susunan (selected) menggunakan functional update
    setSelectedBlocks(prev => {
      const newSelected = [...prev, block];

      // Lakukan validasi susunan jawaban secara real-time dengan data terbaru
      if (levelConfig) {
        const userWords = newSelected.map(b => b.text);
        const isCorrect = validateAnswer(userWords, levelConfig.target);
        if (isCorrect) {
          setIsCompleted(true);
          NativeModules.SoundModule?.playSuccessSound();

          // Simpan progress sukses secara asinkronus ke database lokal
          const saveSuccessProgress = async () => {
            const progress = await loadGameProgress();
            const completed = [...progress.completedLevels];
            if (!completed.includes(levelConfig.id)) {
              completed.push(levelConfig.id);
            }

            const nextLevelId = levelConfig.id + 1;
            const unlocked = [...progress.unlockedLevels];
            if (!unlocked.includes(nextLevelId)) {
              unlocked.push(nextLevelId);
            }

            await saveGameProgress({
              ...progress,
              unlockedLevels: unlocked,
              completedLevels: completed
            });
          };
          saveSuccessProgress();

          // Tunda sedikit untuk memberikan efek kepuasan visual sebelum modal muncul
          setTimeout(() => {
            setShowSuccessModal(true);
          }, 300);
        }
      }
      return newSelected;
    });
  };

  // 4. Logika melepas kata (kembalikan ke baki acak)
  const handleDeselectBlock = (block: PlayBlock) => {
    if (isCompleted) return;

    // Hapus dari baki jawaban susunan (selected) menggunakan functional update
    setSelectedBlocks(prev => {
      const newSelected = prev.filter(b => b.id !== block.id);

      // Jalankan validasi ulang
      if (levelConfig) {
        const userWords = newSelected.map(b => b.text);
        const isCorrect = validateAnswer(userWords, levelConfig.target);
        setIsCompleted(isCorrect);
      }
      return newSelected;
    });

    // Tambahkan kembali ke baki pilihan acak (shuffled) menggunakan functional update
    setShuffledBlocks(prev => [...prev, block]);
  };

  // Logika ketika mulai menyeret blok
  const handleDragStart = () => {
    // Ukur posisi absolut Canvas di layar saat ini
    canvasRef.current?.measureInWindow((x, y, width, height) => {
      setCanvasLayout({ x, y, width, height });
    });

    // Ukur posisi semua blok yang saat ini berada di dalam canvas
    selectedBlocks.forEach((block) => {
      blockRefs.current[block.id]?.measureInWindow((x, y, width, height) => {
        setBlockLayouts(prev => ({
          ...prev,
          [block.id]: { x, y, width, height }
        }));
      });
    });
  };

  // Logika ketika blok selesai diseret dan dilepas (dropped)
  const handleDragEnd = (block: PlayBlock, dropX: number, dropY: number) => {
    if (!canvasLayout) return;

    // 1. Cek apakah koordinat drop berada di dalam batas Canvas
    const isInsideCanvas =
      dropX >= canvasLayout.x &&
      dropX <= canvasLayout.x + canvasLayout.width &&
      dropY >= canvasLayout.y &&
      dropY <= canvasLayout.y + canvasLayout.height;

    if (!isInsideCanvas) {
      // Jika dilepas di luar area Canvas, tidak lakukan apa-apa (akan kembali ke baki asal)
      return;
    }

    // Hapus dari baki pilihan acak (shuffled) menggunakan functional update
    setShuffledBlocks(prev => prev.filter(b => b.id !== block.id));

    // Sisipkan blok ke posisi baru di selectedBlocks menggunakan functional update
    setSelectedBlocks(prev => {
      // 2. Cari indeks penyisipan terdekat berdasarkan posisi X, Y drop terhadap blok-blok di canvas
      let closestIndex = prev.length;
      let minDistance = Infinity;
      let insertBefore = true;

      prev.forEach((b, index) => {
        const layout = blockLayouts[b.id];
        if (layout) {
          const centerX = layout.x + layout.width / 2;
          const centerY = layout.y + layout.height / 2;
          const distance = Math.sqrt(
            Math.pow(dropX - centerX, 2) + Math.pow(dropY - centerY, 2)
          );

          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
            insertBefore = dropX < centerX;
          }
        }
      });

      const newSelected = [...prev];
      const insertPosition = insertBefore ? closestIndex : closestIndex + 1;
      newSelected.splice(insertPosition, 0, block);

      // 4. Lakukan validasi kalimat secara asinkronus/real-time
      if (levelConfig) {
        const userWords = newSelected.map(b => b.text);
        const isCorrect = validateAnswer(userWords, levelConfig.target);
        if (isCorrect) {
          setIsCompleted(true);
          NativeModules.SoundModule?.playSuccessSound();

          const saveSuccessProgress = async () => {
            const progress = await loadGameProgress();
            const completed = [...progress.completedLevels];
            if (!completed.includes(levelConfig.id)) {
              completed.push(levelConfig.id);
            }

            const nextLevelId = levelConfig.id + 1;
            const unlocked = [...progress.unlockedLevels];
            if (!unlocked.includes(nextLevelId)) {
              unlocked.push(nextLevelId);
            }

            await saveGameProgress({
              ...progress,
              unlockedLevels: unlocked,
              completedLevels: completed
            });
          };
          saveSuccessProgress();

          setTimeout(() => {
            setShowSuccessModal(true);
          }, 300);
        }
      }

      return newSelected;
    });
  };

  // 5. Logika menyetel ulang (reset) level aktif
  const handleResetLevel = () => {
    if (!levelConfig) return;

    const initialBlocks: PlayBlock[] = levelConfig.blocks.map((text, idx) => ({
      id: `${idx}-${text}`,
      text
    }));

    setShuffledBlocks(shuffleArray(initialBlocks));
    setSelectedBlocks([]);
    setIsCompleted(false);
  };

  // 6. Logika lanjut ke level berikutnya
  const handleNextLevel = async () => {
    setShowSuccessModal(false);
    const nextLevelId = currentLevelId + 1;

    const progress = await loadGameProgress();

    // Pastikan level berikutnya masuk daftar terbuka jika belum ada
    const unlocked = [...progress.unlockedLevels];
    if (!unlocked.includes(nextLevelId)) {
      unlocked.push(nextLevelId);
    }

    setCurrentLevelId(nextLevelId);

    // Simpan progres ke file JSON lokal menggunakan gameService
    await saveGameProgress({
      ...progress,
      currentLevel: nextLevelId,
      unlockedLevels: unlocked
    });
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
      console.warn('❌ Gagal memeriksa izin penyimpanan:', err);
      return false;
    }
  };

  // 7. Logika simpan gambar ke galeri
  const handleSaveToGallery = async () => {
    if (!viewShotRef.current) return;

    try {
      // Periksa izin penyimpanan untuk Android terlebih dahulu
      const isPermissionGranted = await checkAndroidStoragePermission();
      if (!isPermissionGranted) {
        Alert.alert(
          'Izin Ditolak',
          'Izin penyimpanan eksternal dibutuhkan untuk menyimpan gambar kutipan ke galeri.'
        );
        return;
      }

      // Capture visual quote card sebagai file temporer PNG
      const tempUri = await viewShotRef.current.capture();

      // Simpan file tersebut ke Galeri Foto menggunakan album 'WordPuzzleGame'
      await CameraRoll.saveAsset(tempUri, { type: 'photo', album: 'WordPuzzleGame' });

      Alert.alert(
        'Berhasil Disimpan',
        'Gambar kartu kutipan kata bijak telah berhasil disimpan ke galeri Anda!'
      );
    } catch (err: any) {
      console.error('❌ Gagal mengekspor gambar:', err.message);
      Alert.alert(
        'Gagal Menyimpan',
        err.message || 'Terjadi kesalahan sistem saat mencoba mengambil tangkapan layar kartu.'
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#2A0825' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor="#2A0825" />
        <Header title="Game" subtitle="Word Puzzle Game" Icon={Gamepad2} />

        <ScrollView style={globalStyles.container} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          {isLoading ? (
            <View style={globalStyles.card}>
              <Text style={globalStyles.cardTitle}>Memuat Permainan...</Text>
            </View>
          ) : levelConfig ? (
            <View style={globalStyles.card}>
              {/* Top Zone */}
              <View style={localStyles.topZone}>
                <View>
                  <Text style={localStyles.levelText}>LEVEL {levelConfig.id}</Text>
                  <Text style={localStyles.typeText}>
                    Tipe: {levelConfig.type === 'susun_kalimat' ? 'Susun Kalimat' : 'Susun Kata'}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleResetLevel} style={localStyles.iconButton}>
                  <RefreshCw color="#FFF385" size={18} />
                  <Text style={localStyles.iconButtonText}>Reset</Text>
                </TouchableOpacity>
              </View>

              <View style={globalStyles.divider} />

              {/* Middle Zone (Canvas) */}
              <Text style={localStyles.label}>Kanvas Susunan Jawaban:</Text>
              <View
                ref={canvasRef}
                onLayout={() => {
                  setTimeout(() => {
                    canvasRef.current?.measureInWindow((x, y, width, height) => {
                      setCanvasLayout({ x, y, width, height });
                    });
                  }, 100);
                }}
                style={localStyles.canvasContainer}
              >
                {selectedBlocks.length === 0 ? (
                  <Text style={localStyles.emptyText}>Ketuk atau seret pilihan kata di bawah ke sini untuk menyusun kalimat.</Text>
                ) : (
                  selectedBlocks.map((block) => (
                    <View
                      key={block.id}
                      ref={el => { blockRefs.current[block.id] = el; }}
                      onLayout={() => {
                        setTimeout(() => {
                          blockRefs.current[block.id]?.measureInWindow((x, y, width, height) => {
                            setBlockLayouts(prev => ({
                              ...prev,
                              [block.id]: { x, y, width, height }
                            }));
                          });
                        }, 100);
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => handleDeselectBlock(block)}
                        style={[localStyles.wordBlock, { backgroundColor: '#FF5E97' }]}
                      >
                        <Text style={localStyles.wordTextActive}>{block.text}</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </View>

              <View style={{ height: 10 }} />

              {/* Bottom Zone (Tray) */}
              <Text style={localStyles.label}>Pilihan Kata Acak:</Text>
              <View style={localStyles.trayContainer}>
                {shuffledBlocks.length === 0 && !isCompleted ? (
                  <Text style={localStyles.emptyText}>Semua kata telah dipilih.</Text>
                ) : (
                  shuffledBlocks.map((block) => (
                    <DraggableBlock
                      key={block.id}
                      block={block}
                      onTap={handleSelectBlock}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    />
                  ))
                )}
              </View>
            </View>
          ) : (
            <View style={globalStyles.card}>
              <Text style={[globalStyles.cardTitle, { textAlign: 'center', fontSize: 24 }]}>🎉 Selamat!</Text>
              <Text style={[globalStyles.cardDescription, { textAlign: 'center', marginVertical: 15 }]}>
                Selamat anda telah menyelesaikan game ini
              </Text>
              <TouchableOpacity
                style={globalStyles.permissionButton}
                onPress={async () => {
                  const progress = await loadGameProgress();
                  setCurrentLevelId(1);
                  await saveGameProgress({
                    ...progress,
                    currentLevel: 1
                  });
                }}
              >
                <Text style={globalStyles.buttonText}>Main Lagi Dari Level 1</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Modal Keberhasilan (Level Success Overlay) */}
        {levelConfig && (
          <Modal
            visible={showSuccessModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowSuccessModal(false)}
          >
            <View style={localStyles.modalContainer}>
              <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }} style={{ width: '100%' }}>
                {/* Desain Kartu Kutipan Elegan */}
                <View style={localStyles.quoteCard}>
                  <View style={localStyles.badgeContainer}>
                    <Award color="#FFF385" size={32} />
                    <Text style={localStyles.badgeTitle}>DEVELOPER OVT</Text>
                    <Text style={localStyles.badgeSubtitle}>Level {levelConfig.id} Selesai</Text>
                  </View>

                  <View style={localStyles.quoteDecorationLeft}>
                    <Text style={localStyles.quoteMark}>“</Text>
                  </View>

                  <Text style={localStyles.quoteText}>
                    {levelConfig.target}
                  </Text>

                  <View style={localStyles.quoteDecorationRight}>
                    <Text style={localStyles.quoteMark}>”</Text>
                  </View>

                  <View style={localStyles.quoteFooter}>
                    <Text style={localStyles.quoteFooterText}>Word Puzzle Game</Text>
                  </View>
                </View>
              </ViewShot>



              {/* Tombol Aksi Modal */}
              <View style={localStyles.modalActions}>
                <TouchableOpacity
                  style={[localStyles.modalButton, { backgroundColor: '#4A1542', borderColor: '#FF5E97', borderWidth: 1 }]}
                  onPress={handleSaveToGallery}
                >
                  <Download color="#FF5E97" size={18} style={{ marginRight: 8 }} />
                  <Text style={[globalStyles.buttonText, { color: '#FF5E97' }]}>Simpan Gambar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[localStyles.modalButton, { backgroundColor: '#FF5E97' }]}
                  onPress={handleNextLevel}
                >
                  <Text style={globalStyles.buttonText}>Level Berikutnya</Text>
                  <ArrowRight color="#2A0825" size={18} style={{ marginLeft: 8 }} />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </SafeAreaView>
    </View>
  );
};

// Komponen Pembungkus Blok Kata agar bisa diseret (Draggable) menggunakan PanResponder
interface DraggableBlockProps {
  block: PlayBlock;
  onTap: (block: PlayBlock) => void;
  onDragStart: () => void;
  onDragEnd: (block: PlayBlock, x: number, y: number) => void;
}

const DraggableBlock: React.FC<DraggableBlockProps> = ({ block, onTap, onDragStart, onDragEnd }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const [isDragging, setIsDragging] = useState(false);

  // Gunakan refs mutable untuk menyimpan callback terbaru guna menghindari stale closure di PanResponder
  const onTapRef = useRef(onTap);
  const onDragStartRef = useRef(onDragStart);
  const onDragEndRef = useRef(onDragEnd);

  // Selalu perbarui ref ke callback terbaru setiap kali render
  useEffect(() => {
    onTapRef.current = onTap;
    onDragStartRef.current = onDragStart;
    onDragEndRef.current = onDragEnd;
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Mulai memicu seretan jika perpindahan jari lebih dari 5px
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        setIsDragging(true);
        onDragStartRef.current();
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false
      }),
      onPanResponderRelease: (_, gestureState) => {
        setIsDragging(false);
        // Deteksi apakah ketukan atau seretan
        if (Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5) {
          onTapRef.current(block);
        } else {
          onDragEndRef.current(block, gestureState.moveX, gestureState.moveY);
          // Selalu kembalikan posisi blok ke asal secara membal (smooth spring transition)
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
            tension: 50,
            friction: 7
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false
        }).start();
      }
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        localStyles.wordBlock,
        {
          backgroundColor: '#FFF385',
          transform: pan.getTranslateTransform(),
          zIndex: isDragging ? 999 : 1,
          opacity: isDragging ? 0.75 : 1,
        }
      ]}
    >
      <Text style={localStyles.wordTextInactive}>{block.text}</Text>
    </Animated.View>
  );
};

const localStyles = StyleSheet.create({
  topZone: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF5E97',
  },
  typeText: {
    fontSize: 12,
    color: '#FFF385',
    marginTop: 2,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A0825',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderColor: '#4A1542',
    borderWidth: 1,
  },
  iconButtonText: {
    color: '#FFF385',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFF385',
    marginBottom: 8,
  },
  canvasContainer: {
    minHeight: 110,
    backgroundColor: '#2A0825',
    borderColor: '#FF5E97',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trayContainer: {
    minHeight: 110,
    backgroundColor: '#2A0825',
    borderColor: '#4A1542',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#FFF385',
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    opacity: 0.6,
    paddingHorizontal: 20,
  },
  wordBlock: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  wordTextActive: {
    color: '#2A0825',
    fontWeight: 'bold',
    fontSize: 13,
  },
  wordTextInactive: {
    color: '#2A0825',
    fontWeight: 'bold',
    fontSize: 13,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(26, 6, 37, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  quoteCard: {
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
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FF5E97',
    letterSpacing: 1.5,
    marginTop: 8,
  },
  badgeSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF385',
    marginTop: 2,
  },
  quoteText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFEBF3',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 26,
    marginVertical: 12,
    paddingHorizontal: 10,
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
  quoteFooter: {
    marginTop: 20,
    borderTopColor: '#2A0825',
    borderTopWidth: 1,
    width: '100%',
    paddingTop: 10,
    alignItems: 'center',
  },
  quoteFooterText: {
    fontSize: 10,
    color: '#FFF385',
    opacity: 0.6,
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
});
