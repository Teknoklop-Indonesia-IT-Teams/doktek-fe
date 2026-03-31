import { useState, useCallback, useEffect } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
// utils
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { fileFormat } from 'src/components/file-thumbnail';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import { useTable, getComparator } from 'src/components/table';
// types
import { ITypeDocument, ITypeFilters, ITypeFilterValue } from 'src/types/type';
//
import TypeDocumentTable from '../type-document-table';
import TypeDocumentFilters from '../type-document-filters';
import TypeDocumentGridView from '../type-document-grid-view';
import TypeDocumentFiltersResult from '../type-document-filters-result';
import TypeDocumentNewFolderDialog from '../type-document-new-folder-dialog';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useGetTypes } from 'src/api/type';
import { isEqual } from 'lodash';
import { useRouter } from 'src/routes/hooks';
import { deleterDoktek, epDoktek } from 'src/utils/axios-doktek';
import { enqueueSnackbar } from 'src/components/snackbar';
import { mutate } from 'swr';

// ----------------------------------------------------------------------

const defaultFilters: ITypeFilters = {
  type_document: '',
  code_document: [],
};

// ----------------------------------------------------------------------

export default function TypeDocumentView() {
  const table = useTable({ defaultRowsPerPage: 10 });

  const settings = useSettingsContext();

  const confirm = useBoolean();
  const router = useRouter();

  const [view, setView] = useState('list');

  const { type, typeLoading, typeEmpty } = useGetTypes();

  const [tableData, setTableData] = useState<ITypeDocument[]>([]);

  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    if (type.length) {
      setTableData(type);
    }
  }, [type]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const codeDocumentOptions = Array.from(new Set(type.map((item) => item.code_document)));

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || typeEmpty;

  const handleChangeView = useCallback(
    (event: React.MouseEvent<HTMLElement>, newView: string | null) => {
      if (newView !== null) {
        setView(newView);
      }
    },
    []
  );

  const handleFilters = useCallback(
    (name: string, value: ITypeFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteItem = useCallback(async (id: string) => {
    try {
      const URL = epDoktek.type.details(id);

      await deleterDoktek(URL); // ✅ tunggu selesai

      enqueueSnackbar('Delete Success', { variant: 'success' });

      await mutate(epDoktek.type.list); // ✅ refresh data
    } catch (error) {
      enqueueSnackbar('Delete Failed', { variant: 'error' });
    }
  }, []);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.typeDocument.edit(id));
    },
    [router]
  );

  const handleDeleteItems = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id_type_document));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const renderFilters = (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
    >
      <TypeDocumentFilters
        filters={filters}
        onFilters={handleFilters}
        //
        typeOptions={codeDocumentOptions}
      />

      <ToggleButtonGroup size="small" value={view} exclusive onChange={handleChangeView}>
        <ToggleButton value="list">
          <Iconify icon="solar:list-bold" />
        </ToggleButton>

        <ToggleButton value="grid">
          <Iconify icon="mingcute:dot-grid-fill" />
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );

  const renderResults = (
    <TypeDocumentFiltersResult
      filters={filters}
      onResetFilters={handleResetFilters}
      //
      canReset={canReset}
      onFilters={handleFilters}
      //
      results={dataFiltered.length}
    />
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4">Type Document</Typography>
          <Button
            component={RouterLink}
            href={paths.dashboard.typeDocument.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Type Document
          </Button>
        </Stack>

        <Stack
          spacing={2.5}
          sx={{
            my: { xs: 3, md: 5 },
          }}
        >
          {renderFilters}

          {canReset && renderResults}
        </Stack>

        {notFound ? (
          <EmptyContent
            filled
            title="No Data"
            sx={{
              py: 10,
            }}
          />
        ) : (
          <>
            {view === 'list' ? (
              <TypeDocumentTable
                table={table}
                tableData={tableData}
                dataFiltered={dataFiltered}
                onDeleteRow={handleDeleteItem}
                onEditRow={handleEditRow}
                notFound={notFound}
                onOpenConfirm={confirm.onTrue}
              />
            ) : (
              <TypeDocumentGridView
                table={table}
                data={tableData}
                dataFiltered={dataFiltered}
                onDeleteItem={handleDeleteItem}
                onEditItem={handleEditRow}
                onOpenConfirm={confirm.onTrue}
              />
            )}
          </>
        )}
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
              handleDeleteItems();
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
}: {
  inputData: ITypeDocument[];
  comparator: (a: any, b: any) => number;
  filters: ITypeFilters;
}) {
  const { type_document, code_document } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (type_document) {
    inputData = inputData.filter(
      (file) => file.type_document.toLowerCase().indexOf(type_document.toLowerCase()) !== -1
    );
  }

  if (code_document.length) {
    inputData = inputData.filter((file) => code_document.includes(fileFormat(file.code_document)));
  }

  return inputData;
}
