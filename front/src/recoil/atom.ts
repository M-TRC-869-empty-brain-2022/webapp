import { atom } from 'recoil';

interface User {
    username: string;
    id: string;
}

export const user = atom<User | undefined>({
    key: 'user',
    default: undefined
})