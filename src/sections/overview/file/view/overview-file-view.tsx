import { useState, useCallback, useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { _folders, _files, _types } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { UploadBox } from 'src/components/upload';
import { useSettingsContext } from 'src/components/settings';
import FileRecentItem from '../../../type-document/file-recent-item';
import FileDataActivity from '../../../file-manager/file-data-activity';
import FileStorageOverview from '../../../file-manager/file-storage-overview';
//
import FileManagerPanel from '../../../file-manager/file-manager-panel';
import FileManagerFolderItem from '../../../file-manager/file-manager-folder-item';
import FileManagerNewFolderDialog from '../../../file-manager/file-manager-new-folder-dialog';
import { useGetTypes } from 'src/api/type';
import { ITypeDocument } from 'src/types/type';
import { useGetDocumentItemsLog, useGetDocuments } from 'src/api/document';
import { useGetUsers } from 'src/api/user';
import AppWelcome from '../../app/app-welcome';
import { SeoIllustration } from 'src/assets/illustrations';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { Button } from '@mui/material';
import { useAuthContext } from 'src/auth/hooks';
import AppWidgetSummary from '../../app/app-widget-summary';
import FileDocumentItemRecent from 'src/sections/technical-documents/file-document-item-recent';
import FileDocumentRecent from 'src/sections/technical-documents/file-document-recent';

// ----------------------------------------------------------------------

const GB = 1000000000 * 24;

const TIME_LABELS = {
  week: ['Mon', 'Tue', 'Web', 'Thu', 'Fri', 'Sat', 'Sun'],
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  year: ['2018', '2019', '2020', '2021', '2022'],
};

// ----------------------------------------------------------------------

export default function OverviewFileView() {
  const theme = useTheme();

  const smDown = useResponsive('down', 'sm');

  const settings = useSettingsContext();

  const [folderName, setFolderName] = useState('');

  const [files, setFiles] = useState<(File | string)[]>([]);

  const newFolder = useBoolean();

  const upload = useBoolean();

  const { type } = useGetTypes();
  const { document } = useGetDocuments();
  const { users } = useGetUsers();
  const { user } = useAuthContext();
  const { documentItemsLog } = useGetDocumentItemsLog();

  const totalUsers = users?.length || 0;
  const totalDocuments = document?.length || 0;
  const totalTypes = type?.length || 0;
  const totalActivities = documentItemsLog?.length || 0;

  const divisions = Array.from(
    new Set(
      documentItemsLog
        ?.map((log) => log?.technicalDocumentItem?.technicalDocument?.division?.division_name)
        .filter(Boolean) || []
    )
  );
  const divisionCounts = divisions.map(
    (division) =>
      documentItemsLog?.filter(
        (log) => log?.technicalDocumentItem?.technicalDocument?.division?.division_name === division
      ).length || 0
  );

  const weekMap: Record<string, number> = {};
  const monthMap: Record<string, number> = {};
  const yearMap: Record<string, number> = {};

  (documentItemsLog || []).forEach((item: any) => {
    const date = new Date(item.created_at);

    const week = `Week ${Math.ceil(date.getDate() / 7)}`;
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString();

    weekMap[week] = (weekMap[week] || 0) + 1;
    monthMap[month] = (monthMap[month] || 0) + 1;
    yearMap[year] = (yearMap[year] || 0) + 1;
  });

  const weekLabels = Object.keys(weekMap);
  const weekData = Object.values(weekMap);

  const monthLabels = Object.keys(monthMap);
  const monthData = Object.values(monthMap);

  const yearLabels = Object.keys(yearMap);
  const yearData = Object.values(yearMap);

  const handleChangeFolderName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(event.target.value);
  }, []);

  const handleCreateNewFolder = useCallback(() => {
    newFolder.onFalse();
    setFolderName('');
    console.info('CREATE NEW FOLDER');
  }, [newFolder]);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFiles([...files, ...newFiles]);
    },
    [files]
  );

  const renderStorageOverview = (
    <FileStorageOverview
      total={GB}
      chart={{
        series: 76,
      }}
      data={[
        {
          name: 'Images',
          usedStorage: GB / 2,
          filesCount: 223,
          icon: <Box component="img" src="/assets/icons/files/ic_img.svg" />,
        },
        {
          name: 'Media',
          usedStorage: GB / 5,
          filesCount: 223,
          icon: <Box component="img" src="/assets/icons/files/ic_video.svg" />,
        },
        {
          name: 'Documents',
          usedStorage: GB / 5,
          filesCount: 223,
          icon: <Box component="img" src="/assets/icons/files/ic_document.svg" />,
        },
        {
          name: 'Other',
          usedStorage: GB / 10,
          filesCount: 223,
          icon: <Box component="img" src="/assets/icons/files/ic_file.svg" />,
        },
      ]}
    />
  );

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
          {smDown && <Grid xs={12}>{renderStorageOverview}</Grid>}

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
            {/* <FileDataActivity
              title="Data Activity"
              chart={{
                labels: {
                  Week: weekLabels,
                  Month: monthLabels,
                  Year: yearLabels,
                },
                colors: [
                  theme.palette.primary.main,
                  theme.palette.error.main,
                  theme.palette.warning.main,
                  theme.palette.text.disabled,
                ],
                series: [
                  {
                    type: 'Week',
                    data: [
                      {
                        name: 'Activity',
                        data: weekData,
                      },
                    ],
                  },
                  {
                    type: 'Month',
                    data: [
                      {
                        name: 'Activity',
                        data: monthData,
                      },
                    ],
                  },
                  {
                    type: 'Year',
                    data: [
                      {
                        name: 'Activity',
                        data: yearData,
                      },
                    ],
                  },
                ],
              }}
            /> */}

            <div>
              <FileManagerPanel
                title="Documents"
                link={paths.dashboard.technicalDocument.root}
                // onOpen={newFolder.onTrue}
                sx={{ mt: 6 }}
              />

              <Scrollbar>
                <Stack direction="row" spacing={3} sx={{ pb: 3 }}>
                  <Grid container spacing={2}>
                    {document.slice(0, 6).map((d) => (
                      <Grid key={d.id_technical_document} xs={12} sm={6} md={4}>
                        <FileDocumentRecent
                          file={{
                            id_technical_document: d.id_technical_document,
                            document_number: d.document_number,
                            job_title: d.job_title,
                            created_at: d.created_at,
                            updated_at: d.updated_at,
                            division: {
                              id_division: d.division.id_division,
                              division_name: d.division.division_name,
                            },
                            items: [],
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
                // onOpen={upload.onTrue}
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
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <FileManagerPanel title="Recent Activity" sx={{ mt: 5 }} />

              <Stack spacing={2}>
                {documentItemsLog
                  .slice(0, 5)
                  .map((log) =>
                    log.technicalDocumentItem ? (
                      <FileDocumentItemRecent
                        key={log.id_technical_document_item_log}
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
