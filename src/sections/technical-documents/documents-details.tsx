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
};

const TABLE_HEAD = [
  { id: 'document_number', label: 'Doc Number' },
  { id: 'id_type_document', label: 'Type Document' },
  { id: 'upload_doc', label: 'Upload' },
  { id: 'created_at', label: 'Create At' },
  { id: 'updated_at', label: 'Update At' },
  { id: '' },
];

export default function DocumentDetails({ documents }: Props) {
  if (!documents) return null;
  const { division } = useGetDivision();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const { documentItem } = useGetDocumentItems();
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
      router.push(paths.dashboard.techincalDocument.item.edit(id));
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
    setLoadingId(row.id_technical_document_item);

    setTimeout(() => {
      const file = row.upload_doc?.[0];

      if (!file) return;

      const url = typeof file === 'string' ? file : URL.createObjectURL(file);

      window.open(url, '_blank');

      setLoadingId(null);
    }, 500);
  };

  const handleDownloadFile = (row: IDocumentItem) => {
    const file = row.upload_doc?.[0];
    if (!file) return;

    setDownloadLoadingId(row.id_technical_document_item);

    setTimeout(() => {
      const url = typeof file === 'string' ? file : URL.createObjectURL(file);

      const link = document.createElement('a');
      link.href = url;
      link.download = row.document_number || 'document';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadLoadingId(null);
    }, 500);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid>
            <Card>
              {/* <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
                <Iconify icon="eva:more-vertical-fill" />
              </IconButton> */}

              <Stack sx={{ p: 3, pb: 2 }}>
                {/* <Avatar
              alt={company.name}
              src={company.logo}
              variant="rounded"
              sx={{ width: 48, height: 48, mb: 2 }}
            /> */}

                <ListItemText
                  sx={{ mb: 1 }}
                  primary={
                    // <Link component={RouterLink} href={paths.dashboard.job.details(id)} color="inherit">
                    document_number
                    // </Link>
                  }
                  secondary={`Posted date: ${fDate(created_at)}`}
                  primaryTypographyProps={{
                    typography: 'subtitle1',
                  }}
                  secondaryTypographyProps={{
                    mt: 1,
                    component: 'span',
                    typography: 'caption',
                    color: 'text.disabled',
                  }}
                />

                <Stack
                  spacing={0.5}
                  direction="row"
                  alignItems="center"
                  sx={{ color: 'primary.main', typography: 'caption' }}
                >
                  <Iconify width={16} icon="solar:users-group-rounded-bold" />
                  {job_title}
                </Stack>
                <Stack
                  spacing={0.5}
                  direction="row"
                  alignItems="center"
                  sx={{ color: 'primary.main', typography: 'caption' }}
                >
                  {divisionObj?.division_name}
                </Stack>
              </Stack>

              {/* <Divider sx={{ borderStyle: 'dashed' }} /> */}
            </Card>
          </Grid>
          <Grid spacing={2} marginLeft={5}>
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
                      // onSelectAllRows={(checked) =>
                      //   table.onSelectAllRows(
                      //     checked,
                      //     tableData.map((row) => row.id_technical_document)
                      //   )
                      // }
                    />
                    <TableBody>
                      {tableData.map((row) => {
                        console.log('ROW', row);

                        return (
                          <>
                            <TableRow hover>
                              <TableCell>
                                <ListItemText
                                  disableTypography
                                  primary={
                                    <Typography variant="body2" noWrap>
                                      {row.document_number}
                                    </Typography>
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <ListItemText
                                  disableTypography
                                  primary={
                                    <Label
                                      variant="soft"
                                      color={
                                        (row.typeDocument?.code_document === 'SOP' && 'success') ||
                                        (row.typeDocument?.code_document === 'Manual Book' &&
                                          'warning') ||
                                        (row.typeDocument?.code_document === 'MTG' && 'error') ||
                                        (row.typeDocument?.code_document === 'CER' && 'info') ||
                                        (row.typeDocument?.code_document === 'Technical' &&
                                          'secondary') ||
                                        'default'
                                      }
                                    >
                                      {row.typeDocument?.code_document}
                                    </Label>
                                  }
                                />
                              </TableCell>

                              <TableCell>
                                {row.upload_doc ? (
                                  <Stack direction="row" spacing={1}>
                                    <LoadingButton
                                      variant="outlined"
                                      size="small"
                                      startIcon={<Iconify icon="solar:eye-bold" />}
                                      loading={loadingId === row.id_technical_document_item}
                                      onClick={() => handleViewFile(row)}
                                    >
                                      View
                                    </LoadingButton>

                                    <LoadingButton
                                      variant="contained"
                                      size="small"
                                      startIcon={<Iconify icon="solar:download-bold" />}
                                      loading={downloadLoadingId === row.id_technical_document_item}
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

                              <TableCell>
                                <ListItemText
                                  primary={format(new Date(row.created_at), 'dd MMM yyyy')}
                                  secondary={format(new Date(row.created_at), 'p')}
                                  primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                                  secondaryTypographyProps={{
                                    mt: 0.5,
                                    component: 'span',
                                    typography: 'caption',
                                  }}
                                />
                              </TableCell>

                              <TableCell>
                                <ListItemText
                                  primary={format(new Date(row.updated_at), 'dd MMM yyyy')}
                                  secondary={format(new Date(row.updated_at), 'p')}
                                  primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                                  secondaryTypographyProps={{
                                    mt: 0.5,
                                    component: 'span',
                                    typography: 'caption',
                                  }}
                                />
                              </TableCell>

                              <TableCell align="right" sx={{ px: 1 }}>
                                <IconButton
                                  color={popover.open ? 'inherit' : 'default'}
                                  onClick={popover.onOpen}
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
                                  () => handleEditRow(row.id_technical_document_item.toString());
                                  popover.onClose();
                                }}
                              >
                                <Iconify icon="solar:pen-bold" />
                                Edit
                              </MenuItem>

                              <Divider sx={{ borderStyle: 'dashed' }} />

                              <MenuItem
                                onClick={() => {
                                  confirm.onTrue();
                                  popover.onClose();
                                }}
                                sx={{ color: 'error.main' }}
                              >
                                <Iconify icon="solar:trash-bin-trash-bold" />
                                Delete
                              </MenuItem>
                            </CustomPopover>
                          </>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>
            </Card>

            {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={handleDeleteRow}>
            Delete
          </Button>
        }
      /> */}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IDocument[];
  comparator: (a: any, b: any) => number;
  filters: IDocumentTableFilters;
}) {
  const { document_number, job_title, created_at, updated_at, id_division } = filters;

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

  if (id_division && id_division !== 'all') {
    inputData = inputData.filter((document) => document.division?.division_name === id_division);
  }

  return inputData;
}
