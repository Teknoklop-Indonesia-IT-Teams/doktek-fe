import sumBy from 'lodash/sumBy';
import { useState, useCallback, useEffect } from 'react';
// @mui
import { useTheme, alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fTimestamp } from 'src/utils/format-time';
// _mock
import { DOCUMENT_DIVISION_OPTIONS } from 'src/_mock';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
  TableSkeleton,
} from 'src/components/table';
// types
import { IDocument, IDocumentTableFilters, IDocumentTableFilterValue } from 'src/types/document';
//
import DocumentsAnalytic from '../documents-analytic';
import DocumentsTableRow from '../documents-table-row';
import DocumentsTableToolbar from '../documents-table-toolbar';
import DocumentsTableFiltersResult from '../documents-table-filters-result';
import { useGetDocuments } from 'src/api/document';
import { useGetDivision } from 'src/api/division';
import { isEqual } from 'lodash';
import { deleterDoktek, epDoktek } from 'src/utils/axios-doktek';
import { enqueueSnackbar } from 'src/components/snackbar';
import { mutate } from 'swr';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'document_number', label: 'Doc Number' },
  { id: 'job_title', label: 'Job Title' },
  { id: 'created_at', label: 'Create' },
  { id: 'updated_at', label: 'Update' },
  { id: 'division', label: 'Division' },
  { id: '' },
];

const defaultFilters: IDocumentTableFilters = {
  document_number: '',
  job_title: '',
  id_division: 'all',
  created_at: null,
  updated_at: null,
};

// ----------------------------------------------------------------------

export default function DocumentsListView() {
  const theme = useTheme();

  const settings = useSettingsContext();

  const { document, documentLoading, documentEmpty } = useGetDocuments();
  const { division } = useGetDivision();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'id_technical_document', defaultOrder: 'desc' });

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<any[]>([]);

  const [filters, setFilters] = useState(defaultFilters);

  const divisionColors: Record<string, any> = {
    Automation: 'warning',
    Laboratory: 'success',
    RnD: 'error',
    'IT Enggineer': 'info',
    Finance: 'secondary',
  };

  useEffect(() => {
    if (document.length) {
      setTableData(document);
    }
  }, [document]);

  const dateError =
    filters.created_at && filters.updated_at
      ? filters.created_at.getTime() > filters.updated_at.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 76;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getDivisionLength = (divisionName: string) => {
    return tableData.filter((item) => item.division?.division_name === divisionName).length;
  };

  const getPercentByDivision = (divisionName: string) => {
    if (!tableData.length) return 0;
    return (getDivisionLength(divisionName) / tableData.length) * 100;
  };

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: tableData.length },
    ...division.map((d) => ({
      value: d.division_name,
      label: d.division_name,
      count: getDivisionLength(d.division_name),
      color: divisionColors[d.division_name] || 'default',
    })),
  ];

  const handleFilters = useCallback(
    (name: string, value: IDocumentTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    (id: string) => {
      const URL = epDoktek.document.details(id);
      deleterDoktek(URL)
        .then((res) => enqueueSnackbar('Delete Success', 'success' as any))
        .catch((e) => enqueueSnackbar(e, 'error' as any));
      mutate(epDoktek.document.list);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter(
      (row) => !table.selected.includes(row.id_technical_document)
    );
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.technicalDocument.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.technicalDocument.details(id));
    },
    [router]
  );

  const handleFilterDivision = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('id_division', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Documents',
              href: paths.dashboard.technicalDocument.root,
            },
            {
              name: 'List',
            },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.technicalDocument.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Documents
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <DocumentsAnalytic
                title="Total"
                total={tableData.length}
                percent={100}
                icon="solar:bill-list-bold-duotone"
                color={theme.palette.text.secondary}
              />

              <DocumentsAnalytic
                title="Automation"
                total={getDivisionLength('Automation')}
                percent={getPercentByDivision('Automation')}
                icon="solar:cpu-linear"
                color={theme.palette.warning.main}
              />

              <DocumentsAnalytic
                title="Laboratory"
                total={getDivisionLength('Laboratory')}
                percent={getPercentByDivision('Laboratory')}
                icon="entypo:lab-flask"
                color={theme.palette.success.main}
              />

              <DocumentsAnalytic
                title="RnD"
                total={getDivisionLength('RnD')}
                percent={getPercentByDivision('RnD')}
                icon="streamline-ultimate:factory-industrial-robot-arm-1"
                color={theme.palette.error.main}
              />

              <DocumentsAnalytic
                title="IT Engineer"
                total={getDivisionLength('IT Enggineer')}
                percent={getPercentByDivision('IT Enggineer')}
                icon="solar:laptop-line-duotone"
                color={theme.palette.info.main}
              />
              <DocumentsAnalytic
                title="Finance"
                total={getDivisionLength('Finance')}
                percent={getPercentByDivision('Finance')}
                icon="arcticons:home-finance"
                color={theme.palette.secondary.main}
              />
            </Stack>
          </Scrollbar>
        </Card>

        <Card>
          <Tabs
            value={filters.id_division}
            onChange={handleFilterDivision}
            sx={{
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition="end"
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.id_division) && 'filled') ||
                      'soft'
                    }
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>
          <DocumentsTableToolbar filters={filters} onFilters={handleFilters} />

          {canReset && (
            <DocumentsTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id_technical_document)
                )
              }
              action={
                <Stack direction="row">
                  <Tooltip title="Sent">
                    <IconButton color="primary">
                      <Iconify icon="iconamoon:send-fill" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Download">
                    <IconButton color="primary">
                      <Iconify icon="eva:download-outline" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Print">
                    <IconButton color="primary">
                      <Iconify icon="solar:printer-minimalistic-bold" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={confirm.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            />

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
                      tableData.map((row) => row.id_technical_document)
                    )
                  }
                />

                <TableBody>
                  {documentLoading ? (
                    [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {dataFiltered
                        .slice(
                          table.page * table.rowsPerPage,
                          table.page * table.rowsPerPage + table.rowsPerPage
                        )
                        .map((row) => (
                          <DocumentsTableRow
                            key={row.id_technical_document}
                            row={row}
                            divisionList={division}
                            selected={table.selected.includes(row.id_technical_document.toString())}
                            onSelectRow={() =>
                              table.onSelectRow(row.id_technical_document.toString())
                            }
                            onViewRow={() => handleViewRow(row.id_technical_document.toString())}
                            onEditRow={() => handleEditRow(row.id_technical_document.toString())}
                            onDeleteRow={() =>
                              handleDeleteRow(row.id_technical_document.toString())
                            }
                          />
                        ))}
                    </>
                  )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

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
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: IDocument[];
  comparator: (a: any, b: any) => number;
  filters: IDocumentTableFilters;
  dateError: boolean;
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

  // if (service.length) {
  //   inputData = inputData.filter((invoice) =>
  //     invoice.items.some((filterItem) => service.includes(filterItem.service))
  //   );
  // }

  if (!dateError) {
    if (created_at && updated_at) {
      inputData = inputData.filter(
        (document) =>
          fTimestamp(document.created_at) >= fTimestamp(created_at) &&
          fTimestamp(document.created_at) <= fTimestamp(updated_at)
      );
    }
  }

  return inputData;
}
