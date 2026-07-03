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
import { useParams, useRouter } from 'src/routes/hooks';
// types
import { IDocument, IDocumentActivity, IDocumentById, IDocumentInput } from 'src/types/document';
// components
import FormProvider, {
  RHFAutocomplete,
  RHFSelect,
  RHFTextField,
  RHFUpload,
} from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { useSnackbar } from 'src/components/snackbar';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import { useGetDivision } from 'src/api/division';
import { epDoktek, patcherDoktek, posterDoktek, putDoktek } from 'src/utils/axios-doktek';
import { mutate } from 'swr';
import { useGetType, useGetTypes } from 'src/api/type';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';

// ----------------------------------------------------------------------

type Props = {
  currentDocumentItems?: IDocumentActivity;
  id_technical_documents?: string;
};

type FormValues = {
  id_technical_document_activity: string;
  id_type_document: string;
  id_division: string;
  document_file_pdf: (File | string)[];
  document_file_word: (File | string)[];
};

export default function DocumentItemsNewEditForm({
  currentDocumentItems,
  id_technical_documents,
}: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const confirmRemoveFile = useBoolean();
  const [fileToRemove, setFileToRemove] = useState<File | string | null>(null);
  const [fieldToRemove, setFieldToRemove] = useState<'document_file_pdf' | 'document_file_word' | null>(null);

  const { enqueueSnackbar } = useSnackbar();
  const { type } = useGetTypes();

  const NewDocumentItemsSchema = Yup.object().shape({
    id_technical_document_activity: Yup.string(),
    document_file_pdf: Yup.array().nullable().notRequired(),
    document_file_word: Yup.array().nullable().notRequired(),
    id_type_document: Yup.string().required('Type is required'),
    id_division: Yup.string().required('Division is required'),
  });

  const defaultValues: FormValues = useMemo(() => {
    const pdfFile = currentDocumentItems?.document_file_pdf
      ? [currentDocumentItems.document_file_pdf]
      : [];
    const wordFile = currentDocumentItems?.document_file
      ? [currentDocumentItems.document_file]
      : [];
    return {
      id_technical_document_activity:
        currentDocumentItems?.id_technical_document_activity?.toString() || '',
      document_file_pdf: pdfFile,
      document_file_word: wordFile,
      id_type_document: currentDocumentItems?.typeDocument?.id_type_document?.toString() || '',
      id_division: currentDocumentItems?.division?.id_division?.toString() || '',
    };
  }, [currentDocumentItems]);

  const methods = useForm({
    resolver: yupResolver(NewDocumentItemsSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentDocumentItems) {
      reset(defaultValues);
    }
  }, [currentDocumentItems, defaultValues, reset]);

  useEffect(() => {
    if (id_technical_documents) {
      setValue('id_technical_document_activity', id_technical_documents);
    }
  }, [id_technical_documents, setValue]);

  const postDocumentItems = (data: IDocumentInput) => {
    const dataDocumentItems = data;
    if (currentDocumentItems) {
      const URLEdit = epDoktek.documentItem.edit(
        currentDocumentItems?.id_technical_document_activity.toString()
      );
      putDoktek(URLEdit, dataDocumentItems, {})
        .then((response: any) => {
          enqueueSnackbar(currentDocumentItems ? 'Update success!' : 'Create success!');

          if (id_technical_documents) {
            router.push(paths.dashboard.technicalDocument.details(id_technical_documents));
          }
        })
        .catch((error: any) => {
          console.error(error);
          const msg = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
          enqueueSnackbar(
            currentDocumentItems ? `Update failed! ${msg}` : `Create failed! ${msg}`,
            {
              variant: 'error',
            }
          );
        });
    } else {
      const URL = epDoktek.documentItem.postDocumentItem;
      posterDoktek(URL, dataDocumentItems, {})
        .then((response) => {
          enqueueSnackbar(currentDocumentItems ? 'Update success!' : 'Create success!');
          if (id_technical_documents) {
            router.push(paths.dashboard.technicalDocument.details(id_technical_documents));
          }
          console.info('DATA', response);
        })
        .catch((error) => {
          console.error(error);
          const msg = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
          enqueueSnackbar(
            currentDocumentItems ? `Update failed! ${msg}` : `Create failed! ${msg}`,
            {
              variant: 'error',
            }
          );
        });
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();

      //  bikin object activity
      const activities = [
        {
          id_division: Number(data.id_division),
          id_type_document: Number(data.id_type_document),
          title: currentDocumentItems?.title || '', // atau input kalau ada
        },
      ];

      //  WAJIB stringify
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

      // EDIT
      if (currentDocumentItems) {
        await putDoktek(
          epDoktek.document.edit(currentDocumentItems.id_technical_document.toString()),
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
      } else {
        //  CREATE
        await posterDoktek(epDoktek.document.postDocument, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      enqueueSnackbar('Success!');
    } catch (error: any) {
      const msg = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
      enqueueSnackbar(`Failed! ${msg}`, { variant: 'error' });
    }
  });

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

  const renderDetails = (
    <Grid xs={12}>
      <Card>
        {/* <CardHeader title="Document Item" /> */}

        <Stack spacing={3} sx={{ p: 3 }}>
          {/* <RHFSelect
            native
            name="id_type_document"
            label="Type Document"
            InputLabelProps={{ shrink: true }}
          >
            <option value="" />

            {type.map((item) => (
              <option key={item.id_type_document} value={item.id_type_document}>
                {item.code_document}
              </option>
            ))}
          </RHFSelect> */}

          <Stack spacing={2}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Upload File PDF</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Optional (maks. di bawah 10 MB)
              </Typography>

              <RHFUpload
                name="document_file_pdf"
                maxSize={10 * 1024 * 1024 - 1}
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
                Optional (maks. di bawah 10 MB)
              </Typography>

              <RHFUpload
                name="document_file_word"
                maxSize={10 * 1024 * 1024 - 1}
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
  );

  const renderActions = (
    <Grid xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
        {!currentDocumentItems ? 'Create Document Item' : 'Save Changes'}
      </LoadingButton>
    </Grid>
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
