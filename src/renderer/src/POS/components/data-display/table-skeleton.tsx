import { Skeleton, TableCell, TableRow } from '@mui/material'
import { memo, ReactNode } from 'react'

interface TableSkeletonProps {
  isLoading: boolean
  columns: number
  rows: number
  children: ReactNode
}

function TableSkeleton(props: TableSkeletonProps) {
  const { isLoading, columns, rows, children } = props
  if (isLoading) {
    return (
      <>
        {Array.from({ length: rows }).map((_, index) => (
          <TableRow key={index}>
            {Array.from({ length: columns }).map((_, index) => (
              <TableCell key={index}>
                <Skeleton />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </>
    )
  }
  return children
}

export default memo(TableSkeleton)

