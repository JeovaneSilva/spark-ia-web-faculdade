// Baixa um texto como arquivo, sem passar por servidor.
export function downloadTextFile(filename: string, content: string, mimeType = 'text/csv;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([content], { type: mimeType }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
