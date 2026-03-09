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
//
import FileWidget from '../../../file-manager/file-widget';
import FileUpgrade from '../../../file-manager/file-upgrade';
import FileRecentItem from '../../../type-document/file-recent-item';
import FileDataActivity from '../../../file-manager/file-data-activity';
import FileStorageOverview from '../../../file-manager/file-storage-overview';
//
import FileManagerPanel from '../../../file-manager/file-manager-panel';
import FileManagerFolderItem from '../../../file-manager/file-manager-folder-item';
import FileManagerNewFolderDialog from '../../../file-manager/file-manager-new-folder-dialog';
import { useGetTypes } from 'src/api/type';
import { ITypeDocument } from 'src/types/type';
import { useGetDocuments } from 'src/api/document';
import FileDocumentRecentItem from 'src/sections/technical-documents/file-recent-item';
import { useGetUsers } from 'src/api/user';
import AppWelcome from '../../app/app-welcome';
import { SeoIllustration } from 'src/assets/illustrations';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { Button } from '@mui/material';

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
  const { user } = useMockedUser();

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
              title={`Welcome back 👋 \n ${user?.displayName}`}
              description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."
              img={<SeoIllustration />}
              action={
                <Button variant="contained" color="primary">
                  Go Now
                </Button>
              }
            />
          </Grid>
          {smDown && <Grid xs={12}>{renderStorageOverview}</Grid>}

          <Grid xs={12} sm={6} md={4}>
            <FileWidget title="User" total={users.length} icon="/assets/icons/app/ic_user.svg" />
          </Grid>

          <Grid xs={12} sm={6} md={4}>
            <FileWidget
              title="Document"
              total={document.length}
              icon="/assets/icons/app/ic_documents.svg"
            />
          </Grid>

          <Grid xs={12} sm={6} md={4}>
            <FileWidget
              title="Type Document"
              total={type.length}
              icon="/assets/icons/app/ic_type.svg"
            />
          </Grid>

          <Grid xs={12} md={6} lg={8}>
            <FileDataActivity
              title="Data Activity"
              chart={{
                labels: TIME_LABELS,
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
                      { name: 'Images', data: [20, 34, 48, 65, 37, 48] },
                      { name: 'Media', data: [10, 34, 13, 26, 27, 28] },
                      { name: 'Documents', data: [10, 14, 13, 16, 17, 18] },
                      { name: 'Other', data: [5, 12, 6, 7, 8, 9] },
                    ],
                  },
                  {
                    type: 'Month',
                    data: [
                      {
                        name: 'Images',
                        data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 12, 43, 34],
                      },
                      {
                        name: 'Media',
                        data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 12, 43, 34],
                      },
                      {
                        name: 'Documents',
                        data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 12, 43, 34],
                      },
                      {
                        name: 'Other',
                        data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 12, 43, 34],
                      },
                    ],
                  },
                  {
                    type: 'Year',
                    data: [
                      { name: 'Images', data: [10, 34, 13, 56, 77] },
                      { name: 'Media', data: [10, 34, 13, 56, 77] },
                      { name: 'Documents', data: [10, 34, 13, 56, 77] },
                      { name: 'Other', data: [10, 34, 13, 56, 77] },
                    ],
                  },
                ],
              }}
            />

            <div>
              <FileManagerPanel
                title="Documents"
                link={paths.dashboard.technicalDocument.root}
                onOpen={newFolder.onTrue}
                sx={{ mt: 5 }}
              />

              <Scrollbar>
                <Stack direction="row" spacing={3} sx={{ pb: 3 }}>
                  {document.map((d) => (
                    <FileDocumentRecentItem
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
                  ))}
                </Stack>
              </Scrollbar>

              <FileManagerPanel
                title="Type Documents"
                link={paths.dashboard.typeDocument.root}
                onOpen={upload.onTrue}
                sx={{ mt: 2 }}
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
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>{renderStorageOverview}</Box>
          </Grid>
        </Grid>
      </Container>

      <FileManagerNewFolderDialog open={upload.value} onClose={upload.onFalse} />

      <FileManagerNewFolderDialog
        open={newFolder.value}
        onClose={newFolder.onFalse}
        title="New Folder"
        folderName={folderName}
        onChangeFolderName={handleChangeFolderName}
        onCreate={handleCreateNewFolder}
      />
    </>
  );
}
