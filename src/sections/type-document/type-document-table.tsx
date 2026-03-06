// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { tableCellClasses } from '@mui/material/TableCell';
import { tablePaginationClasses } from '@mui/material/TablePagination';
// types
import { ITypeManager } from 'src/types/type';
// components
import Iconify from 'src/components/iconify';
import {
  emptyRows,
  TableProps,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
  TableSkeleton,
} from 'src/components/table';
//
import TypeDocumentTableRow from './type-document-table-row';
import { useGetType, useGetTypes } from 'src/api/type';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'type_document', label: 'Type Document', width: 120 },
  { id: 'code_document', label: 'Code Document', width: 120 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

type Props = {
  table: TableProps;
  tableData: ITypeManager[];
  notFound: boolean;
  dataFiltered: ITypeManager[];
  onEditRow: (id: string) => void;
  onOpenConfirm: VoidFunction;
  onDeleteRow: (id: string) => void;
};

export default function TypeDocumentTable({
  table,
  tableData,
  notFound,
  onDeleteRow,
  dataFiltered,
  onEditRow,
  onOpenConfirm,
}: Props) {
  const theme = useTheme();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    //
    selected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = table;

  const denseHeight = dense ? 58 : 78;
  const { type, typeLoading, typeEmpty } = useGetTypes();
  console.log('ID', tableData);
  return (
    <>
      <Box
        sx={{
          position: 'relative',
          m: theme.spacing(-2, -3, -3, -3),
        }}
      >
        <TableSelectedAction
          dense={dense}
          numSelected={selected.length}
          rowCount={tableData.length}
          onSelectAllRows={(checked) =>
            onSelectAllRows(
              checked,
              tableData.map((row) => row.id_type_document)
            )
          }
          action={
            <>
              <Tooltip title="Share">
                <IconButton color="primary">
                  <Iconify icon="solar:share-bold" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete">
                <IconButton color="primary" onClick={onOpenConfirm}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            </>
          }
          sx={{
            pl: 1,
            pr: 2,
            top: 16,
            left: 24,
            right: 24,
            width: 'auto',
            borderRadius: 1.5,
          }}
        />

        <TableContainer
          sx={{
            p: theme.spacing(0, 3, 3, 3),
          }}
        >
          <Table
            size={dense ? 'small' : 'medium'}
            sx={{
              minWidth: 960,
              borderCollapse: 'separate',
              borderSpacing: '0 16px',
            }}
          >
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData.length}
              numSelected={selected.length}
              onSort={onSort}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id_type_document)
                )
              }
              sx={{
                [`& .${tableCellClasses.head}`]: {
                  '&:first-of-type': {
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                  },
                  '&:last-of-type': {
                    borderTopRightRadius: 12,
                    borderBottomRightRadius: 12,
                  },
                },
              }}
            />

            <TableBody>
              {typeLoading ? (
                [...Array(table.rowsPerPage)].map((i, index) => (
                  <TableSkeleton key={index} sx={{ height: denseHeight }} />
                ))
              ) : (
                <>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TypeDocumentTableRow
                        key={row.id_type_document}
                        row={row}
                        selected={selected.includes(row.id_type_document)}
                        onSelectRow={() => onSelectRow(row.id_type_document)}
                        onEditRow={() => onEditRow(row.id_type_document)}
                        onDeleteRow={() => onDeleteRow(row.id_type_document)}
                      />
                    ))}
                </>
              )}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
              />

              <TableNoData
                notFound={notFound}
                sx={{
                  m: -2,
                  borderRadius: 1.5,
                  border: `dashed 1px ${theme.palette.divider}`,
                }}
              />
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <TablePaginationCustom
        count={dataFiltered.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        //
        dense={dense}
        onChangeDense={onChangeDense}
        sx={{
          [`& .${tablePaginationClasses.toolbar}`]: {
            borderTopColor: 'transparent',
          },
        }}
      />
    </>
  );
}
