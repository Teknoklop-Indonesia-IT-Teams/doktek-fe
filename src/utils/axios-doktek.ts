import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { enqueueSnackbar, OptionsObject } from 'notistack';
import { BE_API } from 'src/config-global';

const apiDoktek = axios.create({
  baseURL: BE_API,
  timeout: 9000,
});

apiDoktek.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default apiDoktek;

// ----------------------------------------------------------------------

export const fetcherDoktek = async (args: string | [string, AxiosRequestConfig?]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  // console.log('Fetching data with args:', args);

  const res = await apiDoktek.get(url, { ...config });
  // console.log(res);
  return res.data;
};

export const deleterDoktek = async (args: string | [string, AxiosRequestConfig?]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  // console.log('Fetching data with args:', args);

  const res = await apiDoktek.delete(url, { ...config });
  // console.log(res);
  return res.data;
};

export const posterDoktek = async (url: string, data: any, config?: AxiosRequestConfig) => {
  // const [url, config] = Array.isArray(args) ? args : [args];
  // console.log('Fetching data with args:', args);

  try {
    console.log(data);
    const response: AxiosResponse = await apiDoktek.post(url, data, config);

    if (response.status === 201) {
      // Resource created successfully
      return response.data;
    }
    if (response.status === 200 || response.status === 204) {
      // Request processed successfully, but no additional data to return
      return null;
    }
    if (response.status === 500) {
      enqueueSnackbar(response.status, { variant: 'error' });
    }
    // Handle other status codes here
    // You can throw an error or handle the response accordingly
    throw new Error(`Unexpected status code: ${response.status}`);
  } catch (error) {
    // Handle request errors (e.g., network issues)
    console.error('Request error:', error);
    enqueueSnackbar(error.message, { variant: 'error' });
    throw error;
  }
};

// ----------------------------------------------------------------------
export const patcherDoktek = async (url: string, data: any, config?: AxiosRequestConfig) => {
  // const [url, config] = Array.isArray(args) ? args : [args];
  // console.log('Fetching data with args:', args);

  try {
    console.log(data);
    const response: AxiosResponse = await apiDoktek.patch(url, data, config);

    if (response.status === 201) {
      // Resource created successfully
      return response.data;
    }
    if (response.status === 200 || response.status === 204) {
      // Request processed successfully, but no additional data to return
      return null;
    }
    // Handle other status codes here
    // You can throw an error or handle the response accordingly
    throw new Error(`Unexpected status code: ${response.status}`);
  } catch (error) {
    // Handle request errors (e.g., network issues)
    console.error('Request error:', error);
    throw error;
  }
};
// ----------------------------------------------------------------------

export const putDoktek = async (url: string, data: any, config?: AxiosRequestConfig) => {
  // const [url, config] = Array.isArray(args) ? args : [args];
  // console.log('Fetching data with args:', args);

  try {
    console.log(data);
    const response: AxiosResponse = await apiDoktek.put(url, data, config);

    if (response.status === 201) {
      // Resource created successfully
      return response.data;
    }
    if (response.status === 200 || response.status === 204) {
      // Request processed successfully, but no additional data to return
      return null;
    }
    // Handle other status codes here
    // You can throw an error or handle the response accordingly
    throw new Error(`Unexpected status code: ${response.status}`);
  } catch (error) {
    // Handle request errors (e.g., network issues)
    console.error('Request error:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const removerDoktek = async (url: string) => {
  const res = await apiDoktek.delete(url);
  return res.data;
};
// ----------------------------------------------------------------------

export const epDoktek = {
  auth: {
    me: '/auth/me',
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    createPassword: '/auth/create-password',
  },
  users: {
    details: (usersId: string) => `/users/${usersId}`,
    editAvatar: (usersId: string) => `/users/updateAvatar/${usersId}`,
    editSignature: (usersId: string) => `/users/updateSignature/${usersId}`,
    editInitial: (usersId: string) => `/users/updateInitial/${usersId}`,
    getByLoc: (locId: string) => `/users/getbyloc/${locId}`,
    search: `/users/q/`,
    list: `/users/`,
    new: `/users`,
  },
  roles: {
    edit: (id: number) => `/role/${id}`,
    delete: (id: number) => `/role/${id}`,
    search: `/role/q`,
    postRole: `/role`,
    list: '/role',
    details: (id: string) => `/role/${id}`,
  },
  division: {
    edit: (id: number) => `/divisions/${id}`,
    delete: (id: number) => `/divisions/${id}`,
    search: `/divisions/q`,
    postDivision: `/divisions`,
    list: '/divisions',
    details: (id: string) => `/divisions/${id}`,
  },
  type: {
    edit: (id: number) => `/type-documents/${id}`,
    delete: (id: number) => `/type-documents/${id}`,
    search: `/type-documents/q`,
    postType: `/type-documents`,
    list: '/type-documents',
    details: (id: string) => `/type-documents/${id}`,
  },
  document: {
    postDocument: '/technical-documents',
    list: '/technical-documents',
    edit: (id: string) => `/technical-documents/${id}`,
    search: '/technical-documents/q',
    details: (id: string) => `/technical-documents/${id}`,
  },
  documentItem: {
    postDocumentItem: '/technical-document-items',
    list: '/technical-document-items',
    edit: (id: string) => `/technical-document-items/${id}`,
    search: '/technical-document-items/q',
    details: (id: string) => `/technical-document-items/${id}`,
  },
  unit: {
    postUnit: '/unit',
    list: '/unit',
    details: (id: number) => `/unit/${id}`,
    search: '/unit/q',
    edit: (id: number) => `/unit/${id}`,
  },
  asset: {
    edit: (id: number) => `/asset/${id}`,
    details: (id: number) => `/asset/${id}/findDetail`,
    list: `/asset`,
    search: `/asset/q`,
    postAsset: `/asset`,
    getListAsset: `/asset/getListAsset`,
  },
  brand: {
    edit: (id: number) => `/brand/${id}`,
    details: (id: number) => `/brand/${id}/findDetail`,
    list: `/brand`,
    search: `/brand/q`,
    postBrand: `/brand`,
    getListBrand: `/brand/getListBrand`,
  },
  company: {
    edit: (id: number) => `/company/${id}`,
    details: (id: number) => `/company/${id}/findDetail`,
    list: `/company`,
    search: `/company/q`,
    postCompany: `/company`,
    getListCompany: `/company/getListCompany`,
  },
  specProduct: {
    edit: (id: number) => `/spec-product/${id}`,
    list: '/spec-product',
    details: (id: number) => `/spec-product/${id}`,
    search: '/spec-product/q',
    getkponly: `/spec-product/getkp/kponly`,
    getkpselect: `/spec-product/getkp/kpforselect`,
    postSpecProduct: `/spec-product`,
    specProductProperties: (id: number) => `/spec-product/specProductProperties/${id}`,
    specProductComponents: (id: number) => `/spec-product/specProductComponents/${id}`,
    specProductReviews: (id: number) => `/spec-product/specProductReviews/${id}`,
    createSpecProductReviews: (id: number) => `/spec-product/createlogreview/${id}`,
  },
  specMH: {
    search: '/spec-mh/q',
    type: '/spec-mh/specMH/type',
    edit: (id: number) => `/spec-mh/${id}`,
    list: '/spec-mh',
    details: (id: number) => `/spec-mh/${id}`,
    postSpecMH: `/spec-mh`,
    specMHProperties: (id: number) => `/spec-mh/specProperties/${id}`,
    specMHReviews: (id: number) => `/spec-mh/specReviews/${id}`,
  },
  tqc: {
    list: '/tqc',
  },
  recordBlending: {
    getBlendIds: `/record-blending/getids/`,
    edit: (id: number) => `/record-blending/${id}`,
    search: `/record-blending/q`,
    postRecordBlending: `/record-blending`,
    list: '/record-blending',
    new: '/record-blending',
    addTestSample: (id: number) => `/record-blending/add-test-sample/${id}`,
    addTestResult: (id: number) => `/record-blending/result/${id}`,
    addLR: (id: number) => `/record-blending/addLR/${id}`,
    details: (id: number) => `/record-blending/${id}`,
    testResult: (id: number) => `/record-blending/result/${id}`,
    deleteTestSample: (id: number) => `/record-blending/${id}/testSample`,
    deleteRecord: (id: number) => `/record-blending/${id}`,
    getDashboardBlending: `/record-blending/dashboard/q`,
    getDashboardBlendingDen: `/record-blending/dashboardden/q`,
    getDashboardBlendingTbn: `/record-blending/dashboardtbn/q`,
  },
  recordFilling: {
    edit: (id: number) => `/record-filling/${id}`,
    search: `/record-filling/q`,
    postRecordFilling: `/record-filling`,
    list: '/record-filling',
    details: (id: number) => `/record-filling/${id}`,
    deleteRecord: (id: number) => `/record-filling/${id}`,
    addTestSample: (id: number) => `/record-filling/add-test-sample/${id}`,
    addTestResult: (id: number) => `/record-filling/result/${id}`,
    addLR: (id: number) => `/record-filling/addLR/${id}`,
    getDashboardFilling: `/record-filling/dashboard/q`,
    getDashboardFillingDen: `/record-filling/dashboardden/q`,
    getDashboardFillingTbn: `/record-filling/dashboardtbn/q`,
  },
  recordIncoming: {
    edit: (id: number) => `/record-incoming/${id}/detail`,
    search: `/record-incoming/q`,
    listIncoming: `/record-incoming/list`,
    postRecordBlending: `/record-incoming`,
    list: '/record-incoming',
    new: `/record-incoming`,
    addTestSample: (id: number) => `/record-incoming/add-test-sample/${id}`,
    addTestResult: (id: number) => `/record-incoming/result/${id}`,
  },
  recordStorage: {
    edit: (id: number) => `/record-storage/${id}`,
    search: `/record-storage/q`,
    postRecordFilling: `/record-storage`,
    list: '/record-storage',
  },
  recordTrialBlend: {
    new: `/trial-blend/`,
    edit: (id: number) => `/trial-blend/${id}`,
  },
  reportCOA: {
    edit: (id: number) => `/report-coa/${id}`,
    search: `/report-coa/q`,
    postReportCOA: `/report-coa`,
    list: '/report-coa',
    details: (id: number) => `/report-coa/${id}`,
    addLR: (id: number) => `/report-coa/${id}`,
    getLR: (id: number) => `/report-coa/${id}/getLR`,
  },
  reportCOQ: {
    edit: (id: number) => `/report-coq/${id}`,
    search: `/report-coq/q`,
    postReportCOQ: `/report-coq`,
    postReportCOQFromFilling: (id: number) => `/report-coq/${id}/createFromFilling`,
    list: '/report-coq',
    details: (id: number) => `/report-coq/${id}`,
    addLR: (id: number) => `/report-coq/${id}`,
    getLR: (id: number) => `/report-coq/${id}/getLR`,
    genPDF: (id: number) => `/report-coq/${id}/forPDF`,
  },
  blendingCorr: {
    list: '/blending-corr',
  },
  fillingCorr: {
    list: '/filling-corr',
  },
  kimap: {
    edit: (id: string) => `/kimap/${id}`,
    delete: (id: string) => `/kimap/${id}`,
    search: `/kimap/q`,
    postKimap: `/kimap`,
    list: '/kimap',
    details: (id: string) => `/kimap/${id}`,
    getpkg: `/kimap/pkg/get`,
  },
  logReview: {
    getStatus: (prl: number) => `/log-review/${prl}`,
    getStatusAll: '/log-review',
  },
  overview: {
    getCountBlendingOngoing: `/overview/countBlendingOngoing`,
    getCountBlendingRelease: `/overview/countBlendingRelease`,
    getCountBlendingRework: `/overview/countBlendingRework`,
    getCountFillingOngoing: `/overview/countFillingOngoing`,
    getCountFillingRelease: `/overview/countFillingRelease`,
    getCountFillingRework: `/overview/countFillingRework`,
  },
  notification: {
    list: '/notification',
    edit: (id: number) => `/notification/${id}`,
    markallasread: '/notification/markallasread',
  },
};
