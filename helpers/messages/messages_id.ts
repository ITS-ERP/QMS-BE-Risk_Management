import { MessagesKey } from './messagesKey';

export const messages_id = {
  // Common Error messages
  [MessagesKey.NODATAFOUND]: 'Data tidak ditemukan',
  [MessagesKey.INTERNALSERVERERROR]: 'Kesalahan server internal',
  [MessagesKey.UNKNOWNERROR]: 'Terjadi kesalahan yang tidak diketahui',
  [MessagesKey.BADREQUEST]: 'Permintaan tidak valid.',
  [MessagesKey.UNAUTHORIZED]: 'Tidak terotorisasi.',
  [MessagesKey.SPESIFICDATANOTFOUND]: '{0} tidak ditemukan.',
  [MessagesKey.ERRORCREATION]:
    'Gagal membuat {0}. Metode pembuatan tidak mengembalikan instansi model yang valid.',
  [MessagesKey.ERRORGENERATECSV]: 'Terjadi kesalahan saat membuat CSV.',
  [MessagesKey.ERRORGENERATEPDF]: 'Terjadi kesalahan saat membuat PDF.',

  // Common Success messages
  [MessagesKey.SUCCESSGET]: 'Data telah ditemukan.',
  [MessagesKey.SUCCESSGETBYID]:
    'Data telah ditemukan berdasarkan kriteria yang ditentukan.',
  [MessagesKey.SUCCESSCREATE]: 'Data telah dibuat.',
  [MessagesKey.SUCCESSBULKCREATE]: 'Data telah dibuat secara massal.',
  [MessagesKey.SUCCESSUPDATE]: 'Data telah diperbarui.',
  [MessagesKey.SUCCESSBULKUPDATE]: 'Data telah diperbarui secara massal.',
  [MessagesKey.SUCCESSHARDDELETE]: 'Data telah dihapus secara permanen.',
  [MessagesKey.SUCCESSSOFTDELETE]: 'Data telah dihapus secara lunak.',
  [MessagesKey.SUCCESSRESTORE]: 'Data telah dipulihkan.',
  [MessagesKey.SUCCESSGENERATECSV]: 'CSV telah berhasil dibuat.',
  [MessagesKey.SUCCESSGENERATEPDF]: 'PDF telah berhasil dibuat.',

  // Repository messages
  [MessagesKey.ERRORFINDINGALL]: 'Terjadi kesalahan saat mencari semua data',
  [MessagesKey.ERRORFINDINGBYID]:
    'Terjadi kesalahan saat mencari data berdasarkan ID',
  [MessagesKey.ERRORCREATE]: 'Terjadi kesalahan saat membuat data.',
  [MessagesKey.ERRORBULKCREATE]:
    'Terjadi kesalahan saat membuat data secara massal.',
  [MessagesKey.ERRORHARDDELETING]:
    'Terjadi kesalahan saat menghapus data secara permanen.',
  [MessagesKey.ERRORSOFTDELETING]:
    'Terjadi kesalahan saat menghapus data secara lunak.',
  [MessagesKey.ERRORRESTORING]: 'Terjadi kesalahan saat memulihkan data.',

  // Business Logic messages
};
