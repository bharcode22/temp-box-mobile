import React from 'react';
import { View, ScrollView, StatusBar, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components & Icons
import { Header } from '../components/Header';
import { BookOpen, Gamepad2, RefreshCw, Award, Download, Info, Lightbulb } from 'lucide-react-native';

// Styles
import { styles as globalStyles } from '../styles/App.styles';

export const RulesScreen: React.FC = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#2A0825' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor="#2A0825" />
        <Header title="Aturan Bermain" subtitle="Panduan lengkap memainkan Word Puzzle" Icon={BookOpen} />

        <ScrollView style={globalStyles.container} contentContainerStyle={{ paddingBottom: 30 }}>
          {/* Card 1: Selamat Datang */}
          <View style={globalStyles.card}>
            <View style={localStyles.titleContainer}>
              <Info color="#FFF385" size={20} style={{ marginRight: 8 }} />
              <Text style={globalStyles.cardTitle}>Tentang Word Puzzle</Text>
            </View>
            <Text style={globalStyles.cardDescription}>
              Word Puzzle adalah permainan menyusun kata dan kalimat yang didesain untuk melatih kelancaran struktur tata bahasa serta mengasah pemahaman susunan kata yang tepat secara menyenangkan.
            </Text>
          </View>

          {/* Card 2: Langkah Bermain */}
          <View style={globalStyles.card}>
            <View style={localStyles.titleContainer}>
              <Gamepad2 color="#FF5E97" size={20} style={{ marginRight: 8 }} />
              <Text style={globalStyles.cardTitle}>Cara Bermain</Text>
            </View>
            
            <View style={localStyles.stepItem}>
              <View style={localStyles.stepBadge}>
                <Text style={localStyles.stepBadgeText}>1</Text>
              </View>
              <View style={localStyles.stepContent}>
                <Text style={localStyles.stepTitle}>Pahami Kalimat Target</Text>
                <Text style={localStyles.stepDescription}>
                  Di bagian atas permainan, pahami konteks level dan cari petunjuk susunan kata/kalimat yang benar.
                </Text>
              </View>
            </View>

            <View style={localStyles.stepItem}>
              <View style={localStyles.stepBadge}>
                <Text style={localStyles.stepBadgeText}>2</Text>
              </View>
              <View style={localStyles.stepContent}>
                <Text style={localStyles.stepTitle}>Pilih Blok Kata</Text>
                <Text style={localStyles.stepDescription}>
                  Ketuk blok-blok kata di baki bawah (tray) untuk memindahkannya ke kanvas jawaban di atas secara berurutan.
                </Text>
              </View>
            </View>

            <View style={localStyles.stepItem}>
              <View style={localStyles.stepBadge}>
                <Text style={localStyles.stepBadgeText}>3</Text>
              </View>
              <View style={localStyles.stepContent}>
                <Text style={localStyles.stepTitle}>Sesuaikan Urutan Jawaban</Text>
                <Text style={localStyles.stepDescription}>
                  Jika ingin membatalkan kata yang telah dipilih, ketuk kata tersebut di kanvas untuk mengembalikannya ke baki bawah.
                </Text>
              </View>
            </View>

            <View style={localStyles.stepItem}>
              <View style={localStyles.stepBadge}>
                <Text style={localStyles.stepBadgeText}>4</Text>
              </View>
              <View style={localStyles.stepContent}>
                <Text style={localStyles.stepTitle}>Selesaikan & Lanjutkan</Text>
                <Text style={localStyles.stepDescription}>
                  Ketika susunan kalimat Anda sudah tepat, level akan langsung selesai dan modal sukses akan muncul otomatis untuk lanjut ke level berikutnya.
                </Text>
              </View>
            </View>
          </View>

          {/* Card 3: Fitur & Tips */}
          <View style={globalStyles.card}>
            <View style={localStyles.titleContainer}>
              <Lightbulb color="#FFF385" size={20} style={{ marginRight: 8 }} />
              <Text style={globalStyles.cardTitle}>Tips & Fitur Game</Text>
            </View>

            <View style={localStyles.tipItem}>
              <RefreshCw color="#FF5E97" size={18} style={{ marginRight: 12, marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={localStyles.tipTitle}>Tombol Reset Level</Text>
                <Text style={localStyles.tipDescription}>
                  Gunakan tombol reset di pojok kanan atas untuk mengembalikan semua kata ke baki bawah dan mengacak ulang posisinya jika Anda merasa buntu.
                </Text>
              </View>
            </View>

            <View style={localStyles.tipItem}>
              <Award color="#FF5E97" size={18} style={{ marginRight: 12, marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={localStyles.tipTitle}>Penyelesaian Sempurna</Text>
                <Text style={localStyles.tipDescription}>
                  Setiap level memiliki target tertentu yang harus diselesaikan untuk membuka level berikutnya di daftar level.
                </Text>
              </View>
            </View>

            <View style={localStyles.tipItem}>
              <Download color="#FF5E97" size={18} style={{ marginRight: 12, marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={localStyles.tipTitle}>Simpan Quote Kartu</Text>
                <Text style={localStyles.tipDescription}>
                  Setelah memenangkan level, Anda dapat menyimpan desain kartu kata bijak yang cantik secara langsung ke galeri foto HP Anda.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const localStyles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  stepBadge: {
    backgroundColor: '#FF5E97',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepBadgeText: {
    color: '#2A0825',
    fontWeight: 'bold',
    fontSize: 12,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFEBF3',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 12,
    color: '#FFEBF3',
    opacity: 0.8,
    lineHeight: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFEBF3',
    marginBottom: 2,
  },
  tipDescription: {
    fontSize: 12,
    color: '#FFEBF3',
    opacity: 0.8,
    lineHeight: 16,
  },
});
