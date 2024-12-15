import * as React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Alert Dialog',
    href: '/docs/primitives/alert-dialog',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Hover Card',
    href: '/docs/primitives/hover-card',
    description:
      'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Progress',
    href: '/docs/primitives/progress',
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
  },
  {
    title: 'Scroll-area',
    href: '/docs/primitives/scroll-area',
    description: 'Visually or semantically separates content.',
  },
  {
    title: 'Tabs',
    href: '/docs/primitives/tabs',
    description:
      'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  },
];

export default function NavigationMenuCustom() {
  return (
    <NavigationMenu>
      <NavigationMenuList className='gap-4'>
        <NavigationMenuItem>
          <NavigationMenuTrigger className='nav-menu-fontsize bg-transparent font-semibold text-purple-600'>
            Products
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
              <li className='row-span-3 hover:bg-accent hover:text-accent-foreground'>
                <NavigationMenuLink asChild>
                  <a
                    className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md'
                    href='/'
                  >
                    <Image
                      src='/mileque-image.jpg'
                      alt='MileQue'
                      width={200}
                      height={200}
                      className='w-full h-auto object-cover'
                    />
                    <div className='mb-2 mt-4 text-lg font-medium'>MileQue</div>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem
                href='/products/infoCollection'
                title='Information Collection'
              >
                여러 플랫폼에서 한 번의 클릭으로 필요한 정보를 저장할 수
                있습니다.
              </ListItem>
              <ListItem href='/products/team' title='Team'>
                팀 기능을 통해 팀원들과 함께 지식을 관리할 수 있습니다.
              </ListItem>
              <ListItem href='/products/ai-copilot' title='AI'>
                인공지능을 사용하여 지식 관리를 시작하세요.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className='nav-menu-fontsize bg-transparent font-semibold text-purple-600'>
            Resources
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
              <li className='row-span-3 hover:bg-accent hover:text-accent-foreground'>
                <NavigationMenuLink asChild>
                  <a
                    className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md'
                    href='https://suitdio.featurebase.app/en/help'
                  >
                    <Image
                      src='/mileQue-docs.jpg'
                      alt='MileQue'
                      width={200}
                      height={200}
                      className='w-full h-auto object-cover'
                    />
                    <div className='mb-2 mt-4 text-lg font-medium'>Docs</div>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem
                href='https://suitdio.featurebase.app/ko/changelog'
                title='Change Log'
              >
                여러 플랫폼에서 한 번의 클릭으로 필요한 정보를 저장할 수
                있습니다.
              </ListItem>
              <ListItem
                href='https://suitdio.featurebase.app/en'
                title='Feedback'
              >
                팀 기능을 통해 팀원들과 함께 지식을 관리할 수 있습니다.
              </ListItem>
              <ListItem
                href='https://suitdio.featurebase.app/en/help'
                title='Help Center'
              >
                MileQue를 어떻게 사용하는지 도움을 받을 수 있습니다.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href='/products/pricing' legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                'nav-menu-fontsize font-semibold text-purple-600 bg-transparent'
              )}
            >
              Pricing
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className='text-[16px] font-medium leading-none'>{title}</div>
          <p className='line-clamp-2 text-[16px] leading-snug text-muted-foreground'>
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
