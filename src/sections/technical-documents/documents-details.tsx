import { format } from 'date-fns';
import { useState, useCallback } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
// utils
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
// types
import {
  IDocument,
  IDocumentItem,
  IDocumentItemTableFilters,
  IDocumentTableFilters,
} from 'src/types/document';
// components
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
//
import DocumentsToolbar from './documents-toolbar';
import { IDivision } from 'src/types/division';
import { useBoolean } from 'src/hooks/use-boolean';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Button from '@mui/material/Button';
import { Checkbox, IconButton, Link, ListItemText, MenuItem } from '@mui/material';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useGetDivision } from 'src/api/division';
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  useTable,
} from 'src/components/table';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useGetType, useGetTypes } from 'src/api/type';
import { useGetDocumentItems, useGetDocumentItemsLog, useGetDocuments } from 'src/api/document';
import LoadingButton from '@mui/lab/LoadingButton';
import { deleterDoktek, epDoktek } from 'src/utils/axios-doktek';
import { enqueueSnackbar } from 'src/components/snackbar';
import { mutate } from 'swr';
import { isEqual } from 'lodash';
import DocumentItemsTableRow from './document-items-table-row';
// ----------------------------------------------------------------------

type Props = {
  documents: IDocument;
  onEditItem?: (item: IDocumentItem) => void;
};

const TABLE_HEAD = [
  { id: 'document_number', label: 'Doc Number' },
  { id: 'id_type_document', label: 'Type Document' },
  { id: 'document_file', label: 'Upload' },
  { id: 'created_at', label: 'Create At' },
  { id: 'updated_at', label: 'Update At' },
  { id: '' },
];

const defaultFilters: IDocumentItemTableFilters = {
  document_number: '',
  document_file: '',
  id_type_document: '',
  id_technical_document: '',
  created_at: null,
  updated_at: null,
};

export default function DocumentDetails({ documents, onEditItem }: Props) {
  if (!documents) return null;
  const { division } = useGetDivision();
  const { type } = useGetTypes();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const { documentItem, documentItemEmpty, documentItemLoading } = useGetDocumentItems();
  const { documentItemsLog } = useGetDocumentItemsLog();
  const [selectedRow, setSelectedRow] = useState<IDocumentItem | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [filters, setFilters] = useState(defaultFilters);

  const tableData: IDocumentItem[] =
    documentItem?.filter(
      (item) =>
        item.technicalDocument.id_technical_document === documents.id_technical_document ||
        item.technicalDocument?.id_technical_document === documents.id_technical_document
    ) || [];

  const { document_number, job_title, created_at, updated_at } = documents;
  const divisionObj = division.find((d) => d.id_division === documents.division.id_division);
  console.log('documentItem:', documentItem);
  console.log('documents:', documents);
  console.log('TABLE DATA', tableData);

  const confirm = useBoolean();
  const router = useRouter();

  const popover = usePopover();
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });
  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 76;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name: string, value: IDocumentItemTableFilters) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );
  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.technicalDocument.item.edit(id));
    },
    [router]
  );

  const handleDeleteItem = useCallback(
    (id: string) => {
      const URL = epDoktek.documentItem.details(id);
      deleterDoktek(URL)
        .then((res) => enqueueSnackbar('Delete Success', 'success' as any))
        .catch((e) => enqueueSnackbar(e, 'error' as any));
      mutate(epDoktek.documentItem.list);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table]
  );
  const activityLogs =
    documentItemsLog?.filter(
      (log) =>
        log.technicalDocumentItem?.document_number &&
        tableData.some(
          (item) =>
            item.id_technical_document_item === log.technicalDocumentItem.id_technical_document_item
        )
    ) || [];

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Stack spacing={3}>
            <Card>
              <Stack sx={{ p: 3 }}>
                <ListItemText
                  sx={{ mb: 1 }}
                  primary={document_number}
                  secondary={`Posted date: ${fDate(created_at)}`}
                  primaryTypographyProps={{ typography: 'subtitle1' }}
                  secondaryTypographyProps={{
                    mt: 1,
                    component: 'span',
                    typography: 'caption',
                    color: 'text.disabled',
                  }}
                />

                <Stack direction="row" spacing={1} alignItems="center">
                  <Iconify width={16} icon="hugeicons:job-search" />
                  <Typography variant="body2">{job_title}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Iconify width={16} icon="solar:buildings-2-bold" />
                  <Typography variant="body2" color="text.secondary">
                    {divisionObj?.division_name}
                  </Typography>
                </Stack>
              </Stack>
            </Card>

            <Card>
              <Stack sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Activity Log
                </Typography>

                <Stack
                  spacing={2}
                  sx={{
                    maxHeight: 300,
                    overflowY: 'auto',
                    pr: 1,
                  }}
                >
                  {activityLogs.map((log) => (
                    <Stack
                      key={log.id_technical_document_item_log}
                      direction="row"
                      spacing={2}
                      alignItems="flex-start"
                    >
                      <Iconify icon="solar:clock-circle-bold" width={18} />

                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {log.activity}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          {log.note}
                        </Typography>

                        <Typography variant="caption" color="text.disabled">
                          by {log.users?.username} •{' '}
                          {format(new Date(log.created_at), 'dd MMM yyyy HH:mm')}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </Grid>

        <Grid item xs={12} md={9}>
          <Card>
            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <Scrollbar>
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        tableData.map((row) => row.id_technical_document_item.toString())
                      )
                    }
                  />

                  <TableBody>
                    {documentItemLoading ? (
                      [...Array(table.rowsPerPage)].map((_, index) => (
                        <TableSkeleton key={index} sx={{ height: denseHeight }} />
                      ))
                    ) : (
                      <>
                        {dataFiltered
                          .slice(
                            table.page * table.rowsPerPage,
                            table.page * table.rowsPerPage + table.rowsPerPage
                          )
                          .map((row, index) => (
                            <DocumentItemsTableRow
                              key={row.id_technical_document_item}
                              row={row}
                              typeList={type || []}
                              index={table.page * table.rowsPerPage + index}
                              selected={table.selected.includes(
                                row.id_technical_document_item.toString()
                              )}
                              onSelectRow={() =>
                                table.onSelectRow(row.id_technical_document_item.toString())
                              }
                              onViewRow={() => {}}
                              onEditRow={() => onEditItem?.(row)}
                              onDeleteRow={() =>
                                handleDeleteItem(row.id_technical_document_item.toString())
                              }
                            />
                          ))}

                        <TableEmptyRows
                          height={denseHeight}
                          emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                        />

                        <TableNoData notFound={notFound} />
                      </>
                    )}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>
            <CustomPopover
              open={popover.open}
              onClose={popover.onClose}
              arrow="right-top"
              sx={{ width: 160 }}
            >
              <MenuItem
                onClick={() => {
                  if (selectedRow) {
                    onEditItem?.(selectedRow);
                  }
                  popover.onClose();
                }}
              >
                <Iconify icon="solar:pen-bold" /> Edit
              </MenuItem>

              <Divider sx={{ borderStyle: 'dashed' }} />

              <MenuItem
                onClick={() => {
                  confirm.onTrue();
                  popover.onClose();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon="solar:trash-bin-trash-bold" /> Delete
              </MenuItem>
            </CustomPopover>
            <ConfirmDialog
              open={confirm.value}
              onClose={confirm.onFalse}
              title="Delete"
              content="Are you sure want to delete?"
              action={
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    if (selectedRow) {
                      handleDeleteItem(selectedRow.id_technical_document_item.toString());
                    }
                  }}
                >
                  Delete
                </Button>
              }
            />
            <TablePaginationCustom
              count={dataFiltered.length}
              page={table.page}
              rowsPerPage={table.rowsPerPage}
              onPageChange={table.onChangePage}
              onRowsPerPageChange={table.onChangeRowsPerPage}
              //
              dense={table.dense}
              onChangeDense={table.onChangeDense}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IDocumentItem[];
  comparator: (a: any, b: any) => number;
  filters: IDocumentItemTableFilters;
}) {
  const {
    document_number,
    document_file,
    id_type_document,
    id_technical_document,
    created_at,
    updated_at,
  } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (document_number) {
    inputData = inputData.filter(
      (document) =>
        document.document_number.toLowerCase().indexOf(document_number.toLowerCase()) !== -1
    );
  }

  // if (id_division && id_division !== 'all') {
  //   inputData = inputData.filter((document) => document.division?.division_name === id_division);
  // }

  return inputData;
}
