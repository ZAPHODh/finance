import fs from 'fs/promises';
import path from 'path';

/**
 * Salva um arquivo de relatório no sistema de arquivos da VPS
 * @param filename Nome do arquivo (ex: expense-breakdown-1234567890.pdf)
 * @param buffer Buffer do arquivo gerado
 * @returns URL pública do arquivo
 */
export async function saveReport(
  filename: string,
  buffer: Buffer
): Promise<string> {
  const reportsDir = path.join(process.cwd(), 'public', 'reports');

  // Criar diretório se não existir
  await fs.mkdir(reportsDir, { recursive: true });

  const filepath = path.join(reportsDir, filename);
  await fs.writeFile(filepath, buffer);

  // Retornar URL público relativo
  return `/reports/${filename}`;
}

/**
 * Remove um arquivo de relatório do sistema
 * @param filename Nome do arquivo a ser removido
 */
export async function deleteReport(filename: string): Promise<void> {
  const filepath = path.join(process.cwd(), 'public', 'reports', filename);

  try {
    await fs.unlink(filepath);
  } catch (error) {
    // Ignora erro se arquivo não existir
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }
}

/**
 * Verifica se um arquivo existe
 * @param filename Nome do arquivo
 * @returns true se o arquivo existe
 */
export async function reportExists(filename: string): Promise<boolean> {
  const filepath = path.join(process.cwd(), 'public', 'reports', filename);

  try {
    await fs.access(filepath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Lista todos os relatórios salvos
 * @returns Array de nomes de arquivos
 */
export async function listReports(): Promise<string[]> {
  const reportsDir = path.join(process.cwd(), 'public', 'reports');

  try {
    const files = await fs.readdir(reportsDir);
    return files.filter(file =>
      file.endsWith('.pdf') ||
      file.endsWith('.xlsx') ||
      file.endsWith('.csv')
    );
  } catch {
    return [];
  }
}

/**
 * Gera um nome de arquivo único para o relatório
 * @param reportType Tipo do relatório
 * @param format Formato do arquivo (pdf, excel, csv)
 * @returns Nome do arquivo gerado
 */
export function generateReportFilename(
  reportType: string,
  format: 'pdf' | 'excel' | 'csv'
): string {
  const timestamp = Date.now();
  const extension = format === 'excel' ? 'xlsx' : format;
  return `${reportType}-${timestamp}.${extension}`;
}
