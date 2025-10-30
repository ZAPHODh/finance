'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { indexUserData, deleteUserIndex } from '@/app/[locale]/actions/algolia-indexing';
import { toast } from 'sonner';

export default function IndexSearchPage() {
  const [isIndexing, setIsIndexing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleIndex() {
    setIsIndexing(true);
    try {
      const result = await indexUserData();
      toast.success(`Indexação concluída! ${result.recordsCount} registros indexados.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao indexar dados');
    } finally {
      setIsIndexing(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteUserIndex();
      toast.success('Índice deletado com sucesso!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao deletar índice');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="container max-w-2xl py-10">
      <h1 className="text-3xl font-bold mb-6">Gerenciar Índice de Busca (Algolia)</h1>

      <div className="space-y-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Indexar Dados</h2>
          <p className="text-muted-foreground mb-4">
            Indexa todos os seus dados (páginas, despesas, receitas, motoristas, veículos, etc.) no Algolia Search.
          </p>
          <Button onClick={handleIndex} disabled={isIndexing}>
            {isIndexing ? 'Indexando...' : 'Indexar Dados'}
          </Button>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2 text-destructive">Deletar Índice</h2>
          <p className="text-muted-foreground mb-4">
            Remove completamente o índice de busca. Use com cuidado!
          </p>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            variant="destructive"
          >
            {isDeleting ? 'Deletando...' : 'Deletar Índice'}
          </Button>
        </div>

        <div className="border rounded-lg p-6 bg-muted">
          <h2 className="text-xl font-semibold mb-2">Informações</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>A indexação é executada no servidor e pode levar alguns segundos</li>
            <li>Os dados são limitados a 500 registros por categoria para performance</li>
            <li>Após indexar, você pode testar a busca usando <kbd className="px-2 py-1 bg-background rounded">Cmd+K</kbd> ou <kbd className="px-2 py-1 bg-background rounded">Ctrl+K</kbd></li>
            <li>A busca procura em: páginas, despesas, receitas, motoristas, veículos, plataformas, tipos de despesa e formas de pagamento</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
