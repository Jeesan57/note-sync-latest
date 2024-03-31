'use client'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { User, workspace } from '@/lib/supabase/supabase.types';
import { Label } from '@radix-ui/react-label';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { Input } from '../ui/input';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SelectGroup } from '@radix-ui/react-select';
import { Lock, Plus, Router, Share } from 'lucide-react';
import { Button } from '../ui/button';
import { v4 } from 'uuid';
import { addCollaborators, createWorkspace } from '@/lib/supabase/queries';
import CollaboratorSearch from './collaborator-search';


const WorkspaceCreator = () => {
    const { user } = useSupabaseUser();
    const router = useRouter();
    const [permissions, setPermissions] = useState('private');
    const [title, setTitle] = useState('');
    const [collaborators, setCollaborators] = useState<User[]>([]);

    const addCollaborator = (user: User) => {
        setCollaborators([...collaborators, user]);
    };

    const removeCollaborator = (user: User) => {
        setCollaborators(collaborators.filter((c) => c.id !== user.id))
    };

    const createItem = async () => {
        const uuid = v4();
        if (user?.id) {
            const newWorkspace: workspace = {
                data: null,
                createdAt: new Date().toISOString(),
                iconId: '💼',
                id: uuid,
                inTrash: '',
                title,
                workspaceOwner: user.id,
                logo: null,
                bannerUrl: '',
            };
            if (permissions === 'private') {
                await createWorkspace(newWorkspace);
                router.refresh();
            }
            if (permissions === 'shared') {
                await createWorkspace(newWorkspace);
                await addCollaborators(collaborators, uuid);
                router.refresh();
            }
        }
    }



    return (
        <div className='flex gap-4 flex-col'>
            <div>
                <Label htmlFor='name'
                    className='text-sm text-muted-foreground '>
                    Name
                </Label>
                <div className='flex
              justify-center
              items-center
              gap-2
              '>
                    <Input
                        name='name'
                        value={title}
                        placeholder='Workspace Name'
                        onChange={(e) => {
                            setTitle(e.target.value);
                        }}
                    />

                </div>
            </div>
            <>
                <Label
                    htmlFor='permissions'
                    className='text-sm text-muted-foreground'
                >
                    Permission
                </Label>
                <Select onValueChange={(val) => {
                    setPermissions(val);
                }}
                    defaultValue={permissions}

                >
                    <SelectTrigger className='w-full h-26 -mt-2'>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value='private'>
                                <div className='p-2
                              flex
                              gap-4
                              justify-center
                              items-center
                              '>
                                    <Lock />
                                    <article className='text-left flex flex-col'>
                                        <span>Private</span>
                                        <p>Your workspace is private to you.You can choose to share it later.</p>
                                    </article>
                                </div>
                            </SelectItem>
                            <SelectItem value='shared'>
                                <div className='p-2 flex gap-4 justify-center items-center'>
                                    <Share></Share>
                                    <article className='text-left flex flex-col'>
                                        <span>Shared</span>
                                        <span>You can invite collaborators.</span>
                                    </article>
                                </div>
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </>
            {permissions === 'shared' && <div>
                <CollaboratorSearch
                    existingCollaborators={collaborators}
                    getCollaborators={(user) => {
                        addCollaborator(user);
                    }}
                >
                    <Button type='button' className='text-sm mt-4'>
                        <Plus />
                        Add Collaborators
                    </Button>
                </CollaboratorSearch></div>}
            <Button type='button'
                disabled={
                    !title || (permissions === 'shared' && collaborators.length === 0)
                }
                variant={'secondary'}
                onClick={createItem}
            >
                Create
            </Button>
        </div>
    )
}

export default WorkspaceCreator