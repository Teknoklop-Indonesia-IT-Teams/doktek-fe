export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
  User: User;
}

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  User: User;
}

export interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}

export interface User {
  id: string;
  email: string;
  emailVerified: Date | null;
  password: string | null;
  Profile: Profile | null;
  Accounts: Account[] | null;
  Sessions: Session[] | null;
}

export interface Location {
  id: string;
  name: string;
  shortName: string | null;
  miniName: string | null;
  abbrev: string | null;
  phone: string | null;
  extPhone: string | null;
  fax: string | null;
  email: string | null;
  address: string | null;
  address2: string | null;
  kelurahan: string | null;
  kecamatan: string | null;
  kota: string | null;
  provinsi: string | null;
  negara: string | null;
  kodePos: string | null;
  notes: string | null;
  updatedAt: Date;
  Orgs: Organization[] | null;
  Accreditations: Accreditation[] | null;
  TrialBlends: TrialBlend[] | null;
  SpecProducts: SpecProduct[] | null;
  SpecTrialBlends: TrialBlendSpec[] | null;
  MHInRecords: MHInRecord[] | null;
  MHOutRecords: MHOutRecord[] | null;
  BlendingRecords: BlendingRecord[] | null;
  FillingRecords: FillingRecord[] | null;
  ReportCOQ: ReportCOQ[] | null;
  ReportCOA: ReportCOA[] | null;
  ReportTR: ReportTR[] | null;
  ReportTrialBlends: TrialBlendReport[] | null;
  ProductTestSamples: ProductTestSample[] | null;
  Assets: Asset[] | null;
}

export interface Role {
  id_role: number;
  role_name: string;
}

export interface Profile {
  id_user: string;
  username: string | null;
  flag_active: string | null;
  id_division: number | null;
  id_role: number | null;
  division: DivisionGroup | null;
  role: Role | null;
}

export interface Organization {
  id: string;
  jabatan: string;
  bagian: string | null;
  fungsi: string | null;
  direktorat: string | null;
  prl: number | null;
  shortName: string | null;
  jobDesc: string | null;
  tempPrefix: string | null;
  tempSuffix: string | null;
  roleGroup: RoleGroup;
  Atasan: Organization | null;
  atasanId: string | null;
  Loc: Location | null;
  locId: string | null;
  Company: Company | null;
  companyId: number | null;
  Bawahan: Organization[] | null;
  Member: OrganizationLogs[] | null;
}

export interface OrganizationLogs {
  id: string;
  startDate: Date;
  endDate: Date | null;
  notes: string | null;
  Profile: Profile;
  profileId: string;
  Org: Organization;
  orgId: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: number;
  name: string | null;
  commonName: string;
  phone: string[] | null;
  email: string[] | null;
  website: string | null;
  address: string | null;
  notes: string | null;
  KLBI: string[] | null;
  taxNumber: string | null;
  scale: string | null;
  types: string[] | null;
  industry: string[] | null;
  commodities: string[] | null;
  Principals: Company[] | null;
  Agents: Company[] | null;
  Orgs: Organization[] | null;
  Contacts: Contact[] | null;
  SocialMedias: SocialMedia[] | null;
  MHManufacturers: MaterialHydro[] | null;
  MHSuppliers: MaterialHydro[] | null;
  BrandManufacturers: Brand[] | null;
  BrandSuppliers: Brand[] | null;
}

export interface Contact {
  id: number;
  fullName: string | null;
  nickName: string;
  departement: string | null;
  position: string | null;
  phone: string[] | null;
  email: string[] | null;
  notes: string | null;
  tags: string[] | null;
  company: Company | null;
  companyId: number | null;
  SocialMedias: SocialMedia[] | null;
}

export interface SocialMedia {
  id: number;
  platform: string;
  link: string;
  accountName: string | null;
  notes: string | null;
  Profiles: Profile[] | null;
  Contacts: Contact[] | null;
  Companies: Company[] | null;
}

export interface SpecialDate {
  date: Date;
  desc: string | null;
  type: string | null;
}

export interface Attendance {
  id: number;
}

export interface Overtime {
  id: number;
  reason: string;
}

export interface Package {
  id: number;
  name: string;
  notes: string | null;
  type: string;
  unitPerPkg: number;
  unitQty: number;
  unitUom: string;
  baseQty: number;
  baseUom: string;
  unitToBaseConv: number | null;
  fillingGroup: string | null;
  updatedAt: Date;
  KIMAP: KIMAP[] | null;
}

export interface KIMAP {
  KIMAP: string;
  desc: string | null;
  notes: string | null;
  isActive: boolean | null;
  imgUrl: string[] | null;
  updatedAt: Date;
  pkg: Package | null;
  pkgId: number | null;
  newKIMAP: string | null;
  ReplaceBy: KIMAP | null;
  Replacements: KIMAP[] | null;
  MaterialHydros: MaterialHydro[] | null;
  Products: Product[] | null;
}

export interface MaterialHydro {
  id: number;
  name: string;
  desc: string | null;
  updatedAt: Date;
  Supplier: Company | null;
  supplierId: number | null;
  Manufacturer: Company | null;
  manufacturerId: number | null;
  KIMAP: KIMAP[] | null;
  Specs: SpecMH[] | null;
  ProductComponents: SpecProductComponent[] | null;
  TrialBlendComponents: TrialBlendSpecComponent[] | null;
}

export interface ProductViscosityGrade {
  id: string;
  name: string;
  type: string;
  tags: string[] | null;
  Products: Product[] | null;
}

export interface ProductApproval {
  id: number;
  name: string;
  type: string;
  status: string | null;
  notes: string | null;
  tags: string[] | null;
  Products: Product[] | null;
}

export interface ProductLubeGuide {
  abbrev: string;
  name: string;
  imgUrl: string[] | null;
  tags: string[] | null;
  ProductSeries: ProductSeries[] | null;
}

export interface ProductSeries {
  id: number;
  name: string;
  imgUrl: string[] | null;
  LubeGuide: ProductLubeGuide | null;
  lgCode: string | null;
  Variants: ProductVariant[] | null;
}

export interface ProductVariant {
  id: number;
  name: string;
  imgUrl: string[] | null;
  notes: string | null;
  Series: ProductSeries | null;
  seriesId: number | null;
  Products: Product[] | null;
}

export interface Product {
  id: number;
  name: string;
  desc: string;
  imgUrl: string[] | null;
  updatedAt: Date;
  Variant: ProductVariant | null;
  variantId: number | null;
  VG: ProductViscosityGrade | null;
  vgId: string | null;
  Approvals: ProductApproval[] | null;
  KIMAP: KIMAP[] | null;
  Specs: SpecProduct[] | null;
}

export interface ProductMod {
  id: number;
  name: string;
  desc: string;
  imgUrl: string[] | [];
  updatedAt: Date;

  variantId: number | null;
  variant: string | null;
  seriesId: number | null;
  series: string | null;
  lgId: string;
  lgName: string;

  approvals: { id: string | null; name: string | null }[];

  vgId: string | null;
  vgName: string | null;
}

export interface ServicePriceReference {
  id: number;
  refNumber: string;
  refDate: Date;
  refTitle: string | null;
  refUrl: string[] | null;
  notes: string | null;
  Prices: ServicePrice[] | null;
}

export interface ServicePrice {
  id: number;
  price: number;
  type: string | null;
  notes: string | null;
  updatedAt: Date;
  Ref: ServicePriceReference;
  refId: number;
  Parameter: Parameter;
  parameterId: number;
  Method: Method;
  methodId: number;
}

export interface Invoice {
  id: number;
  type: string | null;
}

export interface TrialBlendReference {
  id: number;
  type: string;
  name: string;
  title: string | null;
  date: Date;
  isUrgent: boolean;
  fileUrl: string[] | null;
  TrialBlend: TrialBlend[] | null;
}

export interface TrialBlend {
  id: number;
  name: string;
  status: TrialBlendStatus;
  priority: number | null;
  type: string | null;
  Refs: TrialBlendReference;
  refId: number;
  Loc: Location[] | null;
  Specs: TrialBlendSpec[] | null;
  SpecProducts: SpecProduct[] | null;
}

export interface TrialBlendSpec {
  id: number;
  updatedAt: Date;
  name: string;
  ref: string | null;
  isUse: boolean;
  TB: TrialBlend;
  tbId: number;
  Loc: Location;
  locId: string;
  Components: TrialBlendSpecComponent[] | null;
  Properties: TrialBlendSpecProperties[] | null;
}

export interface TrialBlendSpecComponent {
  id: number;
  qty: number;
  UOM: Unit | null;
  uom: number | null;
  isLocked: boolean;
  notes: string | null;
  MaterialHydro: MaterialHydro;
  materialId: number;
  Spec: TrialBlendSpec;
  specId: number;
}

export interface TrialBlendSpecProperties {
  id: number;
  updatedAt: Date;
  notes: string | null;
  isReported: boolean | null;
  specFixNum: number | null;
  specFixStr: string | null;
  specMinNum: number | null;
  specMinStr: string | null;
  specTypNum: number | null;
  specTypStr: string | null;
  specMaxNum: number | null;
  specMaxStr: string | null;
  Parameter: Parameter;
  parameterId: number;
  Method: Method;
  methodId: number;
  Unit: Unit;
  unitId: number;
  Spec: TrialBlendSpec | null;
  specId: number | null;
  Results: TrialBlendTestResult[] | null;
}

export interface TrialBlendTestResult {
  id: number;
  updatedAt: Date;
  isUse: boolean;
  notes: string | null;
  resNum: number | null;
  resStr: string | null;
  Property: TrialBlendSpecProperties;
  propertyId: number;
}

export interface TrialBlendReport {
  id: number;
  publishedDate: Date;
  updatedAt: Date;
  Loc: Location;
  locId: string;
  LogReviews: TrialBlendReportLR[] | null;
}

export interface TrialBlendReportLR {
  id: number;
  updatedAt: Date;
  Reviewed: TrialBlendReport;
  reviewedId: number;
  status: LogReviewStatus;
  statusId: number;
  Profile: Profile;
  profileId: string;
  prevId: number | null;
  PrevStatus: TrialBlendReportLR | null;
  NextStatus: TrialBlendReportLR | null;
}

export interface Parameter {
  id: number;
  name: string;
  abbrev: string | null;
  group: string | null;
  parent: string | null;
  basic: string | null;
  type: ParameterType | null;
  notes: string | null;
  correlatedWith: Parameter[] | null;
  correlation: Parameter[] | null;
  PMUs: PMU[] | null;
  Accreditation: Accreditation[] | null;
  SpecProductComponentInitTest: SpecProductComponentInitTest[] | null;
  TrialBlendSpecProperties: TrialBlendSpecProperties[] | null;
  SpecMHProperties: SpecMHProperties[] | null;
  SpecProductProperties: SpecProductProperties[] | null;
  SpecCustomProperties: SpecCustomProperties[] | null;
  MHInTestResult: MHInTestResult[] | null;
  MHInTBTestResult: MHInTBTestResult[] | null;
  MHOutTestResult: MHOutTestResult[] | null;
  BlendingTestResult: BlendingTestResult[] | null;
  FillingTestResult: FillingTestResult[] | null;
  ProductTestResult: ProductTestResult[] | null;
  TestingPrice: ServicePrice[] | null;
}

export interface Method {
  id: number;
  type: string;
  number: string;
  title: string | null;
  notes: string | null;
  isUse: boolean | null;
  MainVer: MethodVersion | null;
  mainVerId: number | null;
  correlatedWith: Method[] | null;
  correlation: Method[] | null;
  Versions: MethodVersion[] | null;
  GapAnalysis: MethodVersionGapAnalysis[] | null;
  PMUs: PMU[] | null;
  Accreditations: Accreditation[] | null;
  SpecProductComponentInitTests: SpecProductComponentInitTest[] | null;
  TrialBlendSpecProperties: TrialBlendSpecProperties[] | null;
  SpecMHProperties: SpecMHProperties[] | null;
  SpecProductProperties: SpecProductProperties[] | null;
  SpecCustomProperties: SpecCustomProperties[] | null;
  MHInTestResults: MHInTestResult[] | null;
  MHInTBTestResults: MHInTBTestResult[] | null;
  MHOutTestResults: MHOutTestResult[] | null;
  BlendingTestResults: BlendingTestResult[] | null;
  FillingTestResults: FillingTestResult[] | null;
  ProductTestResults: ProductTestResult[] | null;
  TestingPrice: ServicePrice[] | null;
}

export interface MethodVersion {
  id: number;
  name: string;
  isUse: boolean;
  notes: string | null;
  updatedAt: Date;
  MethodInUse: Method | null;
  Method: Method;
  methodId: number;
  GapAnalysis: MethodVersionGapAnalysis[] | null;
}

export interface MethodVersionGapAnalysis {
  id: number;
  Method: Method;
  methodId: number;
  Version: MethodVersion;
  versionId: number;
  name: string;
  desc: string;
  action: string | null;
}

export interface Unit {
  id: number;
  name: string;
  symbol: string;
  desc: string | null;
  group: string | null;
  isIntStd: boolean;
  std: UnitConversion[] | null;
  derived: UnitConversion[] | null;
  PMUs: PMU[] | null;
  Accreditation: Accreditation[] | null;
  TrialBlendComponents: TrialBlendSpecComponent[] | null;
  SpecProductComponents: SpecProductComponent[] | null;
  SpecProductComponentInitTest: SpecProductComponentInitTest[] | null;
  TrialBlendSpecProperties: TrialBlendSpecProperties[] | null;
  SpecMHProperties: SpecMHProperties[] | null;
  SpecProductProperties: SpecProductProperties[] | null;
  SpecCustomProperties: SpecCustomProperties[] | null;
  MHInTestResult: MHInTestResult[] | null;
  MHInTBTestResult: MHInTBTestResult[] | null;
  MHOutTestResult: MHOutTestResult[] | null;
  BlendingTestResult: BlendingTestResult[] | null;
  FillingTestResult: FillingTestResult[] | null;
  ProductTestResult: ProductTestResult[] | null;
}

export interface UnitConversion {
  ParentUnit: Unit;
  parentId: number;
  DerivedUnit: Unit;
  derivedId: number;
  stdToDerived: number;
}

export interface PMU {
  id: number;
  procedure: string | null;
  notes: string | null;
  updatedAt: Date;
  Parameter: Parameter;
  parameterId: number;
  Method: Method;
  methodId: number;
  Unit: Unit;
  unitId: number;
}

export interface Commodity {
  id: number;
  name: string;
  group: string | null;
  isUse: boolean | null;
  Accreditation: Accreditation[] | null;
  SpecCustom: SpecCustom[] | null;
}

export interface Accreditation {
  id: number;
  ref: string | null;
  number: string;
  validStart: Date;
  validEnd: Date;
  notes: string | null;
  isActive: boolean;
  updatedAt: Date;
  Loc: Location;
  locId: string;
  Commodity: Commodity;
  commodityId: number;
  Parameter: Parameter;
  parameterId: number;
  Method: Method;
  methodId: number;
  Unit: Unit;
  unitId: number;
}

export interface LogReviewStatus {
  id: number;
  name: string;
  minPRL: number;
  SpecMHLRs: SpecMHLR[] | null;
  SpecProductLRs: SpecProductLR[] | null;
  ReportCOQLRs: ReportCOQLR[] | null;
  ReportCOALRs: ReportCOALR[] | null;
  ReportTRLRs: ReportTRLR[] | null;
  ReportTrialBlendLRs: TrialBlendReportLR[] | null;
}

export interface SpecMH {
  id: number;
  publishedDate: Date;
  updatedAt: Date;
  isActive: boolean;
  isUse: boolean;
  isApproved: boolean | null;
  fileUrl: string | null;
  remark: string | null;
  notes: string | null;
  signerName: string | null;
  signerPosition: string | null;
  Olds: SpecMH[] | null;
  New: SpecMH | null;
  newId: number | null;
  MaterialHydro: MaterialHydro;
  materialId: number;
  Properties: SpecMHProperties[] | null;
  LogReviews: SpecMHLR[] | null;
  MHInSamples: MHInTestSample[] | null;
}

export interface SpecMHProperties {
  id: number;
  updatedAt: Date;
  notes: string | null;
  Parameter: Parameter;
  parameterId: number;
  Method: Method;
  methodId: number;
  Unit: Unit;
  unitId: number;
  isReported: boolean | null;
  fixNum: number | null;
  fixStr: string | null;
  minNum: number | null;
  minStr: string | null;
  typNum: number | null;
  typStr: string | null;
  maxNum: number | null;
  maxStr: string | null;
  resNum: number | null;
  resStr: string | null;
  Spec: SpecMH;
  specId: number;
  Types: SpecMHType[] | null;
  MHInResults: MHInTestResult[] | null;
}

export interface SpecMHLR {
  id: number;
  updatedAt: Date;
  Reviewed: SpecMH;
  reviewedId: number;
  status: LogReviewStatus;
  statusId: number;
  Profile: Profile;
  profileId: string;
  prevId: number | null;
  PrevStatus: SpecMHLR | null;
  NextStatus: SpecMHLR | null;
}

export interface SpecMHType {
  type: string;
  desc: string | null;
  updatedAt: Date;
  Properties: SpecMHProperties[] | null;
}

export interface SpecProduct {
  id: number;
  publishedDate: Date;
  updatedAt: Date;
  isActive: boolean;
  isUse: boolean;
  isApproved: boolean | null;
  fileUrl: string | null;
  remark: string | null;
  notes: string | null;
  name: string;
  Olds: SpecProduct[] | null;
  New: SpecProduct | null;
  newId: number | null;
  Product: Product;
  productId: number;
  Loc: Location;
  locId: string;
  TrialBlend: TrialBlend | null;
  trialBlendId: number | null;
  Components: SpecProductComponent[] | null;
  Properties: SpecProductProperties[] | null;
  LogReviews: SpecProductLR[] | null;
  BlendingRecords: BlendingRecord[] | null;
  MHInTBSamples: MHInTBTestSample[] | null;
}

export interface SpecProductComponent {
  id: number;
  qty: number;
  qtyVol?: any;
  UOM: Unit;
  uom: number;
  MaterialHydro: MaterialHydro;
  materialId: number;
  Spec: SpecProduct;
  specId: number;
  InitTests: SpecProductComponentInitTest[] | null;
}

export interface SpecProductComponentInitTest {
  id: number;
  initNum: number | null;
  initStr: string | null;
  ref: string | null;
  updatedAt: Date;
  Component: SpecProductComponent;
  componentId: number;
  Parameter: Parameter;
  parameterId: number;
  Method: Method;
  methodId: number;
  Unit: Unit;
  unitId: number;
}

export interface SpecProductProperties {
  id: number;
  updatedAt: Date;
  notes: string | null;
  isReported: boolean | null;
  fixNum: number | null;
  fixStr: string | null;
  minNum: number | null;
  minStr: string | null;
  typNum: number | null;
  typStr: string | null;
  maxNum: number | null;
  maxStr: string | null;
  resNum: number | null;
  resStr: string | null;
  Parameter: Parameter;
  parameterId: number;
  Method: Method;
  methodId: number;
  Unit: Unit;
  unitId: number;
  Spec: SpecProduct;
  specId: number;
  TQCType: TQCType[] | null;
  BlendingResults: BlendingTestResult[] | null;
  FillingResults: FillingTestResult[] | null;
  ProductTestResults: ProductTestResult[] | null;
  MHInTBResults: MHInTBTestResult[] | null;
  MHOutTestResults: MHOutTestResult[] | null;
}

export interface SpecProductLR {
  id: number;
  updatedAt: Date;
  Reviewed: SpecProduct;
  reviewedId: number;
  status: LogReviewStatus;
  statusId: number;
  Profile: Profile;
  profileId: string;
  prevId: number | null;
  PrevStatus: SpecProductLR | null;
  NextStatus: SpecProductLR | null;
}

export interface SpecCustom {
  id: number;
  updatedAt: Date;
  publishedDate: Date;
  name: string;
  desc: string | null;
  fileUrl: string | null;
  notes: string | null;
  Commodity: Commodity | null;
  commodityId: number | null;
  Properties: SpecCustomProperties[] | null;
}

export interface SpecCustomProperties {
  id: number;
  updatedAt: Date;
  notes: string | null;
  isReported: boolean | null;
  specFixNum: number | null;
  specFixStr: string | null;
  specMinNum: number | null;
  specMinStr: string | null;
  specTypNum: number | null;
  specTypStr: string | null;
  specMaxNum: number | null;
  specMaxStr: string | null;
  resNum: number | null;
  resStr: string | null;
  Parameter: Parameter;
  parameterId: number;
  Method: Method;
  methodId: number;
  Unit: Unit;
  unitId: number;
  Spec: SpecCustom;
  specId: number;
}

export interface TQCType {
  type: string;
  name: string;
  abbrev: string;
  desc: string | null;
  Properties: SpecProductProperties[] | null;
}

export interface MHInRecord {
  id: number;
  Loc: Location;
  locId: string;
  Spec: SpecMH;
  specId: number;
  siapId: number;
  batch: string;
  note: string;
  LogStatus: MHInRecordLS[] | null;
  MHSamples: MHInTestSample[] | null;
  MHTBSamples: MHInTBTestSample[] | null;
  ReportCOA: ReportCOA[];
}

export interface MHInRecordLS {
  id: number;
  Rec: MHInRecord;
  recId: number;
}

export interface MHInTestSample {
  id: number;
  name: string;
  notes: string | null;
  isUse: boolean;
  createdAt: Date;
  updatedAt: Date;
  CompositeTo: MHInTestSample | null;
  compositeToId: number | null;
  CompositeFrom: MHInTestSample[] | null;
  Rec: MHInRecord;
  recId: number;
  // Spec: SpecMH;
  // specId: number;
  TBSample: MHInTBTestSample | null;
  tbSampleId: number | null;
  Results: MHInTestResult[] | null;
}

export interface MHInTestResult {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  specStatus: boolean;
  specEval: SpecEval | null;
  isUse: boolean | null;
  resNum: number | null;
  resStr: string | null;
  notes: string | null;
  Sample: MHInTestSample | null;
  sampleId: number | null;
  Parameter: Parameter;
  parameterId: number;
  Method: Method;
  methodId: number;
  Unit: Unit;
  unitId: number;
  Spec: SpecMHProperties;
  specId: number;
  Profile: Profile;
  profileId: string;
}

export interface MHInTBTestSample {
  id: number;
  name: string;
  notes: string | null;
  isUse: boolean;
  createdAt: Date;
  updatedAt: Date;
  Rec: MHInRecord;
  recId: number;
  Spec: SpecProduct;
  specId: number;
  MHSamples: MHInTestSample[] | null;
  Results: MHInTBTestResult[] | null;
}

export interface MHInTBTestResult {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  specStatus: boolean;
  specEval: SpecEval | null;
  isUse: boolean | null;
  resNum: number | null;
  resStr: string | null;
  notes: string | null;
  Sample: MHInTBTestSample;
  sampleId: number;
  Parameter: Parameter;
  parameterId: number;
  Method: Method;
  methodId: number;
  Unit: Unit;
  unitId: number;
  Spec: SpecProductProperties;
  specId: number;
  Profile: Profile;
  profileId: string;
}

export interface MHOutRecord {
  id: number;
  Loc: Location;
  locId: string;
  LogStatus: MHOutRecordLS[] | null;
  Sampels: MHOutTestSample[] | null;
}

export interface MHOutRecordLS {
  id: number;
  Rec: MHOutRecord;
  recId: number;
}

export interface MHOutTestSample {
  id: number;
  name: string;
  notes: string | null;
  isUse: boolean;
  createdAt: Date;
  updatedAt: Date;
  Rec: MHOutRecord;
  recId: number;
  Results: MHOutTestResult[] | null;
}

export interface MHOutTestResult {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  specStatus: boolean;
  specEval: SpecEval | null;
  isUse: boolean | null;
  resNum: number | null;
  resStr: string | null;
  notes: string | null;
  Sample: MHOutTestSample | null;
  sampleId: number | null;
  Parameter: Parameter;
  parameterId: number;
  Method: Method;
  methodId: number;
  Unit: Unit;
  unitId: number;
  Spec: SpecProductProperties;
  specId: number;
  Profile: Profile;
  profileId: string;
}

export interface BlendingRecord {
  id: number;
  siapId: number;
  batch: string | null;
  urgent: boolean | null;
  notes: string | null;
  updatedAt: Date;
  Loc: Location;
  locId: string;
  Spec: SpecProduct;
  specId: number;
  COQ: ReportCOQ | null;
  coqId: number | null;
  FillingRecords: FillingRecord[] | null;
  LogStatus: BlendingRecordLS[] | null;
  Samples: BlendingTestSample[] | null;
  Reworks: BlendingRework[] | null;
}

export interface BlendingRecordLS {
  id: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  prevId: number | null;
  Prev: BlendingRecordLS | null;
  Next: BlendingRecordLS | null;
  Rec: BlendingRecord;
  recId: number;
  Profile: Profile;
  profileId: string;
  Samples: BlendingTestSample[] | null;
  Reworks: BlendingRework[] | null;
}

export interface BlendingTestSample {
  id: number;
  name: string;
  isUse: boolean;
  createdAt: Date;
  updatedAt: Date;
  CompositeTo: BlendingTestSample | null;
  compositeToId: number | null;
  CompositeFrom: BlendingTestSample[] | null;
  Rec: BlendingRecord;
  recId: number;
  LogStatus: BlendingRecordLS;
  statusId: number;
  Results: BlendingTestResult[] | null;
  Reworks: BlendingRework[] | null;
}

export interface BlendingTestResult {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  specStatus: boolean;
  specEval: SpecEval | null;
  isUse: boolean | null;
  resNum: number | null;
  resStr: string | null;
  notes: string | null;
  Sample: BlendingTestSample;
  sampleId: number;
  Parameter: Parameter;
  parameterId: number;
  Method: Method;
  methodId: number;
  Unit: Unit;
  unitId: number;
  Spec: SpecProductProperties;
  specId: number;
  Profile: Profile;
  profileId: string;
}

export interface BlendingRework {
  id: number;
  createdAt: Date;
  type: string | null;
  action: string | null;
  notes: string | null;
  Rec: BlendingRecord;
  recId: number;
  Sample: BlendingTestSample;
  sampleId: number;
  Status: BlendingRecordLS;
  statusId: number;
  Indicators: BlendingReworkIndicator[] | null;
  TrialBlends: BlendingReworkTrialBlend[] | null;
  Recomendations: BlendingReworkRecomendation[] | null;
}

export interface BlendingReworkIndicator {
  id: number;
  RW: BlendingRework;
  rwId: number;
}

export interface BlendingReworkTrialBlend {
  id: number;
  RW: BlendingRework;
  rwId: number;
}

export interface BlendingReworkRecomendation {
  id: number;
  RW: BlendingRework;
  rwId: number;
}

export interface FillingRecord {
  id: number;
  siapId: number;
  batch: string | null;
  urgent: boolean | null;
  notes: string | null;
  updatedAt: Date;
  Loc: Location;
  locId: string;
  BlendingRecord: BlendingRecord | null;
  blendingRecordId: number | null;
  COQ: ReportCOQ | null;
  coqId: number | null;
  LogStatus: FillingRecordLS[] | null;
  Samples: FillingTestSample[] | null;
  Reworks: FillingRework[] | null;
}

export interface FillingRecordLS {
  id: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  prevId: number | null;
  Prev: FillingRecordLS | null;
  Next: FillingRecordLS | null;
  Rec: FillingRecord | null;
  recId: number | null;
  Profile: Profile;
  profileId: string;
  Samples: FillingTestSample[] | null;
  Reworks: FillingRework[] | null;
}

export interface FillingTestSample {
  id: number;
  name: string;
  isUse: boolean;
  createdAt: Date;
  updatedAt: Date;
  CompositeTo: FillingTestSample | null;
  compositeToId: number | null;
  CompositeFrom: FillingTestSample[] | null;
  Rec: FillingRecord;
  recId: number;
  LogStatus: FillingRecordLS;
  statusId: number;
  Results: FillingTestResult[] | null;
  Reworks: FillingRework[] | null;
}

export interface FillingTestResult {
  id: number;
  resNum: number | null;
  resStr: string | null;
  Sample: FillingTestSample;
  sampleId: number;
  Parameter: Parameter;
  parameterId: number;
  Method: Method;
  methodId: number;
  Unit: Unit;
  unitId: number;
  Spec: SpecProductProperties;
  specId: number;
  Profile: Profile;
  profileId: string;
  FillingReworkIndicator: FillingReworkIndicator[] | null;
  specEval: SpecEval | null;
}

export interface FillingRework {
  id: number;
  createdAt: Date;
  type: string | null;
  action: string | null;
  notes: string | null;
  Rec: FillingRecord;
  recId: number;
  Sample: FillingTestSample;
  sampleId: number;
  Status: FillingRecordLS;
  statusId: number;
  Indicators: FillingReworkIndicator[] | null;
  TrialBlends: FillingReworkTrialBlend[] | null;
  Recomendations: FillingReworkRecomendation[] | null;
}

export interface FillingReworkIndicator {
  id: number;
  RW: FillingRework;
  rwId: number;
  Result: FillingTestResult;
  resultId: number;
}

export interface FillingReworkTrialBlend {
  id: number;
  RW: FillingRework;
  rwId: number;
}

export interface FillingReworkRecomendation {
  id: number;
  RW: FillingRework;
  rwId: number;
}

export interface ProductTestSample {
  id: number;
  name: string;
  notes: string | null;
  isUse: boolean;
  createdAt: Date;
  updatedAt: Date;
  Loc: Location;
  locId: string;
  Results: ProductTestResult[] | null;
}

export interface ProductTestResult {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  specStatus: boolean;
  specEval: SpecEval | null;
  isUse: boolean | null;
  resNum: number | null;
  resStr: string | null;
  notes: string | null;
  Sample: ProductTestSample;
  sampleId: number;
  Parameter: Parameter;
  parameterId: number;
  Method: Method;
  methodId: number;
  Unit: Unit;
  unitId: number;
  Spec: SpecProductProperties;
  specId: number;
  Profile: Profile;
  profileId: string;
}

export interface ReportCOQ {
  id: number;
  publishedDate: Date;
  updatedAt: Date;
  number: string | null;
  notes: string | null;
  Loc: Location;
  locId: string;
  LogReviews: ReportCOQLR[] | null;
  BlendingRecords: BlendingRecord[] | null;
  FillingRecords: FillingRecord[] | null;
  Customer: Customer;
  typecoq: string;
  jumlah: number;
  noSeal: string;
  noContainer: string;
  packingList: string;
  segelPertamina: string;
  tujuan: string;
  cc: string;
  tangki: string;
}

export interface Customer {
  id: number;
  poNumber: String;
  vehicleNum: String;
  poDate: Date | null;
  AgentTo: Company;
  agentId: Number;
  SoldTo: Company;
  soldToId: Number;
  ShipTo: Company;
  shipToId: Number;
  reportCOQId: Number;
  UserTo: Company;
  usertoid: number;
}

export interface ReportCOQLR {
  id: number;
  updatedAt: Date;
  Reviewed: ReportCOQ;
  reviewedId: number;
  status: LogReviewStatus;
  statusId: number;
  Profile: Profile;
  profileId: string;
  prevId: number | null;
  PrevStatus: ReportCOQLR | null;
  NextStatus: ReportCOQLR | null;
}

export interface ReportCOA {
  id: number;
  publishedDate: Date;
  updatedAt: Date;
  number: string | null;
  notes: string | null;
  Loc: Location;
  locId: string;
  Customer: Customer;
  customerId: number;
  LogReviews: ReportCOALR[] | null;
  IncomingRecords: MHInRecord[];
}

export interface ReportCOALR {
  id: number;
  updatedAt: Date;
  Reviewed: ReportCOA;
  reviewedId: number;
  status: LogReviewStatus;
  statusId: number;
  Profile: Profile;
  profileId: string;
  prevId: number | null;
  PrevStatus: ReportCOALR | null;
  NextStatus: ReportCOALR | null;
}

export interface ReportTR {
  id: number;
  publishedDate: Date;
  updatedAt: Date;
  number: string | null;
  notes: string | null;
  Loc: Location;
  locId: string;
  LogReviews: ReportTRLR[] | null;
}

export interface ReportTRLR {
  id: number;
  updatedAt: Date;
  Reviewed: ReportTR;
  reviewedId: number;
  status: LogReviewStatus;
  statusId: number;
  Profile: Profile;
  profileId: string;
  prevId: number | null;
  PrevStatus: ReportTRLR | null;
  NextStatus: ReportTRLR | null;
}

export interface Brand {
  id: number;
  name: string;
  Supliers: Company[] | null;
  Manufacturer: Company | null;
  manufacturerId: number | null;
}

export interface Asset {
  id: number;
  number: string;
  desc: string | null;
  Loc: Location;
  locId: string;
}

export interface Equipment {
  id: string;
  name: string;
}

export interface EquipmentCalibratedPart {
  id: number;
}

export interface EquipmentCalibrationLog {
  id: number;
}

export interface EquipmentServiceLog {
  id: number;
}

export interface Chemical {
  id: number;
  name: string;
  type: string;
}

export interface ChemicalStockIn {
  id: number;
}

export interface ChemicalStockOut {
  id: number;
}

export enum RoleGroup {
  super_admin = 'Super Admin',
  admin = 'Admin',
  user = 'User',
}

export enum DivisionGroup {
  it_engineer = 'IT Engineer',
  rnd = 'RnD',
  automation = 'Automation',
  laboratory = 'Laboratory',
  finance = 'Finance',
}

export enum ParameterType {
  PHYSICAL = 'PHYSICAL',
  CHEMICAL = 'CHEMICAL',
}

export enum TrialBlendStatus {
  DRAFTED = 'DRAFTED',
  RECEIVED = 'RECEIVED',
  ONPROGRESS = 'ONPROGRESS',
  PENDING = 'PENDING',
  FINISHED = 'FINISHED',
  CANCELED = 'CANCELED',
}

export enum SpecEval {
  ON = 'ON',
  BORDERLOW = 'BORDERLOW',
  BORDERHIGH = 'BORDERHIGH',
  OFFLOW = 'OFFLOW',
  OFFHIGH = 'OFFHIGH',
  REPORTED = 'REPORTED',
}
