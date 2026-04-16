import { useState, useCallback, useEffect } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
  TableSkeleton,
} from 'src/components/table';
// types
import { IDivision, IDivisionTableFilters, IDivisionTableFilterValue } from 'src/types/division';
//
import DivisionTableRow from '../division-table-row';
import DivisionTableToolbar from '../division-table-toolbar';
import { useGetDivision } from 'src/api/division';
import { isEqual } from 'lodash';
import { deleterDoktek, epDoktek } from 'src/utils/axios-doktek';
import { enqueueSnackbar } from 'src/components/snackbar';
import { mutate } from 'swr';
import { width } from '@mui/system';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'no', label: 'Number', width: 80 },
  { id: 'division_name', label: 'Division', width: 200 },
  { id: 'division_code', label: 'Code Division', width: 150 },
  { id: '', width: 100 },
];

const defaultFilters: IDivisionTableFilters = {
  number: 0,
  name: '',
  code: '',
};

// ----------------------------------------------------------------------

export default function DivisionListView() {
  const settings = useSettingsContext();

  const { division, divisionLoading, divisionEmpty } = useGetDivision();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const [tableData, setTableData] = useState<IDivision[]>([]);

  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    if (division.length) {
      setTableData(division);
    }
  }, [division]);

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
    (name: string, value: IDivisionTableFilterValue) => {
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
      const URL = epDoktek.division.details(id);
      deleterDoktek(URL)
        .then((res) => enqueueSnackbar('Delete Success', 'success' as any))
        .catch((e) => enqueueSnackbar(e, 'error' as any));
      mutate(epDoktek.division.list);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table]
  );

  const handleEditRow = useCallback(
    (id_division: string) => {
      router.push(paths.dashboard.division.edit(id_division));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id_division: string) => {
      router.push(paths.dashboard.division.details(id_division));
    },
    [router]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="List"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.general.file,
          },
          {
            name: 'Division',
            href: paths.dashboard.division.root,
          },
          {
            name: 'List',
          },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.division.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Division
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card>
        <DivisionTableToolbar filters={filters} onFilters={handleFilters} />

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                onSort={table.onSort}
              />

              <TableBody>
                {divisionLoading ? (
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
                      .map((row, index) => (
                        <DivisionTableRow
                          key={row.id_division}
                          row={row}
                          index={table.page * table.rowsPerPage + index}
                          // onViewRow={() => handleViewRow(row.id_division)}
                          onEditRow={() => handleEditRow(row.id_division)}
                          onDeleteRow={() => handleDeleteRow(row.id_division)}
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
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IDivision[];
  comparator: (a: any, b: any) => number;
  filters: IDivisionTableFilters;
}) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (divisions) => divisions.division_name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}
