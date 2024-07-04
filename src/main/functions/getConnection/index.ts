import { Error, Success } from '@shared/messages';
import { SqlChannel } from '@shared/types';
import Store from 'electron-store';

interface Response {
    Data: any | null;
    Message: String;
}

export const getConnection = (): Response => {
    try {
        const store = new Store()
        const config = (store.get(SqlChannel.dbConfig))
        if (!config)  return ({ Data: null, Message: Error.e00x43})
        return ({ Data: config, Message: Success.s00x00})
    } catch (error : any) {
        return ({ Data: null, Message: `${error}` })
    }
}