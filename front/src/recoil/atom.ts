import { atom } from 'recoil';
import {User} from "src/utils/api";

export const user = atom<User | undefined>({
    key: 'user',
    default: undefined
})