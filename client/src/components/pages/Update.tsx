// src/pages/UpdatePage.tsx

import React, { useState } from 'react';
import { useCheckForUpdates, useRunUpdater } from '@/api/update';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Alert } from '../ui/alert';

const UpdatePage: React.FC = () => {
  const { data, isLoading, isError } = useCheckForUpdates();
  const [updating, setUpdating] = useState(false);

  const runUpdater = useRunUpdater();

  const handleUpdateClick = () => {
    runUpdater.mutate(undefined, {
      onSuccess: () => {
        setUpdating(true);
        toast('Atualizando... Aguarde o programa reiniciar...', {
          icon: '🚀',
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div>
          Carregando...
        </div>
      </div>
    );
  }

  if (isError || !data) {
    
    toast('Erro ao buscar por atualizações', {
      icon: '😞',
    });

    return (
      <div className="flex items-center justify-center h-full">
        <Alert>
          Ocorreu um erro ao verificar atualizações. Por favor, tente novamente mais tarde.
        </Alert>
      </div>
    );
  }

  const { update_available, current_version, latest_version, published_at } = data;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 min-h-screen max-h-screen justify-center">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Atualizações do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Versão atual:</strong> {current_version}
          </p>
          <p>
            <strong>Última versão:</strong> {latest_version}
          </p>
          <p>
            <strong>Data de publicação:</strong>{' '}
            {format(new Date(published_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
          </p>
          {update_available ? (
            <Alert variant="default" className="mt-4">
              Há uma atualização disponível.
            </Alert>
          ) : (
            <Alert variant="default" className="mt-4">
              Você está usando a versão mais recente.
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={handleUpdateClick}
            disabled={!update_available || runUpdater.isPending || updating}
          >
            {(runUpdater.isPending || updating)  ? 'Atualizando...' : 'Atualizar'}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
};

export default UpdatePage;
