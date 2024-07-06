import { Box, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { HeadCell, SFC, THProps, User } from "@shared/types";

export interface TableHeaderProps {
    props: THProps
    headCells: HeadCell[]
}

export const TableHeader: SFC<TableHeaderProps> = ({className, props, headCells}) => {
    const {  order, orderBy, onRequestSort } = props;
    const createSortHandler = (property: keyof User) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

    return (
        <>
            <TableHead className={className}>
                <TableRow>
                    {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.Id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.Id ? order : false}
                    >
                        <TableSortLabel
                        active={orderBy === headCell.Id}
                        direction={orderBy === headCell.Id ? order : 'asc'}
                        onClick={createSortHandler(headCell.Id)}
                        >
                        {headCell.label}
                        {orderBy === headCell.Id ? (
                            <Box component="span" sx={visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </Box>
                        ) : null}
                        </TableSortLabel>
                    </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        </>
    )
}