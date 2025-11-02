'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { Textarea } from '../ui/textarea';
import { useFormContext } from 'react-hook-form';

export function CanvasDrawer({
  model,
  icon: Icon,
}: {
  model: {
    id: string;
    title: string;
    description: string;
    area: string;
    color: string;
  };
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Card
            className={cn(
              `rounded-md p-4 border shadow-sm`,
              model.area,
              model.color,
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${model.color}`}>
                  <Icon className={cn('h-5 w-5', model.color)} />
                </div>
                <div>
                  <CardTitle className="text-sm">{model.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {model.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{model.title}</DialogTitle>
            <DialogDescription>{model.description}</DialogDescription>
          </DialogHeader>
          <CanvasForm model={model} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Card
          className={cn(
            `rounded-md p-4 border shadow-sm`,
            model.area,
            model.color,
          )}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${model.color}`}>
                <Icon className={cn('h-5 w-5', model.color)} />
              </div>
              <div>
                <CardTitle className="text-sm">{model.title}</CardTitle>
                <CardDescription className="text-xs">
                  {model.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{model.title}</DrawerTitle>
          <DrawerDescription>{model.description}</DrawerDescription>
        </DrawerHeader>
        <CanvasForm model={model} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function CanvasForm({
  model,
}: {
  model: {
    id: string;
    title: string;
    description: string;
    area: string;
    color: string;
  };
}) {
  const { setValue, watch } = useFormContext();

  return (
    <div className="p-4 flex-1 flex flex-col">
      <Textarea
        onChange={(e) =>
          setValue(
            `modelo.${model.id}` as
            | `modelo.missao`
            | `modelo.visao`
            | `modelo.mercado`
            | `modelo.publico_alvo`
            | `modelo.receita`
            | `modelo.proposta_valor`
            | `modelo.retencao`,
            e.target.value,
          )
        }
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
        placeholder="Descreva aqui... (pressione Enter para quebrar linha)"
        className="flex-1 min-h-[120px] resize-none"
        value={watch(
          `modelo.${model.id}` as
          | 'modelo.missao'
          | 'modelo.visao'
          | 'modelo.mercado'
          | 'modelo.publico_alvo'
          | 'modelo.receita'
          | 'modelo.proposta_valor'
          | 'modelo.retencao',
        )}
        style={{ whiteSpace: 'pre-wrap' }}
      />
    </div>
  );
}
