import { ContentBody, ContentFooter, ContentHeader, PageContainer } from '@shared/components'
import { OnlyReadTable } from '@shared/components/Table'
import { SFC, SqlChannel, WindowDispatch } from '@shared/types'
import { convertDate } from '@shared/utils/date'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import * as S from './Styles'

export const SIA: SFC = ({ className }) => {
  const dispatch = useDispatch<WindowDispatch>();
  const [rows, setRows] = useState<Array<any>>([]);
  /*
  const Rows: Array<any> = [
      {   Id: 1, UserName: 'admin', Password: 'innosoft', FullName: 'Administrator', UserCardNumber: '1234', EntryUserId: 1, EntryDateTime:'2013-02-27 10:26:27.000', UpdateUserId:1, UpdateDateTime:'2013-02-27 10:26:27.000', IsLocked:1    },
      {   Id: 51, UserName: 'cashier', Password: 'innosoft', FullName: 'Cashier', UserCardNumber: null, EntryUserId: 1, EntryDateTime:'2013-02-27 10:26:27.000', UpdateUserId:1, UpdateDateTime:'2013-02-27 10:26:27.000', IsLocked:1    },
      {   Id: 53, UserName: 'teller', Password: 'innosoft', FullName: 'Teller', UserCardNumber: null, EntryUserId: 1, EntryDateTime:'2013-02-27 10:26:27.000', UpdateUserId:1, UpdateDateTime:'2013-02-27 10:26:27.000', IsLocked:1    },
  ]*/

    useEffect(() => {
      window.electron.sql.get(SqlChannel.getAllUser)
        .then(response => {
          //console.log('USERS-REQ RESPONSE:', response);
          if (response.List && response.List.length > 0) {
            const list = response.List.map((data: any) => ({
              Id: data.Id,
              UserName: data.UserName,
              Password: data.Password,
              FullName: data.FullName,
              UserCardNumber: data.UserCardNumber,
              EntryUserId: data.EntryUserId,
              EntryDateTime: convertDate(String(data.EntryDateTime)),
              UpdateUserId: data.UpdateUserId,
              UpdateDateTime: convertDate(String(data.UpdateDateTime)),
              IsLocked: data.IsLocked,
            }));
            setRows(list);
          }
        })
        .catch(error => {
          console.log('Error in fetch Users', error);
        });
    }, [dispatch]);
  
  //console.log('USERS-REQ RESPONSE:', rows);
  return (
    <PageContainer className={className}>
      <S.Container className=''>
      </S.Container>
      <ContentHeader Title="SIA" />
      <ContentBody className={className}> 
         <OnlyReadTable Rows={rows}/>
         </ContentBody>
      <ContentFooter> Footer </ContentFooter>
    </PageContainer>
  )
}
