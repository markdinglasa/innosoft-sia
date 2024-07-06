import { Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from '@mui/material';
import { TableHeader } from '@shared/components';
import { userHeadCells } from '@shared/data/user';
import { useStyles } from '@shared/styles/useStyles';
import { Order, SFC, THProps, User } from '@shared/types';
import { getComparator, stableSort } from '@shared/utils';
import * as React from 'react';
import * as S from './Styles';

interface OnlyReadTableProps {
    Rows: Array<any>
}

export const OnlyReadTable: SFC<OnlyReadTableProps> = ({className, Rows}) => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof User>('FullName');
    const [selected, _setSelected] = React.useState<readonly number[]>([]);
    const [page, setPage] = React.useState(0);
    const rowsPerPage = 50;

    const handleRequestSort = ( _event: React.MouseEvent<unknown>, property: keyof User, ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const props: THProps = {
        order: order,
        orderBy: orderBy,
        onRequestSort: handleRequestSort,
    }

    const handleClick = (_event: React.MouseEvent<unknown>, Id: number) => {
        alert(Id)
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const isSelected = (Id: number) => selected.indexOf(Id) !== -1;
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - Rows.length) : 0;
    const visibleRows = React.useMemo(() => stableSort(Rows, getComparator(order, orderBy)).slice( page * rowsPerPage, page * rowsPerPage + rowsPerPage, ), [order, orderBy, page, rowsPerPage]);
    
    return (
        <>
            <S.Container className={className} >
                <TablePagination
                    component="div"
                    count={Rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[]} // Empty array to remove the dropdown
                    classes={{ root: useStyles().pagination }}
                />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size='small'
                    >
                        <TableHeader props={ props } headCells={userHeadCells}/>
                        <TableBody>
                        {visibleRows.map((row, index) => {
                            const isItemSelected = isSelected(parseInt(`${row.Id}`, 10));
                            const labelId = `enhanced-table-checkbox-${index}`;
                            return (
                                <TableRow
                                    hover
                                    onClick={(event) => handleClick(event,parseInt(`${row.Id}`, 10))}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.Id}
                                    selected={isItemSelected}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell
                                        component="th"
                                        id={labelId}
                                        scope="row"
                                        padding="none"
                                    >
                                    {row.UserName}
                                    </TableCell>
                                    <TableCell align="left">{row.FullName}</TableCell>
                                    <TableCell align="right">{row.UserCardNumber}</TableCell>
                                    <TableCell align="right">{row.EntryDateTime}</TableCell>
                                </TableRow>
                            );
                        })}
                            {emptyRows > 0 && ( 
                                <TableRow style={{ height: 33 * emptyRows, }} >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </S.Container>
        </>
    );
}
