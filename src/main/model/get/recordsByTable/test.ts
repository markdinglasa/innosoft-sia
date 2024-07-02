//import Store from '../../../../Store'
//import electronStore from 'electron-store';
//import { recordsByTable } from '.';

import { recordsByTable } from ".";
//import { CONFIGURATION } from '../../config'
( async () => {
    try {
        //const store = new electronStore();
        //store.set('set-database-configuration', 'shibal')
        //let database:any ;
        /*const config = {
            user: 'sa',
            password: 'innosoft',
            server: 'localhost',
            database: 'pos13',
            options: {
                trustedConnection: true,
                encrypt: false,
                instanceName: 'MSSQLSERVER',
                trustServerCertificate:true // only include this if using MSSQL Server 2019/2022
            },
            port: 1433
        }*/

        const list = await recordsByTable('MstUser');
        //const config: any = CONFIGURATION();
        console.log(list);
    } catch (error: any) {
        console.log(error);
    }
    
})()