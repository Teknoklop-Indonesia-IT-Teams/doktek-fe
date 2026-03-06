import { useCallback, useEffect, useMemo } from 'react';
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
import { IDocumentItem, IDocumentItemsInput } from 'src/types/document';
// components
import FormProvider, {
  RHFAutocomplete,
  RHFSelect,
  RHFTextField,
  RHFUpload,
} from 'src/components/hook-form';
import { useResponsive } from 'src/hooks/use-responsive';
import { useSnackbar } from 'src/components/snackbar';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import { useGetDivision } from 'src/api/division';
import { epDoktek, patcherDoktek, posterDoktek, putDoktek } from 'src/utils/axios-doktek';
import { mutate } from 'swr';
import { useGetType, useGetTypes } from 'src/api/type';
import Chip from '@mui/material/Chip';

// ----------------------------------------------------------------------

type Props = {
  currentDocumentItems?: IDocumentItem;
  id_technical_documents?: string;
};

type FormValues = {
  id_technical_document: string;
  id_type_document: string;
  upload_doc: (File | string)[];
};

export default function DocumentItemsNewEditForm({
  currentDocumentItems,
  id_technical_documents,
}: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();
  const { type } = useGetTypes();

  const NewDocumentItemsSchema = Yup.object().shape({
    id_technical_document: Yup.string(),
    upload_doc: Yup.array().max(1, 'Only one file allowed'),
    id_type_document: Yup.string().required('Type is required'),
  });

  const defaultValues: FormValues = useMemo(
    () => ({
      id_technical_document:
        currentDocumentItems?.technicalDocument.id_technical_document?.toString() || '',
      upload_doc: currentDocumentItems?.upload_doc || [],
      id_type_document: currentDocumentItems?.typeDocument.id_type_document?.toString() || '',
    }),
    [currentDocumentItems]
  );

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
    if (currentDocumentItems) {
      setValue(
        'id_technical_document',
        currentDocumentItems.technicalDocument.id_technical_document.toString()
      );
    }
  }, [currentDocumentItems, setValue]);
  useEffect(() => {
    if (id_technical_documents) {
      setValue('id_technical_document', id_technical_documents);
    }
  }, [id_technical_documents, setValue]);

  const postDocumentItems = (data: IDocumentItemsInput) => {
    const dataDocumentItems = data;
    if (currentDocumentItems) {
      const URLEdit = epDoktek.documentItem.edit(
        currentDocumentItems?.id_technical_document_item.toString()
      );
      putDoktek(URLEdit, dataDocumentItems, {})
        .then((response: any) => {
          enqueueSnackbar(currentDocumentItems ? 'Update success!' : 'Create success!');
          router.push(paths.dashboard.techincalDocument.root);
          console.info('DATA', response);
        })
        .catch((error: any) => {
          console.error(error);
          enqueueSnackbar(
            currentDocumentItems
              ? `Update failed! ${error.message}`
              : `Create failed! ${error.message}`,
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
          router.push(paths.dashboard.techincalDocument.root);
          console.info('DATA', response);
        })
        .catch((error) => {
          console.error(error);
          enqueueSnackbar(
            currentDocumentItems
              ? `Update failed! ${error.message}`
              : `Create failed! ${error.message}`,
            {
              variant: 'error',
            }
          );
        });
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const payload: IDocumentItemsInput = {
      upload_doc: data.upload_doc,
      id_type_manager: Number(data.id_type_document),
      id_technical_document: Number(id_technical_documents),
    };

    console.log({
      upload_doc: data.upload_doc,
      id_type_manager: Number(data.id_type_document),
      id_technical_document: Number(data.id_technical_document),
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      postDocumentItems(payload);
      if (id_technical_documents) {
        mutate(epDoktek.document.details(id_technical_documents));
      }
      reset();
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.upload_doc || [];

      const newFiles = acceptedFiles.map((file) => file);

      setValue('upload_doc', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.upload_doc]
  );

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered = values.upload_doc && values.upload_doc?.filter((file) => file !== inputFile);
      setValue('upload_doc', filtered);
    },
    [setValue, values.upload_doc]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('upload_doc', []);
  }, [setValue]);

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
            <RHFSelect
              native
              name="id_type_document"
              label="Type Document"
              InputLabelProps={{ shrink: true }}
            >
              {type.map((category) => (
                <option key={category.id_type_document} value={category.id_type_document}>
                  {category.code_document}
                </option>
              ))}
            </RHFSelect>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">File</Typography>
              <RHFUpload
                name="upload_doc"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={() => console.info('ON UPLOAD')}
              />
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
          {!currentDocumentItems ? 'Create Document Items' : 'Save Changes'}
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
    </FormProvider>
  );
}
