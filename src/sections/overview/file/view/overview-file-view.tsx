// @mui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { _folders, _files, _types } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import FileRecentItem from '../../../type-document/file-recent-item';
//
import FileManagerPanel from '../../../file-manager/file-manager-panel';
import { useGetTypes } from 'src/api/type';
import { useGetDocumentsActive } from 'src/api/document';
import { useGetUsers } from 'src/api/user';
import AppWelcome from '../../app/app-welcome';
import { SeoIllustration } from 'src/assets/illustrations';
import { useAuthContext } from 'src/auth/hooks';
import AppWidgetSummary from '../../app/app-widget-summary';
import FileDocumentItemRecent from 'src/sections/technical-documents/file-document-item-recent';
import FileDocumentRecent from 'src/sections/technical-documents/file-document-recent';
import { useMemo } from 'react';
import { Typography } from '@mui/material';
import Chart from 'react-apexcharts';

// ----------------------------------------------------------------------

export default function OverviewFileView() {
  const theme = useTheme();

  const settings = useSettingsContext();

  const { type } = useGetTypes();
  const { users } = useGetUsers();
  const { user } = useAuthContext();
  const { documentActive } = useGetDocumentsActive();

  const totalUsers = users?.length || 0;
  const totalDocuments = documentActive?.length || 0;
  const totalTypes = type?.length || 0;
  const totalActivities = documentActive?.length || 0;

  const getFileExtension = (file?: string) => {
    if (!file) return 'unknown';
    return file.split('.').pop()?.toLowerCase() || 'unknown';
  };

  const extensionSummary = useMemo(() => {
    const result: Record<string, number> = {};

    documentActive.forEach((doc: any) => {
      if (!doc.document_file) return;

      const ext = getFileExtension(doc.document_file);

      if (!result[ext]) {
        result[ext] = 0;
      }

      result[ext] += 1;
    });

    return result;
  }, [documentActive]);

  const getExtColor = (ext: string) => {
    switch (ext) {
      case 'pdf':
        return '#A31D1D';
      case 'doc':
      case 'docx':
        return '#134E8E';
      case 'xlsx':
        return '#347433';
      default:
        return '#757575';
    }
  };

  const formatExt = (ext: string) => {
    if (ext === 'pdf') return 'PDF Document';
    if (ext === 'docx') return 'Word Document';
    if (ext === 'doc') return 'Word Document';
    if (ext === 'xlsx') return 'Excel Spreadsheet';
    if (ext === 'unknown') return 'Unknown File';
    return ext.toUpperCase();
  };

  const chartSeries = useMemo(() => {
    return Object.values(extensionSummary);
  }, [extensionSummary]);

  const chartLabels = useMemo(() => {
    return Object.keys(extensionSummary).map((ext) => formatExt(ext));
  }, [extensionSummary]);

  const chartColors = useMemo(() => {
    return Object.keys(extensionSummary).map((ext) => getExtColor(ext));
  }, [extensionSummary]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid xs={12} md={12}>
            <AppWelcome
              title={`Welcome back 👋 ${user?.username}`}
              description={`You have ${totalDocuments} documents across ${totalTypes} types.`}
              img={<SeoIllustration />}
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total Users"
              total={totalUsers}
              icon={<Iconify icon="solar:users-group-rounded-bold" width={24} />}
              chart={{
                series: [5, 10, 8, 15, 20, 18],
              }}
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total Documents"
              total={totalDocuments}
              icon={<Iconify icon="solar:document-bold" width={24} />}
              chart={{
                series: [8, 12, 10, 25, 20, 30],
              }}
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Document Types"
              total={totalTypes}
              icon={<Iconify icon="solar:folder-with-files-bold" width={24} />}
              chart={{
                series: [2, 5, 8, 10, 12, 14],
              }}
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Activity Logs"
              total={totalActivities}
              icon={<Iconify icon="solar:clock-circle-bold" width={24} />}
              chart={{
                series: [1, 3, 5, 8, 12, 15],
              }}
            />
          </Grid>

          <Grid xs={12} md={6} lg={8}>
            <div>
              <FileManagerPanel
                title="Documents"
                link={paths.dashboard.technicalDocument.root}
                sx={{ mt: 3 }}
              />

              <Scrollbar>
                <Stack direction="row" spacing={2}>
                  <Grid container spacing={1}>
                    {documentActive.slice(0, 6).map((d: any) => (
                      <Grid key={d.id_technical_document} xs={12} sm={6} md={6}>
                        <FileDocumentRecent
                          file={{
                            id_technical_document: d.id_technical_document,
                            id_technical_document_activity: d.id_technical_document_activity,
                            document_number: d.document_number,
                            title: d.title,
                            created_at: d.created_at,
                            updated_at: d.updated_at,
                            typeDocument: {
                              id_type_document: d.id_type_document,
                              type_document: d.typeDocument.type_document,
                              code_document: d.typeDocument.code_document,
                            },
                            division: {
                              id_division: d.id_division,
                              division_name: d.division_name,
                              division_code: d.division_code,
                            },
                            document_file: d.document_file,
                            created_by: d.created_by,
                            flag_active: d.flag_active,
                            version_number: d.version_number,
                          }}
                          onEdit={() => console.info('EDIT', d.id_technical_document)}
                          onDelete={() => console.info('DELETE', d.id_technical_document)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              </Scrollbar>

              <FileManagerPanel
                title="Type Documents"
                link={paths.dashboard.typeDocument.root}
                sx={{ mt: 4 }}
              />

              <Stack spacing={2}>
                {type.slice(0, 5).map((file) => (
                  <FileRecentItem
                    key={file.id_type_document}
                    file={file}
                    onEdit={() => console.info('EDIT', file.id_type_document)}
                    onDelete={() => console.info('DELETE', file.id_type_document)}
                  />
                ))}
              </Stack>
            </div>
          </Grid>
          <Grid xs={12} md={6} lg={4}>
            <Grid xs={12}>
              <FileManagerPanel title="Document by Type" />
              <Box sx={{ mt: 2 }}>
                {chartSeries.length === 0 ? (
                  <Typography variant="body2">No document data</Typography>
                ) : (
                  <Chart
                    type="donut"
                    series={chartSeries}
                    options={{
                      labels: chartLabels,
                      colors: chartColors,
                      chart: {
                        fontFamily: theme.typography.fontFamily,
                        foreColor: theme.palette.text.secondary,
                      },
                      legend: {
                        position: 'bottom',
                      },
                      dataLabels: {
                        enabled: true,
                      },
                      tooltip: {
                        y: {
                          formatter: (val: number) => `${val} files`,
                        },
                      },
                      plotOptions: {
                        pie: {
                          donut: {
                            labels: {
                              show: true,
                              total: {
                                show: true,
                                label: 'Total',
                                fontSize: theme.typography.pxToRem(14),
                                formatter: () => `${totalDocuments}`,
                              },
                            },
                          },
                        },
                      },
                    }}
                    height={300}
                  />
                )}
              </Box>
            </Grid>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <FileManagerPanel title="Recent Activity" sx={{ mt: 3 }} />

              <Stack spacing={2}>
                {documentActive
                  .slice(0, 5)
                  .map((log) =>
                    log.id_technical_document_activity ? (
                      <FileDocumentItemRecent
                        key={log.created_by + log.created_at}
                        file={log}
                        onEdit={() => console.log('edit')}
                        onDelete={() => console.log('delete')}
                      />
                    ) : null
                  )}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
