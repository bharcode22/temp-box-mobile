/**
 * Mengacak array secara acak menggunakan algoritma Fisher-Yates.
 * Menghasilkan array baru tanpa memodifikasi array asli.
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const arr = [...array];

  // Jika isi array kurang dari 2, tidak perlu diacak
  if (arr.length < 2) return arr;

  let attempts = 0;
  let isSame = true;

  // Lakukan pengacakan setidaknya sekali, ulangi jika hasil acak sama dengan susunan asli
  while (isSame && attempts < 5) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    // Periksa apakah urutannya masih sama dengan array awal
    isSame = arr.every((val, idx) => val === array[idx]);
    attempts++;
  }

  return arr;
};

/**
 * Memvalidasi apakah jawaban pengguna sudah benar dengan membandingkan
 * string hasil gabungan pilihan pengguna dengan string target jawaban asli.
 */
export const validateAnswer = (userSelection: string[], target: string): boolean => {
  // Gabungkan pilihan pengguna dengan spasi, lalu bersihkan spasi berlebih
  const userString = userSelection.join(' ').replace(/\s+/g, ' ').trim();
  const targetString = target.replace(/\s+/g, ' ').trim();

  return userString.toLowerCase() === targetString.toLowerCase();
};
