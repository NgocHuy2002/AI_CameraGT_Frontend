export function sortKhoiLuongCongViec(a, b) {
  if (a?.viTriId && b?.viTriId) {
    return a?.viTriId?.thuTu - b?.viTriId?.thuTu;
  }
  if (a?.khoangCotId && b?.khoangCotId) {
    return a?.khoangCotId?.viTriId?.thuTu - b?.khoangCotId?.viTriId?.thuTu;
  }
  if (a?.viTriId && b?.khoangCotId) {
    if (a?.viTriId?.thuTu === b?.khoangCotId?.viTriId?.thuTu) {
      return (a?.viTriId?.thuTu + 1) - b?.khoangCotId?.viTriId?.thuTu;
    }
    return a?.viTriId?.thuTu - b?.khoangCotId?.viTriId?.thuTu;
  }
  if (a?.khoangCotId && b?.viTriId) {
    if (a?.khoangCotId?.viTriId?.thuTu === b?.viTriId?.thuTu) {
      return a?.khoangCotId?.viTriId?.thuTu - (b?.viTriId?.thuTu + 1);
    }
    return a?.khoangCotId?.viTriId?.thuTu - b?.viTriId?.thuTu;
  }
  return 0;
}
