'use client'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { User } from '@/lib/supabase/supabase.types';
import React, { useEffect, useRef, useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Search } from 'lucide-react';
import { Input } from '../ui/input';


interface CollaboratorSearchProps {
    existingCollaborators: User[] | [];
    getCollaborators: (collaborator: User) => void;
    children: React.ReactNode;
}

const CollaboratorSearch: React.FC<CollaboratorSearchProps> = ({
    children,
    existingCollaborators,
    getCollaborators,
}) => {
    const { user } = useSupabaseUser();
    const [searchResults, setSearchResults] = useState<User[] | []>([]);
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const onChangeHandler = () => { };
    const addCollaborator = () => { };
  return (
      <Sheet>
          <SheetTrigger className='w-full'>{children}</SheetTrigger>
          <SheetContent className='w-[400px] sm:w-[540px]'>
              <SheetHeader>
                  <SheetTitle>Search Collaborator</SheetTitle>
                  <SheetDescription>
                      <p className='text-sm text-muted-foreground'>
                          You can also remove collaborators after adding them from the settings tab.
                      </p>
                  </SheetDescription>
              </SheetHeader>
              <div className='flex justify-center items-center gap-2 mt-2'>
                  <Search />
                  <Input
                      name='name'
                      className='h-2 dark:bg-background'
                  />
              </div>
          </SheetContent>
    </Sheet>
  )
}

export default CollaboratorSearch