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
// _mock
import { INVOICE_STATUS_OPTIONS } from 'src/_mock';
// types
import { IDocument, IDocumentItem, IDocumentTableFilters } from 'src/types/document';
// components
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
//
import DocumentsToolbar from './documents-toolbar';
import { IDivision } from 'src/types/division';
import { useBoolean } from 'src/hooks/use-boolean';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { Button, Checkbox, IconButton, Link, ListItemText, MenuItem } from '@mui/material';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useGetDivision } from 'src/api/division';
import { getComparator, TableHeadCustom, useTable } from 'src/components/table';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useGetType, useGetTypes } from 'src/api/type';
import { useGetDocumentItems, useGetDocuments } from 'src/api/document';
import LoadingButton from '@mui/lab/LoadingButton';
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

export default function DocumentDetails({ documents, onEditItem }: Props) {
  if (!documents) return null;
  const { division } = useGetDivision();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const { documentItem } = useGetDocumentItems();
  const [selectedRow, setSelectedRow] = useState<IDocumentItem | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [downloadLoadingId, setDownloadLoadingId] = useState<number | null>(null);

  const tableData: IDocumentItem[] =
    documentItem?.filter(
      (item) => item.technicalDocument?.id_technical_document === documents.id_technical_document
    ) || [];

  const { document_number, job_title, created_at, updated_at } = documents;
  const divisionObj = division.find((d) => d.id_division === documents.division.id_division);

  const confirm = useBoolean();
  const router = useRouter();

  const popover = usePopover();
  // const dataFiltered = applyFilter({
  //   inputData: tableData,
  //   comparator: getComparator(table.order, table.orderBy),
  //   filters,
  // });
  // const dataInPage = dataFiltered.slice(
  //   table.page * table.rowsPerPage,
  //   table.page * table.rowsPerPage + table.rowsPerPage
  // );

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.technicalDocument.item.edit(id));
    },
    [router]
  );

  // const handleDeleteRow = useCallback(
  //   (id: string) => {
  //     const deleteRow = tableData.filter((row) => row.id_technical_document.toString() !== id);
  //     setTableData(deleteRow);

  //     table.onUpdatePageDeleteRow(dataInPage.length);
  //   },
  //   [dataInPage.length, table, tableData]
  // );
  const handleViewFile = (row: IDocumentItem) => {
    const file = row.document_file?.toString();

    if (!file) return;

    const fileUrl = typeof file === 'string' ? file : URL.createObjectURL(file);

    window.open(fileUrl, '_blank');
  };

  const handleDownloadFile = (row: IDocumentItem) => {
    const file = row.document_file?.toString();

    if (!file) return;

    const fileUrl = typeof file === 'string' ? file : URL.createObjectURL(file);

    const link = document.createElement('a');
    link.href = fileUrl;

    const fileName = typeof file === 'string' ? file.split('/').pop() : file;

    link.download = fileName || 'document';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {/* LEFT SIDE */}
        <Grid item xs={12} md={3}>
          <Stack spacing={3}>
            {/* DOCUMENT INFO */}
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
                  <Iconify width={16} icon="solar:users-group-rounded-bold" />
                  <Typography variant="body2">{job_title}</Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  {divisionObj?.division_name}
                </Typography>
              </Stack>
            </Card>

            {/* ACTIVITY LOG */}
            <Card>
              <Stack sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Activity Log
                </Typography>

                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Iconify icon="solar:clock-circle-bold" width={18} />
                    <Box>
                      <Typography variant="body2">Document Created</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(created_at), 'dd MMM yyyy HH:mm')}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider />

                  <Stack direction="row" spacing={2} alignItems="center">
                    <Iconify icon="solar:pen-bold" width={18} />
                    <Box>
                      <Typography variant="body2">Last Updated</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(updated_at), 'dd MMM yyyy HH:mm')}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </Grid>

        {/* RIGHT SIDE - TABLE */}
        <Grid item xs={12} md={9}>
          <Card>
            <TableContainer>
              <Scrollbar>
                <Table size={table.dense ? 'small' : 'medium'}>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                  />

                  <TableBody>
                    {tableData.map((row) => (
                      <>
                        <TableRow hover key={row.id_technical_document_item}>
                          <TableCell>
                            <Typography variant="body2" noWrap>
                              {row.document_number}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Label variant="soft">{row.typeDocument?.code_document}</Label>
                          </TableCell>

                          <TableCell>
                            {row.document_file ? (
                              <Stack direction="row" spacing={1}>
                                <LoadingButton
                                  size="small"
                                  variant="outlined"
                                  startIcon={<Iconify icon="solar:eye-bold" />}
                                  onClick={() => handleViewFile(row)}
                                >
                                  View
                                </LoadingButton>

                                <LoadingButton
                                  size="small"
                                  variant="contained"
                                  startIcon={<Iconify icon="solar:download-bold" />}
                                  onClick={() => handleDownloadFile(row)}
                                >
                                  Download
                                </LoadingButton>
                              </Stack>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                No File
                              </Typography>
                            )}
                          </TableCell>

                          <TableCell>{format(new Date(row.created_at), 'dd MMM yyyy')}</TableCell>

                          <TableCell>{format(new Date(row.updated_at), 'dd MMM yyyy')}</TableCell>

                          <TableCell align="right">
                            <IconButton
                              onClick={(e) => {
                                setSelectedRow(row);
                                popover.onOpen(e);
                              }}
                            >
                              <Iconify icon="eva:more-vertical-fill" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
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
                              if (selectedRow) {
                                confirm.onTrue();
                              }
                              popover.onClose();
                            }}
                            sx={{ color: 'error.main' }}
                          >
                            <Iconify icon="solar:trash-bin-trash-bold" /> Delete
                          </MenuItem>
                        </CustomPopover>
                      </>
                    ))}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

// ----------------------------------------------------------------------

// function applyFilter({
//   inputData,
//   comparator,
//   filters,
// }: {
//   inputData: IDocument[];
//   comparator: (a: any, b: any) => number;
//   filters: IDocumentTableFilters;
// }) {
//   const { document_number, job_title, created_at, updated_at, id_division } = filters;

//   const stabilizedThis = inputData.map((el, index) => [el, index] as const);

//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });

//   inputData = stabilizedThis.map((el) => el[0]);

//   if (document_number) {
//     inputData = inputData.filter(
//       (document) =>
//         document.document_number.toLowerCase().indexOf(document_number.toLowerCase()) !== -1
//     );
//   }

//   if (id_division && id_division !== 'all') {
//     inputData = inputData.filter((document) => document.division?.division_name === id_division);
//   }

//   return inputData;
// }
