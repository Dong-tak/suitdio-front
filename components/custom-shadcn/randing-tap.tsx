import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';

export function LandingTabs() {
  return (
    <Tabs defaultValue='board' className='w-full flex flex-col items-center'>
      <TabsList className='grid w-1/2 grid-cols-4 gap-2'>
        <TabsTrigger value='board'>Board</TabsTrigger>
        <TabsTrigger value='widgets'>Widgets</TabsTrigger>
        <TabsTrigger value='migration'>Migration</TabsTrigger>
        <TabsTrigger value='integration'>Integration</TabsTrigger>
      </TabsList>
      <div className=' w-full mt-8 px-48 h-full'>
        <TabsContent
          value='board'
          className='w-full items-center justify-center flex'
        >
          {/* <Card>
            <CardHeader>
              <CardTitle>Board</CardTitle>
              <CardDescription>
                Make changes to your account here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='space-y-1'>
                <Label htmlFor='name'>Name</Label>
                <Input id='name' defaultValue='Pedro Duarte' />
              </div>
              <div className='space-y-1'>
                <Label htmlFor='username'>Username</Label>
                <Input id='username' defaultValue='@peduarte' />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card> */}
          <Image
            src='/images/mileque-image.jpg'
            alt='협업하는 사람들을 보여주는 일러스트레이션'
            width={800}
            height={600}
            className='w-full max-w-[1200px] h-auto border-2 border-black/10 rounded-md'
          />
        </TabsContent>
        <TabsContent value='widgets'>
          <Card>
            <CardHeader>
              <CardTitle>Widgets</CardTitle>
              <CardDescription>
                Change your password here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='space-y-1'>
                <Label htmlFor='current'>Current password</Label>
                <Input id='current' type='password' />
              </div>
              <div className='space-y-1'>
                <Label htmlFor='new'>New password</Label>
                <Input id='new' type='password' />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value='migration'>
          <Card>
            <CardHeader>
              <CardTitle>migration</CardTitle>
              <CardDescription>
                Make changes to your account here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='space-y-1'>
                <Label htmlFor='name'>Name</Label>
                <Input id='name' defaultValue='Pedro Duarte' />
              </div>
              <div className='space-y-1'>
                <Label htmlFor='username'>Username</Label>
                <Input id='username' defaultValue='@peduarte' />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value='integration'>
          <Card>
            <CardHeader>
              <CardTitle>integration</CardTitle>
              <CardDescription>
                Make changes to your account here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='space-y-1'>
                <Label htmlFor='name'>Name</Label>
                <Input id='name' defaultValue='Pedro Duarte' />
              </div>
              <div className='space-y-1'>
                <Label htmlFor='username'>Username</Label>
                <Input id='username' defaultValue='@peduarte' />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  );
}
