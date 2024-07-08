import { csvHeaders } from '@shared/data';
import { Error, Success } from '@shared/messages';
import { SIA_QUERY } from '@shared/query';
import { Response, SqlChannel } from '@shared/types';
import { generateSIAName } from '@shared/utils';
import { createArrayCsvWriter } from 'csv-writer'; // Assuming you have a CSV writer library
import { ipcMain } from 'electron';
import { recordByQuery } from '../../../model';

const h = csvHeaders.map(header => header.title);

ipcMain.handle(SqlChannel.getSIA, async (_event: any, path: string): Promise<Response> => {
    try {
        const result: Response = await recordByQuery(SIA_QUERY);
        if (!result.List) {
            return { IsSomething: false, Message: result.Message };
        }
        const csvWriter = createArrayCsvWriter({
            path: `${path}/${generateSIAName()}`,
            header: h,
        });
        await csvWriter.writeRecords(result.List);
        return { IsSomething: true, Message: Success.s00x00 };
    } catch (error: any) {
        return { IsSomething: false, Message: Error.e00x02 };
    }
});
