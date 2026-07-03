import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// types
import { IDocumentById, IDocumentInput } from 'src/types/document';
// components
import FormProvider, { RHFTextField, RHFUpload, RHFSelect } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { useSnackbar } from 'src/components/snackbar';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import { useGetDivision } from 'src/api/division';
import { epDoktek, posterDoktek, putDoktek } from 'src/utils/axios-doktek';
import { useGetTypes } from 'src/api/type';
import { Autocomplete, TextField, Button } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  currentDocument?: IDocumentById | null;
};

export default function DocumentNewEditForm({ currentDocument }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const confirmRemoveFile = useBoolean();
  const [fileToRemove, setFileToRemove] = useState<File | string | null>(null);
  const [fieldToRemove, setFieldToRemove] = useState<'document_file_pdf' | 'document_file_word' | null>(null);

  const { enqueueSnackbar } = useSnackbar();
  const { division } = useGetDivision();
  const { type } = useGetTypes();
  const MAX_SIZE = 10 * 1024 * 1024 - 1;

  const NewDocumentSchema = Yup.object().shape({
    title: Yup.string().required('Job Title is required'),
    id_division: Yup.string().required('Division is required'),
    id_type_document: Yup.string().required('Type Document is required'),
    document_file_pdf: Yup.array().nullable().notRequired(),
    document_file_word: Yup.array().nullable().notRequired(),
  });

  const lastActivity = currentDocument?.activities
    ?.slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

  const defaultValues = useMemo(() => {
    const existingFile = lastActivity?.document_file;
    let pdfFile: any[] = [];
    let wordFile: any[] = [];
    if (existingFile) {
      if (existingFile.toLowerCase().endsWith('.pdf')) pdfFile = [existingFile];
      else wordFile = [existingFile];
    }
    return {
      title: lastActivity?.title || '',
      id_division: lastActivity?.division.id_division.toString() || '',
      id_type_document: lastActivity?.typeDocument.id_type_document.toString() || '',
      document_file_pdf: pdfFile,
      document_file_word: wordFile,
    };
  }, [currentDocument]);

  const methods = useForm({
    resolver: yupResolver(NewDocumentSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (division.length && !values.id_division) {
      setValue('id_division', division[0].id_division.toString());
    }
    if (type.length && !values.id_type_document) {
      setValue('id_type_document', type[0].id_type_document.toString());
    }
  }, [division, type]);

  const values = watch();

  useEffect(() => {
    if (currentDocument) {
      reset(defaultValues);
    }
  }, [currentDocument, defaultValues, reset]);

  const postDocument = (data: IDocumentInput) => {
    const dataDocument = data;
    if (currentDocument) {
      const URLEdit = epDoktek.document.edit(currentDocument?.id_technical_document.toString());
      putDoktek(URLEdit, dataDocument, {})
        .then((response: any) => {
          enqueueSnackbar(currentDocument ? 'Update success!' : 'Create success!');
          router.push(paths.dashboard.technicalDocument.root);
        })
        .catch((error: any) => {
          console.error(error);
          const msg = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
          enqueueSnackbar(currentDocument ? `Update failed! ${msg}` : `Create failed! ${msg}`, {
            variant: 'error',
          });
        });
    } else {
      const URL = epDoktek.document.postDocument;
      posterDoktek(URL, dataDocument, {})
        .then((response) => {
          enqueueSnackbar(currentDocument ? 'Update success!' : 'Create success!');
          router.push(paths.dashboard.technicalDocument.root);
        })
        .catch((error) => {
          console.error(error);
          const msg = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
          enqueueSnackbar(currentDocument ? `Update failed! ${msg}` : `Create failed! ${msg}`, {
            variant: 'error',
          });
        });
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[], fieldName: 'document_file_pdf' | 'document_file_word') => {
      const newFile = acceptedFiles[0];
      if (newFile) {
        setValue(fieldName, [newFile], { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(
    (inputFile: File | string, fieldName: 'document_file_pdf' | 'document_file_word') => {
      setFileToRemove(inputFile);
      setFieldToRemove(fieldName);
      confirmRemoveFile.onTrue();
    },
    [confirmRemoveFile]
  );

  const onConfirmRemoveFile = useCallback(() => {
    if (fieldToRemove) {
      setValue(fieldToRemove, []);
    }
    confirmRemoveFile.onFalse();
    setFileToRemove(null);
    setFieldToRemove(null);
  }, [fieldToRemove, setValue, confirmRemoveFile]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();

      const activities = [
        {
          id_division: Number(data.id_division),
          id_type_document: Number(data.id_type_document),
          title: data.title,
        },
      ];

      formData.append('activities', JSON.stringify(activities));

      // PDF 
      (data.document_file_pdf || []).forEach((file: any) => {
        if (file instanceof File) {
          formData.append('file_pdf', file);
        } else if (typeof file === 'string') {
          formData.append('existing_file_pdf', file);
        }
      });

      // Word 
      (data.document_file_word || []).forEach((file: any) => {
        if (file instanceof File) {
          formData.append('file_word', file);
        } else if (typeof file === 'string') {
          formData.append('existing_file_word', file);
        }
      });

      if (currentDocument) {
        await putDoktek(
          epDoktek.document.edit(currentDocument.id_technical_document.toString()),
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      } else {
        await posterDoktek(epDoktek.document.postDocument, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      enqueueSnackbar(currentDocument ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.technicalDocument.root);
    } catch (error: any) {
      const msg = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
      enqueueSnackbar(`Failed! ${msg}`, { variant: 'error' });
    }
  });

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Title, short description, image...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="title" label="Job Title" />

            <Autocomplete
              options={division.map((d) => ({
                label: d.division_name,
                value: d.id_division,
              }))}
              value={
                division
                  .map((d) => ({
                    label: d.division_name,
                    value: d.id_division,
                  }))
                  .find((opt) => opt.value.toString() === values.id_division) || null
              }
              onChange={(_, newValue) => {
                setValue('id_division', newValue ? newValue.value.toString() : '', {
                  shouldValidate: true,
                });
              }}
              renderInput={(params) => <TextField {...params} label="Division" />}
            />

            <Autocomplete
              options={type.map((d) => ({
                label: d.type_document,
                value: d.id_type_document,
              }))}
              value={
                type
                  .map((d) => ({
                    label: d.type_document,
                    value: d.id_type_document,
                  }))
                  .find((opt) => opt.value.toString() === values.id_type_document) || null
              }
              onChange={(_, newValue) => {
                setValue('id_type_document', newValue ? newValue.value.toString() : '', {
                  shouldValidate: true,
                });
              }}
              renderInput={(params) => <TextField {...params} label="Type Document" />}
            />

            <Stack spacing={2}>
              <Stack spacing={1}>
                <Typography variant="subtitle2">Upload File PDF</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Optional (maks. 10 MB)
                </Typography>

                <RHFUpload
                  name="document_file_pdf"
                  maxSize={MAX_SIZE}
                  multiple
                  accept={{
                    'application/pdf': [],
                  }}
                  onDrop={(files) => handleDrop(files, 'document_file_pdf')}
                  onRemove={(file) => handleRemoveFile(file, 'document_file_pdf')}
                  sx={{
                    '& > .MuiBox-root:first-of-type': {
                      py: 2.5,
                    },
                  }}
                />
              </Stack>

              <Stack spacing={1}>
                <Typography variant="subtitle2">Upload File Word</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Optional (maks. 10 MB)
                </Typography>

                <RHFUpload
                  name="document_file_word"
                  maxSize={MAX_SIZE}
                  multiple
                  accept={{
                    'application/msword': [],
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': []
                  }}
                  onDrop={(files) => handleDrop(files, 'document_file_word')}
                  onRemove={(file) => handleRemoveFile(file, 'document_file_word')}
                  sx={{
                    '& > .MuiBox-root:first-of-type': {
                      py: 2.5,
                    },
                  }}
                />
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid
        xs={12}
        md={8}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
      >
        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentDocument ? 'Create Document' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}
        {renderActions}
      </Grid>
      <ConfirmDialog
        open={confirmRemoveFile.value}
        onClose={confirmRemoveFile.onFalse}
        title="Remove File"
        content={`Yakin ingin membatalkan upload file ${
          typeof fileToRemove === 'string' ? fileToRemove : fileToRemove?.name
        }?`}
        action={
          <Button variant="contained" color="error" onClick={onConfirmRemoveFile}>
            Remove
          </Button>
        }
      />
    </FormProvider>
  );
}
