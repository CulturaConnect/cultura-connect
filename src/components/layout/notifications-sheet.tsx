import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { useNotificationsQueries } from '@/api/notifications/notifications.queries';

export default function NotificationSheet() {
  const { user } = useAuth();

  const { data } = useNotificationsQueries(user?.id || '');

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 " />
          {data && data.length > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-[8px] font-medium text-white bg-red-500 rounded-full">
              {data.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md">
        <div className="flex flex-col h-full">
          <SheetHeader className="border-b">
            <SheetTitle className="text-lg font-medium">
              Notificações
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-auto py-4 px-2">
            <div className="grid gap-4">
              {data?.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-center gap-3 p-4 border rounded-md shadow-sm hover:bg-gray-50 transition-colors w-full"
                >
                  <div className="bg-primary rounded-md flex items-center justify-center w-10 h-10 shrink-0">
                    <Bell className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-400">
                        {notification.created_at
                          ? new Date(
                              notification.created_at,
                            ).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : ''}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    {notification.link && (
                      <a
                        href={notification.link}
                        className="text-sm text-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver mais
                      </a>
                    )}
                  </div>
                </div>
              ))}

              {/* <div className="grid gap-2">
                <div className="flex items-start gap-3">
                  <div className="bg-primary rounded-md flex items-center justify-center w-10 h-10 shrink-0">
                    <BellIcon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">New message from Jane</p>
                    <p className="text-sm text-muted-foreground">
                      Hey, just wanted to let you know that I'll be late to the meeting today.
                    </p>
                    <Link href="#" className="text-sm text-primary" prefetch={false}>
                      View message
                    </Link>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-start gap-3">
                  <div className="bg-secondary rounded-md flex items-center justify-center w-10 h-10 shrink-0">
                    <CalendarIcon className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Upcoming event</p>
                    <p className="text-sm text-muted-foreground">Company picnic this Saturday at 2pm.</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-start gap-3">
                  <div className="bg-accent rounded-md flex items-center justify-center w-10 h-10 shrink-0">
                    <PackageIcon className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Order shipped</p>
                    <p className="text-sm text-muted-foreground">
                      Your order #12345 has been shipped and will arrive in 2-3 business days.
                    </p>
                    <Link href="#" className="text-sm text-accent" prefetch={false}>
                      Track order
                    </Link>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-start gap-3">
                  <div className="bg-muted rounded-md flex items-center justify-center w-10 h-10 shrink-0">
                    <StarIcon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">New review</p>
                    <p className="text-sm text-muted-foreground">
                      Your product received a 5-star review from a customer.
                    </p>
                    <Link href="#" className="text-sm text-muted-foreground" prefetch={false}>
                      View review
                    </Link>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
