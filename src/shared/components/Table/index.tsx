import { Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from '@mui/material';
import { TableHeader } from '@shared/components';
import { useStyles } from '@shared/styles/useStyles';
import { HeadCell, Order, THProps, User } from '@shared/types';
import { getComparator, stableSort } from '@shared/utils';
import * as React from 'react';
import * as S from './Styles';

const rows = [
  /*createData(1, 'Cupcake', 305, 3.7, 67, 4.3),
  createData(2, 'Donut', 452, 25.0, 51, 4.9),
  createData(3, 'Eclair', 262, 16.0, 24, 6.0),
  createData(4, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData(5, 'Gingerbread', 356, 16.0, 49, 3.9),
  createData(6, 'Honeycomb', 408, 3.2, 87, 6.5),
  createData(7, 'Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData(8, 'Jelly Bean', 375, 0.0, 94, 0.0),
  createData(9, 'KitKat', 518, 26.0, 65, 7.0),
  createData(10, 'Lollipop', 392, 0.2, 98, 0.0),
  createData(11, 'Marshmallow', 318, 0, 81, 2.0),
  createData(12, 'Nougat', 360, 19.0, 9, 37.0),
  createData(13, 'Oreo', 437, 18.0, 63, 4.0),*/
];


const headCells: HeadCell[] = [
  {
    Id: 'UserName',
    numeric: false,
    disablePadding: true,
    label: 'Username',
  },
  {
    Id: 'FullName',
    numeric: false,
    disablePadding: false,
    label: 'Full Name',
  },
  {
    Id: 'UserCardNumber',
    numeric: true,
    disablePadding: false,
    label: 'Card Number',
  },
  {
    Id: 'EntryDateTime',
    numeric: false,
    disablePadding: false,
    label: 'Date Created',
  },
];

export const ReadTable = () => {
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

    const handleClick = (_event: React.MouseEvent<unknown>, id: number) => {
        alert(id)
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const isSelected = (id: number) => selected.indexOf(id) !== -1;
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
    const visibleRows = React.useMemo(() => stableSort(rows, getComparator(order, orderBy)).slice( page * rowsPerPage, page * rowsPerPage + rowsPerPage, ), [order, orderBy, page, rowsPerPage]);
    
    return (
        <>
            <S.Container>
                <TablePagination
                    component="div"
                    count={rows.length}
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
                        <TableHeader props={ props} headCells={headCells}/>
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
                                    <TableCell align="right">{row.FullName}</TableCell>
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
