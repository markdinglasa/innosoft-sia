import { User } from '@shared/types';
import React from 'react';
export type Order = 'asc' | 'desc';

export interface HeadCell {
    disablePadding: boolean;
    Id: keyof User;
    label: string;
    numeric: boolean;
}

export interface THProps {
    numSelected?: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof User) => void;
    onSelectAllClick?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount?: number;
  }