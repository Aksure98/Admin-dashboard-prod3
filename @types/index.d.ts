///////////////////////////
///////////////////////////
// Component Types(UI)

interface BreadCrumbProps {
  homeElement?: ReactNode;
  separator?: ReactNode;
  containerClasses?: string;
  listClasses?: string;
  activeClasses?: string;
  capitalizeLinks?: boolean;
  goBack?: boolean;
}

interface ButtonProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  hierarchy?: "primary" | "secondary" | "tertiary" | "link";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  destructive?: boolean;
  isLoading?: boolean;
  warning?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  href?: string;
  spinnerColor?: string;
  spinnerSize?: number;
  className?: string;
}

interface customInputProps {
  seeIcon?: boolean;
  size?: "sm" | "md";
  // inputType?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
  inputType?:
    | "default"
    | "iconLeading"
    | "leadingDropdown"
    | "trailingDropdown"
    | "leadingText"
    | "paymentMethod"
    | "tags"
    | "trailingButton";

  destructive?: boolean;
  state?: "placeholder" | "filled" | "focused" | "disabled";
  label?: string;
  hintText?: string;
  helpIcon?: React.ReactNode;
  icon?: React.ReactNode;
  dropdownOptions?: { label: string; value: string }[];
  leadingText?: string;
  trailingButton?: React.ReactNode;
  error?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  register?: any;
}

interface InputProps
  extends customInputProps, React.InputHTMLAttributes<HTMLInputElement> {}

interface TextAreaProps
  extends customInputProps, React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

interface SelectProps {
  size?: "sm" | "md";
  label?: string;
  hintText?: string;
  helpIcon?: boolean;
  icon?: React.ReactNode;
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  register?: any;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  options: { label: string; value: string }[]; // Correct type
  destructive?: boolean;
}

interface ToastUIProps {
  type: "success" | "error" | "loading" | "custom";
  message: string;
  duration?: number;
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  style?: React.CSSProperties;
  className?: string;
  iconTheme?: {
    primary: string;
    secondary: string;
  };
  icon?: JSX.Element | string | null;
  id?: string;
}

interface FormModalProps {
  title?: string;
  saveButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
  onSave: () => void;
  onCancel: () => void;
  children: ReactNode;
  isLoading?: boolean;
  saveIcon?: ReactNode;
  className?: string;
}

interface ErrorResponse {
  message: string;
}
interface signInProps {
  email: string;
  password: string;
}
interface forgotPasswordProps {
  email: string;
}
interface resetPasswordProps {
  new_password: string;
  reset_token: string;
}

interface AddUserProps {
  fullname: string;
  email: string;
  phoneNumber: number;
  role: string;
  region: string;
  status: boolean;
}

interface SingleCustomer {
  data: {
    id: number;
    user_id: string;
    first_name: string;
    last_name: string;
    middle_name: string | null;
    display_name: string | null;
    email: string;
    phone_number: string | null;
    avatar: string;
    bio: string;
    gender: string;
    date_of_birth: string | null;
    occupation: string;
    emergency_contact: string;
    languages: string[];
    status: string;
    user_type: string;
    kyc_level: string;
    kyc_status: string;
    is_email_verified: boolean;
    is_phone_verified: boolean;
    nin_verified: boolean;
    bvn_verified: boolean;
    last_active_at: string | null;
    created_at: string;
    updated_at: string;
    total_spend: string;
    total_trips: string;
    pay_later_limit: string;
  };
}

export interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  email: string;
  phone_number: string | null;
  avatar: string | null;
  status: string;
  verification_status: string;
  availability_status: string;
  availability: unknown[];
  is_email_verified: boolean;
  is_phone_verified: boolean;
  rating: number;
  rating_count: number;
  total_jobs: number;
  eta_minutes: number;
  service_type: string;
  service_offerings: unknown[];
  push_token: string;
  user_id: string;
  current_location: unknown | null;
  vehicle_info: unknown | null;
  vehicles: unknown[];
  documents: unknown[];
  earnings: unknown[];
  created_at: string;
  updated_at: string;
  state: string;
  city: string;
  streetAddress: string;
}

interface TeamMemberResponse {
  message: string;
  admins?: TeamDetails[];
  customers?: Customers[];
  operators?: Driver[];
  limit: number;
  page: number;
  total: number;
}
interface TeamStatResponse {
  message: string;
  data?: {
    active: number;
    suspended: number;
    inactive: number;
    total: number;
  };
}

interface OperatorStatResponse {
  data?: {
    active: number;
    banned: number;
    by_service_type?: {
      RIDES: number;
      TRUCK: number;
      TOWING: number;
      DELIVERY: number;
    };
    inactive: number;
    pending_verification: number;
    suspended: number;
    total: number;
    unverified: number;
    verified: number;
  };
  message: string;
}

interface DashboardStatResponse {
  message: string;
  data?: {
    active_cargo: number;
    active_deliveries: number;
    active_rides: number;
    active_sos_alerts: number;
    active_towing: number;
    active_trips: number;
    total_revenue: string;
    total_trips: number;
    total_users: number;
  };
}

interface OperatorsDetails {
  address: string;
  availability_status: string;
  current_booking_id: string;
  first_name: string;
  heading: number;
  last_name: string;
  last_seen_at: string;
  lat: number;
  lng: number;
  speed: number;
  user_id: string;
  ratings: number;
}

interface OperatorResponseList {
  data?: {
    operators?: OperatorsDetails[];
    total?: number;
  };
}

interface TripStatResponse {
  message: string;
  data?: {
    cancelled_trips: number;
    completed_today: number;
    ongoing_trips: number;
    scheduled_trips: number;
    total_revenue: string;
  };
}

interface LiveOperations {
  message: string;
  data?: {
    active_cargo: number;
    active_deliveries: number;
    active_rides: number;
    active_towing: number;
  };
}

interface RevenueMonthData {
  month: number;
  month_name: string;
  rides: number;
  delivery: number;
  cargo: number;
  towing: number;
  total: number;
}

interface SingleTeamMemberResponse {
  message: string;
  data: TeamDetails; // ✅ single object
}

interface ErrorResponse {
  message: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  created: string;
  lastLogin: string;
  region: string;
  phone: number;
  logo?: Array<{ url: string }>;
}

interface TeamDetails {
  id: string;
  email: string;
  full_name: string;
  phone_number: number;
  region: string;
  last_login_at: string;
  status: string;
  role?: {
    name: string;
    role_id: string;
  };
  created_at;
  image?: Array<{ url: string }>;
}

interface TripsDetailsResponse {
  id: string;
  assigned_operator_id: string;
  assigned_operator: {
    operator_id: string;
    name: string;
    rating: number;
    rating_count: number;
    vehicle_make: string;
    avatar_url: string;
  };
  customer: {
    email: string;
    first_name: string;
    full_name: string;
    last_name: string;
    phone_number: string;
    user_id: string;
    avatar: string;
  };
  payment_status: {
    status: string;
  };
  created_at: {
    seconds: string;
    nanos: number;
  };
  updated_at: {
    seconds: string;
    nanos: number;
  };
  scheduled_at: {
    seconds: string;
    nanos: number;
  };
  currency: string;
  destination: {
    latitude: number;
    longitude: number;
    address: string;
    state: string;
  };
  pickup: {
    latitude: number;
    longitude: number;
    address: string;
    state: string;
  };
  estimated_fare: number;
  fare_breakdown: string;
  payment_method: string;
  schedule_type: string;
  service_type: string;
  status: string;
  user_id: string;
  trip_completed_at: string;
  trip_started_at: string;
  cancelled_at: string;
}

interface CustomerDetail {
  id: string;
  name: string;
  documentNumber: number;
  document?: Array<{ url: string }>;
}

interface VerificationItemProps {
  label: string;
  field: string;
  verified: boolean;
}

interface CustomerTrips {
  data?: {
    bookings?: {
      id: string;
      type: string;
      operator: {
        name: string;
      };
      estimated_fare: number;
      date: string;
      status: string;
      payment_method: string;
      service_type: string;
      created_at: {
        nanos: number;
        seconds: string;
      };
    };
    limit: number;
    page: number;
    total: number;
  };
}

interface TripStat {
  id: string;
  label: string;
  value: number;
  allTips: CustomerTrips[];
}

interface CustomerTripBooking {
  id: string;
  type: string;
  assigned_operator: {
    name: string;
  };
  estimated_fare: number;
  date: string;
  status: string;
  payment_method: string;
  service_type: string;
  created_at: {
    nanos: number;
    seconds: string;
  };
}

interface CustomerTripsResponse {
  message: string;
  data?: {
    bookings: CustomerTripBooking[];
    limit: number;
    page: number;
    total: number;
  };
}

interface CustomerTripStat {
  data?: {
    total: number;
    cancelled: number;
    completed: number;
    delivery: number;
    rides: number;
    scheduled: number;
    towing: number;
    truck: number;
  };
}

interface Transaction {
  transaction_id: string;
  category: string;
  amount: number;
  transaction_type: string;
  status: string;
  created_at: string;
}

interface CustomerTransaction {
  created_at: number;
  amount: number;
  status: string;
  data?: {
    limit: number;
    page: number;
    total: number;
    transactions?: Transaction[];
  };
}

interface CustomerWallet {
  data?: {
    total: string;
    pay_later_limit: string;
    outstanding_balance: string;
  };
}

interface CustomerPaymentMethod {
  id: string;
  method: string;
  details: string;
}

interface PaymentStat {
  id: string;
  label: string;
  value: number;
  allTransaction: CustomerTransaction[];
  allPayment: CustomerPaymentMethod[];
}

interface CustomerRating {
  data?: {
    average_rating: number;
    total: number;
    rating?: {
      id: string;
      type: string;
      driver: string;
      rating: string;
      description: string;
    };
  };
}

interface Customer {
  // avatar: string | null; // URL to image
  avatar: Array<{ url: string }>;
  bio: string;
  created_at: string;
  date_of_birth: string | null;
  display_name: string | null;
  email: string;
  emergency_contact: string;
  first_name: string;
  gender: string;
  id: number;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  kyc_status: string | null;
  languages: string[];
  last_active_at: string | null;
  last_name: string;
  middle_name: string | null;
  occupation: string;
  phone_number: string | null;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  updated_at: string;
  user_id: string;
}

// id: string;
// user_id: string;
// display_name: string;
// email: string;
// status: string;
// created_at: string;
// lastLogin: string;
// region: string;
// phone: number;
// avatar?: Array<{ url: string }>;
// bio: string;
// date_of_birth: string;
// emergency_contact: string
// first_name: string;
// is_email_verified: boolean;
// is_phone_verified: boolean;
// kyc_status: string;
// languages: [];
// last_active_at: string;
// last_name: string;
// middle_name: string;
// occupation: string;
// phone_number: number;
// status: string;

interface ActivityLogs {
  id: string;
  eventType: string;
  description: string;
  time: string;
}

interface Roles {
  role_id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  permissions: Record<string, string[]>;
  description: string;
}

interface AddRoleProps {
  id?: string;
  roleName: string;
  permissions: Record<string, string[]>;
}

interface AddCustomerProps {
  fullName: string;
  email: string;
  phoneNumber: number;
}

interface AllTrips {
  id: string;
  type: string;
  image: Array<{ url: string }>;
  user: {
    name: string;
    email: string;
  };
  operator: {
    name: string;
    email: string;
    image: Array<{ url: string }>;
  };
  amount: number;
  status: string;
}

interface AllLost {
  id: string;
  user: {
    name: string;
    email: string;
    image: Array<{ url: string }>;
  };
  item: string;
  type: string;
  location: string;
  image: Array<{ url: string }>;
  status: string;
  date: string;
}

// Base Profile Type
interface AddBaseProfileProps {
  fullName: string;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  state: string;
  city: string;
}

interface BaseMemberResponse {
  message: string;
  data?: unknown; // replace with actual data structure
}

interface BaseDetail {
  id: string;
  name: string;
  documentNumber: number;
  document?: Array<{ url: string }>;
}

interface BaseTrips {
  id: string;
  type: string;
  customer: string;
  amount: number;
  packageType?: string;
  date: string;
  status: string;
}

interface BaseTripStat {
  id: string;
  label: string;
  value: number;
}

interface BaseEarningsStat {
  id: string;
  label: string;
  value: number;
}

interface BaseTransaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  date: string;
}

interface BasePaymentMethod {
  id: string;
  bankName: string;
  accountNumber: string;
}

interface BaseRating {
  id: string;
  rating: string;
  description: string;
}

interface BaseRatingStat {
  id: string;
  label: string;
  value: string;
}

interface AddRiderProps {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  streetAddress: string;
  state: string;
  city: string;
}

// Riders Props
interface RiderMemberResponse extends BaseMemberResponse {}
interface RiderDetail extends BaseDetail {}
interface RiderTrips extends BaseTrips {}
interface RiderTripStat extends BaseTripStat {
  allTrips: BaseTrips[];
}
interface RiderEarningsStat extends BaseEarningsStat {
  allRiderPayment: BasePaymentMethod[];
  allRiderTransaction: BaseTransaction[];
}
interface RiderTransaction extends BaseTransaction {}
interface RiderPaymentMethod extends BasePaymentMethod {}
interface RiderRating extends BaseRating {
  rider: string;
}
interface RiderRatingStat extends BaseRatingStat {
  allRiderRating: BaseRating[];
}

interface AddDriverProps {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  streetAddress: string;
  state: string;
  city: string;
}

// Drivers Type

interface DriverMemberResponse extends BaseMemberResponse {}
interface DriverDetail extends BaseDetail {}
interface DriverTrips extends BaseTrips {}
interface DriverTripStat extends BaseTripStat {
  allTrips: BaseTrips[];
}
interface DriverEarningsStat extends BaseEarningsStat {
  allDriverPayment: BasePaymentMethod[];
  allDriverTransaction: BaseTransaction[];
}
interface DriverTransaction extends BaseTransaction {}
interface DriverPaymentMethod extends BasePaymentMethod {}
interface DriverRating extends BaseRating {
  driver: string;
  serviceType: string;
}
interface DriverRatingStat extends BaseRatingStat {
  allDriverRating: BaseRating[];
}

// Operators Type
interface AddOperatorProps extends AddBaseProfileProps {}
interface OperatorMemberResponse extends BaseMemberResponse {}
interface OperatorDetail extends BaseDetail {}
interface OperatorTrips extends BaseTrips {}
interface OperatorTripStat extends BaseTripStat {
  allTrips: BaseTrips[];
}
interface OperatorEarningsStat extends BaseEarningsStat {
  allOperatorPayment: BasePaymentMethod[];
  allOperatorTransaction: BaseTransaction[];
}
interface OperatorTransaction extends BaseTransaction {}
interface OperatorPaymentMethod extends BasePaymentMethod {}
interface OperatorRating extends BaseRating {
  operator: string;
}
interface OperatorRatingStat extends BaseRatingStat {
  allOperatorRating: BaseRating[];
}

interface Vehicle {
  id: string;
  categoryName: string;
  serviceType: string;
  description: string;
  vehicleCount: number;
  status: string;
  vehicleType: string;
  minYear: string;
  maxYear: string;
}

interface ServiceZone {
  id: string;
  region: string;
  city: string;
  zone: string;
  service: string;
  status: string;
  operators: number;
}

interface Demands {
  id: string;
  zone: string;
  city: string;
  trend: number;
  requests: number;
  status: string;
  latitude?: number;
  longitude?: number;
  state?: string;
}

interface TeamStat {
  total: number;
  active: number;
  suspended: number;
  inactive: number;
}

interface UserNotification {
  id: string | number;
  title: string;
  message: string;
  createdAt: string | Date;
}

interface ForceEndRideProps {
  reason: string;
  details: string;
}
interface ReassignRideProps {
  operator_id: string;
  reason: string;
}

interface GetTeamMemberParams {
  page?: number;
  limit?: number;
  region?: string;
  search?: string;
}

interface GetCustomerParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

interface GetDriverParams {
  status?: string;
  verification_status?: string;
  search?: string;
  page?: number;
  limit?: number;
  service_type?: string;
  state?: string;
}

interface TripsListResponse {
  message: string;
  data?: TripsDetailsResponse[];

  limit: number;
  page: number;
  total: number;
}

interface GetTripsParams {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
  state?: string;
  service_type?: string;
}

interface GetLostParams {
  status?: string;
  period?: string;
  page?: number;
  limit?: number;
  state?: string;
}

interface GetNotificationParams {
  page?: number;
  limit?: number;
  service_type?: string;
}

interface DriverNotificationItem {
  notify_id: string;
  title: string;
  body: string;
  recipients: string;

  sent_count: string;
  status: string;
  send_type: string;
  read_count: number;
  id: string;
}

interface NotificationResponse {
  message: string;
  data?: {
    notifications: DriverNotificationItem[];
    total: number;
    page: number;
    limit: number;
  };
}

interface ComposeNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
  onSend?: (payload: {
    templateId: string;
    recipients: string;
    state?: string;
    driverId?: string;
    sendType: SendType;
    message: string;
  }) => void;
}

interface DriversWalletParams {
  search?: string;
  page?: number;
  page_size?: number;
  service_type?: string;
}

interface WalletItem {
  wallet_id: string;
  user_id: string;
  user_type: string;
  balance: string;
  currency: string;
  operator_name: string;
  service_type: string;
  created_at: string;
  total_earning: string;
  pending: string;
  status: string;
  last_transaction: string;
}

interface WalletResponseList {
  message: string;
  data?: {
    wallets: WalletItem[];
    page: number;
    page_size: number;
    total: number;
    total_balance: string;
    withdraws: string;
    pending: string;
  };
}

interface DashboardNotificationItem {
  booking_id: string;
  event_type: string;
  description: string;
  service_type: string;

  timestamp: string;
}

interface DashboardNotificationResponse {
  message: string;
  data?: DashboardNotificationItem[];
}

interface DriversDocumentParams {
  status?: string;
  page?: number;
  page_size?: number;
}

interface DocumentItem {
  user_id: string;
  id: string;
  operator_name: string;
  type: string;

  url?: string;
  expires_at: string;
  verification_status: string;
}

interface DocumentResponseList {
  message: string;
  data?: {
    documents: DocumentItem[];
    page: number;
    total: number;
    limit: number;
  };
}

interface VehicleInfo {
  plate_number: string;
  manufacturer: string;
  model: string;
  production_year: number;
  color: string;
  has_ac: boolean;
  load_capacity: number;
  license_number: string;
  license_expiration: string;
  insurance_exp: string;
  vehicle_license_number: string;
}

interface VerificationItem {
  service_type: string;
  nin_status: string;
  driver_license_status: string;
  vehicle_info_status: string;
  vehicle_insurance_status: string;
  is_complete: boolean;
  can_accept_jobs: boolean;
}

interface CustomerAddress {
  id: number;
  user_id: string;
  label: string;
  house_number: string;
  street_name: string;
  area: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  place_id: string;
  landmarks: string;
  access_code: string;
  instructions: string;
  is_default: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface DriverDocument {
  id: string;
  type: string;
  document_number: string;
  url: string;
  verification_status: string;
  rejection_reason: string;
  review_notes: string;
  source: string;
  expires_at: string;
  verified_at: string;
  created_at: string;
  updated_at: string;
}

interface OperatorDetails {
  id: string;
  user_id: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  service_type: string;
  total_earnings: number;
  status: string;
  gender: string;
  rating: number;
  rating_count: number;
  total_jobs: number;
  availability_status: string;
  current_location: unknown | null;
  verification_status: string;
  created_at: string;
  updated_at: string;
  date_of_birth: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  eta_minutes: number;
  push_token: string;
  vehicle_info: VehicleInfo | null;
  avatar: string | null;
  verifications: VerificationItem[];
  documents: DriverDocument[];
  availability: unknown[];
  earnings: unknown[];
  service_offerings: unknown[];
  vehicles: unknown[];
  state: string;
  streetAddress: string;
  city: string;
  addresses: CustomerAddress[];
  emergency_contacts: {
    name: string;
    number: number;
  };
}

interface SingleOperatorResponse {
  message: string;
  data?: OperatorDetails;
}

interface VehicleInfoDetails {
  photo_urls: string[];
  plate_number: string;
  manufacturer: string;
  model: string;
  production_year: number;
  color: string;
  has_ac: boolean;
  load_capacity: number;
  vehicle_license_number: string;
  vehicle_license_exp_date: string;
  towing_permit_number: string;
  towing_permit_exp_date: string;
  insurance_exp_date: string;
  service_category: string;
}

interface VehicleInfoResponse {
  message: string;
  data?: VehicleInfoDetails;
}

interface EditProps {
  category: string;
}

interface PerformanceRating {
  trip_id: string;
  rating: number;
  description: string;
  customer: string;
  driver: string;
  id: string;
}

interface OperatorPerformanceStats {
  average_rating_received: number;
  total_ratings_received: number;
  total_ratings_given: number;
  completed_trips: number;
  cancelled_trips: number;
  cancellation_rate: number;
  acceptance_rate: number;
  trips_per_hour: number;
  earnings_per_hour: number;
  disputes_filed_against: number;
  performanceRating: PerformanceRating[];
}

interface OperatorPerformanceResponse {
  message: string;
  data?: OperatorPerformanceStats;
}

interface TripStats {
  total: number;
  completed: number;
  cancelled: number;
  in_progress: number;
  rides: number;
  truck: number;
  delivery: number;
  towing: number;
}

interface TripStatsResponse {
  message: string;
  data?: TripStats;
}

interface TripsParams {
  status?: string;
  page?: number;
  limit?: number;
}

interface SingleTripDetails {
  trip_id: string;
  id: string;
  assigned_operator: {
    name: string;
  };
  customer: {
    name: string;
    avatar: string;
  };
  created_at: {
    seconds: string;
    nanos: number;
  };

  estimated_fare: string;
  date: string;
  status: string;
  payment_method: string;
  service_type: string;
  destination: {
    address: string;
    state: string;
  };
  pickup: {
    address: string;
    state: string;
  };
  payment_status: {
    status: string;
  };
}
interface SingleDriverTrips {
  message: string;
  data?: {
    bookings: SingleTripDetails[];
    total: number;
    page: number;
    limit: number;
  };
}

interface EarningsOverview {
  wallet_id: string;
  user_id: string;
  user_type: string;
  balance: string;
  currency: string;
  pay_later_status: string;
  pay_later_limit: string;
  pay_later_outstanding: string;
  created_at: string;
  account_number: string;
  account_name: string;
  bank_provider: string;
  total_earning: string;
  withdraw_amount: string;
}

interface EarningsOverviewResponse {
  message: string;
  data?: EarningsOverview;
}

interface EarningItem {
  id: string;
  amount: number;
  currency: string;
  source: string;
  job_id: string;
  created_at: string;
  booking_id: string;
}

interface OperatorEarningsResponse {
  message: string;
  data?: {
    earnings: EarningItem[];
    total: number;
    page: number;
    limit: number;
  };
}

interface VehicleCategory {
  id: number;
  name: string;
  service_type: string;
  vehicle_type: string;
  vehicle_weight: string;
  pricing_tier_code: string;
  min_year_required: number;
  max_year_required: number;
  description: string;
  is_active: boolean;
  vehicle_count: number;
  created_at: string;
  updated_at: string;
}

interface VehicleCategoryResponse {
  message: string;
  data?: {
    categories: VehicleCategory[];
    total: number;
    page: number;
    limit: number;
  };
}

interface VehicleParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface CreateVehicleCategoryProps {
  name: string;
  service_type: string;
  vehicle_type: string;
  min_year_required: number;
  max_year_required: number;
  description: string;
}

interface ServiceZoneStats {
  total_zones: number;
  active_zones: number;
  inactive_zones: number;
  regions: unknown[];
  by_service_type: unknown[];
}

interface ServiceZoneStatsResponse {
  message: string;
  data?: ServiceZoneStats;
}

interface ServiceZoneParams {
  page?: number;
  limit?: number;
  service_type?: string;
  state?: string;
}

interface ServiceZoneList {
  id: string;
  name: string;
  service_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  region: string;
  city: string;
  zone_name: string;
  service_type: string;
  operator_count: number;
  status: string;
}

interface ServiceZoneResponse {
  message: string;
  data?: {
    zones: ServiceZoneList[];
    total: number;
    page: number;
    limit: number;
  };
}

interface CreateServiceZoneProps {
  zone_name: string;
  city: string;
  region: string;
  service_type: string;
}

interface SOSStats {
  total: number;
  active: number;
  pending: number;
  resolved: number;
  resolve_rate: number;
  by_state: unknown[];
}

interface SOSStatsResponse {
  message: string;
  data?: SOSStats;
}

interface SosParams {
  state?: string;
  period?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface SOSAlert {
  id: string;
  report: string;
  user_name: string;
  operator_name: string;
  created_at: string;
  status: string;
}

interface SOSAlertsResponse {
  message: string;
  data?: {
    alerts: SOSAlert[];
    total: number;
    active: number;
    pending: number;
    resolved: number;
    page: number;
    limit: number;
  };
}

interface PricingTier {
  id: string;
  service_type: string;
  category: string;
  base_fare: number;
  updated_at: string;
}

interface PricingTierResponse {
  message: string;
  data: PricingTier[];
}

interface UpdatePricingTierProps {
  name: string;
  base_fare: number;
  per_km_rate: number;
  per_minute_rate: number;
  minimum_fare: number;
  booking_fee: number;
  is_active: boolean;
  id: string;
}

interface ExtraCharge {
  id: string;
  name: string;
  calculation: string;
  unit_price: number;
  is_active: boolean;
}

interface ExtraChargeResponse {
  message: string;
  data: ExtraCharge[];
}

interface UpdateExtraChargeProps {
  name: string;
  calculation: string;
  unit_price: number;
  is_active: boolean;
}

interface SurgeItems {
  id: string;
  min_ratio: number;
  max_ratio: number;
  multiplier: number;
  label: string;
  is_active: boolean;
}

interface SurgeResponse {
  message: string;
  data: SurgeItems[];
}

interface TimePricingZone {
  id: string;
  region: string;
  city_area: string;
  zone: string;
  multiplier: number;
  updated_at: string;
}

interface TimePricingZoneResponse {
  message: string;
  data?: {
    zones: SurgePricingZone[];
    total: number;
    page: number;
    limit: number;
  };
}

interface TrafficMultiplier {
  id: string;
  name: string;
  service: string;
  multiplier: number;
  typical_times: string;
  is_active: boolean;
  updated_at: string;
}

interface TrafficMultiplierResponse {
  message: string;
  data?: TrafficMultiplier[];
  // data?: {
  //   multipliers: TrafficMultiplier[];
  //   total: number;
  //   page: number;
  //   limit: number;
  // };
}

interface SurgePricingItems {
  id: string;
  name: string;
  region: string;
  city_area: string;
  zone: string;
  service: string;
  multiplier: number;
  is_active: boolean;
  updated_at: string;
}

interface SurgePricingResponse {
  message: string;
  data?: SurgePricingItems[];
  // data?: {
  //   multipliers: SurgePricingItems[];
  //   total: number;
  //   page: number;
  //   limit: number;
  // };
}

interface ExtraCharge {
  id: string;
  charges_name: string;
  service: string;
  type: string;
  amount: number;
  when_applied: string;
  updated_at: string;
}

interface ExtraChargeResponse {
  message: string;
  data?: {
    charges: ExtraCharge[];
    total: number;
    page: number;
    limit: number;
  };
}

interface DriverCommission {
  id: string;
  service: string;
  amount: number;
  updated_at: string;
}

interface DriverCommissionResponse {
  message: string;
  data?: DriverCommission[];
  // data?: {
  //   commissions: DriverCommission[];
  //   total: number;
  //   page: number;
  //   limit: number;
  // };
}

interface Coupon {
  id: string;
  name: string;
  code: string;
  description: string;
  city: string;
  discount_type: "PERCENTAGE" | "FIXED_AMOUNT";
  discount_value: number;
  max_discount_amount: number;
  min_order_value: number;
  max_usage_total: number;
  max_usage_per_user: number;
  current_usage_count: number;
  applicable_services: string[];
  applicable_tiers: string[];
  starts_at: string;
  expires_at: string;
  is_active: boolean;
  user_type: "ALL" | "FIRST_TIME" | "RETURNING";
  created_at: string;
  updated_at: string;
}

interface CouponMeta {
  total: number;
  active_count: number;
  total_redemptions: number;
  page: number;
  limit: number;
}

interface CouponListResponse {
  message: string;
  data: Coupon[];
  meta?: CouponMeta;
}

interface CouponStats {
  total_coupons: number;
  active_coupons: number;
  expired_coupons: number;
  total_redemptions: number;
  most_used_code: string;
  most_used_count: number;
}

interface CouponStatsResponse {
  message: string;
  data?: CouponStats;
}

interface GetCouponsParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface AddCouponProps {
  name: string;
  code: string;
  description: string;
  city: string;
  discount_type: "PERCENTAGE" | "FIXED";
  discount_value: number;
  max_discount_amount: number;
  min_order_value: number;
  applicable_services: string[];
  applicable_tiers?: string[];
  max_usage_total: number;
  max_usage_per_user: number;
  starts_at: string;
  expires_at: string;
  user_type: "ALL" | "FIRST_TIME" | "RETURNING";
}

interface AddCouponResponse {
  message: string;
  data?: Coupon;
}

interface SingleCouponResponse {
  message: string;
  data?: Coupon;
}

interface IncentiveStats {
  total_incentives: number;
  active_incentives: number;
  total_payouts: number;
  total_amount_paid_out: number;
  top_incentive_name: string;
  top_incentive_payout_count: number;
  total_usage_limit: number;
}

interface IncentiveStatsResponse {
  message: string;
  data?: IncentiveStats;
}

interface Incentive {
  id: string;
  name: string;
  discount_type: "PERCENTAGE" | "FIXED_AMOUNT";
  discount_value: number;
  starts_at: string;
  expires_at: string;
  user_type: string;
  condition: string;
  is_active: boolean;
  current_usage_count: number;
}

interface IncentiveMeta {
  total: number;
  active_count: number;
  total_usage_limit: number;
  page: number;
  limit: number;
}

interface IncentiveListResponse {
  message: string;
  data: Incentive[];
  meta?: IncentiveMeta;
}

interface SingleIncentive {
  id: string;
  name: string;
  discount_type: string;
  discount_value: number;
  starts_at: string;
  expires_at: string;
  user_type: string;
  condition: string;
  is_active: boolean;
  current_usage_count: number;
  created_at: string;
  updated_at: string;
}

interface SingleIncentiveResponse {
  message: string;
  data?: SingleIncentive;
}

interface AddIncentiveResponse {
  message: string;
  data?: Incentive;
}

interface TransactionStats {
  total_volume: string;
  total_credits: string;
  total_debits: string;
  total_refunds: string;
  transaction_count: number;
  credit_count: number;
  debit_count: number;
  refund_count: number;
  failed_count: number;
  pending_count: number;
}

interface TransactionStatsResponse {
  message: string;
  data?: TransactionStats;
}

interface TransactionList {
  id: string;
  user_details: {
    name: string;
    email: string;
  };
  service_type: string;
  payment_method: string;
  amount: number;
  status: string;
  description: string;
  category: string;
  created_at: string;
  transaction_id: string;
  user_type: string;
  transaction_type: string;
}

interface TransactionListResponse {
  message: string;
  data?: {
    transactions: TransactionList[];
    total: number;
    page: number;
    limit: number;
  };
}

interface GetTransactionsParams {
  page_size?: number;
  page?: number;
  search?: string;
}

interface PayLaterStats {
  total_outstanding_balance: string;
  due_this_week: number;
  paid_this_week: number;
  overdue_count: number;
}

interface PayLaterStatsResponse {
  message: string;
  data?: PayLaterStats;
}

interface GetPayLaterParams {
  page_size?: number;
  page?: number;
  search?: string;
  status?: string;
}

interface PayLaterList {
  id: string;
  user_details: {
    name: string;
    email: string;
  };
  service_type: string;
  amount: number;
  status: string;
  due_date: string;
}

interface PayLaterListResponse {
  message: string;
  data?: {
    record: PayLaterList[];
    total: number;
    page: number;
    page_size: number;
  };
}

interface ActivityLogUser {
  admin_id: string;
  full_name: string;
  initials: string;
  role: string;
  avatar: string;
}

interface ActivityLog {
  log_id: string;
  timestamp: string;
  user: ActivityLogUser;
  module: string;
  action: string;
  description: string;
  resource_id: string;
  ip_address: string;
  details: string;
}

interface ActivityLogResponse {
  message: string;
  data: ActivityLog[];
  total: number;
}

interface GetLogsParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface Integration {
  integration_id: string;
  name: string;
  label: string;
  description: string;
  category: string;
  is_active: boolean;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

interface IntegrationResponse {
  message: string;
  data: Integration[];
  total: number;
}

interface FeatureToggle {
  feature_id: string;
  name: string;
  label: string;
  description: string;
  category: string;
  is_active: boolean;
  is_system: boolean;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

interface FeatureToggleResponse {
  message: string;
  data: FeatureToggle[];
  total: number;
}

interface GeneralSettings {
  company_name: string;
  date_format: string;
  time_format: string;
  currency: string;
  timezone: string;
  logo_url: string;
  favicon_url: string;
  updated_at: string;
  updated_by: string;
  operator_search_radius_km: number;
}

interface GeneralSettingsResponse {
  message: string;
  data?: GeneralSettings;
}

interface UpdateSettingsProps {
  company_name: string;
  date_format: string;
  time_format: string;
  currency: string;
  timezone: string;
  operator_search_radius_km: number;
}

interface NotificationSetting {
  event_type: string;
  label: string;
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
}

interface NotificationSettingsResponse {
  message: string;
  data: NotificationSetting[];
}

interface LostAndFoundStats {
  total: number;
  reported: number;
  claimed: number;
  claim_rate: number;
  by_state: unknown[];
}

interface LostAndFoundStatsResponse {
  message: string;
  data?: LostAndFoundStats;
}

interface LostItem {
  id: string;
  ticket_id: string;
  ticket_number: string;
  booking_id: string;
  customer_id: string;
  item_title: string;
  item_category: string;
  status: string;
  preferred_contact: string;
  image_urls: string[];
  pickup_state: string;
  claimed_at: string;
  created_at: string;
}

interface LostItemsResponse {
  message: string;
  data?: {
    items: LostItem[];
    total: number;
    reported: number;
    claimed: number;
    page: number;
    limit: number;
  };
}

interface SingleLostItem {
  id: string;
  ticket_id: string;
  ticket_number: string;
  booking_id: string;
  customer_id: string;
  item_title: string;
  item_category: string;
  description: string;
  last_seen_location: string;
  preferred_contact: string;
  contact_value: string;
  status: string;
  image_urls: string[];
  pickup_state: string;
  claimed_at: string;
  claimed_by: string;
  claim_notes: string;
  created_at: string;
  updated_at: string;
}

interface SingleLostItemResponse {
  message: string;
  data?: SingleLostItem;
}

interface BaseFareItem {
  id: string;
  service: string;
  category: string;
  amount: number;
  last_updated: string | null;
}

interface DistancePricingItem {
  id: string;
  service: string;
  category: string;
  per_km: number;
  last_updated: string | null;
}

interface TimePricingItem {
  id: string;
  service: string;
  category: string;
  per_min: number;
  last_updated: string | null;
}

interface BookingFeeItem {
  id: string;
  service: string;
  category: string;
  amount: number;
  last_updated: string | null;
}

interface MinimumFareItem {
  id: string;
  service: string;
  category: string;
  amount: number;
  last_updated: string | null;
}

interface TrafficMultiplierItem {
  level: string;
  multiplier: number;
  description: string;
  is_active: boolean;
}

interface SurgePricingItem {
  id: string;
  min_ratio: number;
  max_ratio: number;
  multiplier: number;
  label: string;
  is_active: boolean;
  metadata: string;
}

interface ExtraChargeItem {
  id: string;
  type: string;
  name: string;
  calculation: string;
  unit_price: number;
  is_active: boolean;
  metadata: string;
}

interface CommissionItem {
  id: string;
  service: string;
  percentage: number;
  is_active: boolean;
  last_updated: string | null;
}

interface PricingSummaryData {
  base_fare: BaseFareItem[];
  distance_pricing: DistancePricingItem[];
  time_pricing: TimePricingItem[];
  booking_fee: BookingFeeItem[];
  minimum_fare: MinimumFareItem[];
  zone_multipliers: unknown[];
  traffic_multipliers: TrafficMultiplierItem[];
  surge_pricing: SurgePricingItem[];
  extra_charges: ExtraChargeItem[];
  commission: CommissionItem[];
}

interface PricingSummaryResponse {
  statusCode: number;
  message: string;
  data?: PricingSummaryData;
}

interface PricingTierItems {
  id: string;
  name: string;
  tier_code: string;
  description: string;
  base_fare: number;
  per_km_rate: number;
  per_minute_rate: number;
  minimum_fare: number;
  booking_fee: number;
  currency: string;
  is_active: boolean;
  priority: number;
  max_passengers: number;
  max_weight_kg: number;
  vehicle_types: string[];
  metadata: string;
  legacy_distance_rules: string;
}

interface PricingTierResponse {
  statusCode: number;
  message: string;
  data: PricingTierItems[];
}

interface TransactionSingleItem {
  id: string;
  transaction_id: string;
  reference: string;
  category: string;
  transaction_type: string;
  amount: string;
  transaction_fee: string;
  previous_balance: string;
  new_balance: string;
  status: string;
  description: string;
  created_at: string;
  job_type: string;
  job_id: string;
  metadata_json: string;
  extra_details_json: string;
}

interface TransactionListResponse {
  message: string;
  data?: {
    transactions: TransactionSingleItem[];
    total: number;
    page: number;
    page_size: number;
  };
}

// Notification Templates

interface NotificationTemplate {
  id: string;
  title: string;
  message: string;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
}

// Generic API Response type
interface ApiResponse<T> {
  statusCode?: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

type NotificationTemplateResponse = ApiResponse<NotificationTemplate[]>;

interface NotificationTemplatePayload {
  title: string;
  message: string;
}

// Push Notifications
interface PushNotification {
  id: string;
  broadcast_id: string;
  title: string;
  message: string;
  channels: string[];
  template_id: string;
  recipient_group: string;
  recipient_count: number;
  read_count: number;
  status: "SENT" | "SCHEDULED" | "PENDING";
  scheduled_at: string;
  sent_at: string;
  created_at: string;
}

type PushNotificationResponse = ApiResponse<PushNotification[]>;

interface SendPushNotificationPayload {
  recipient_group: string;
  custom_user_ids?: string[];
  template_id: string;
  title?: string;
  message?: string;
  channels: string[];
  scheduled?: boolean;
  scheduled_at?: string;
}

interface SendPushNotificationResponse {
  statusCode?: number;
  message: string;
  data?: {
    id: string;
    status: string;
  };
}

interface GetPushNotificationsParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface GetNotificationTemplatesParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Event Notification

interface EventNotification {
  id: string;
  rule_id?: string;
  condition: string;
  condition_event: string;
  trigger_threshold: number;
  threshold_unit: string;
  template_id: string;
  recipient_group: string;
  channels: string[];
  is_active: boolean;
  title?: string;
  message?: string;
  custom_user_ids?: string[];
}

type EventNotificationResponse = ApiResponse<EventNotification[]>;

interface EventNotificationPayload {
  condition: string;
  condition_event: string;
  trigger_threshold: number;
  threshold_unit: string;
  template_id: string;
  recipient_group: string;
  channels: string[];
  is_active?: boolean;
  custom_user_ids?: string[];
}

type SendEventNotificationPayload = EventNotificationPayload;
type UpdateEventNotificationPayload = Omit<
  EventNotificationPayload,
  "is_active"
>;
interface ToggleEventNotificationPayload {
  is_active: boolean;
}

interface SendEventNotificationResponse {
  statusCode?: number;
  message: string;
  data?: {
    id: string;
    status: string;
  };
}

interface GetEventNotificationsParams {
  page?: number;
  limit?: number;
  search?: string;
}

// 1. Strict Backend Data Types (Exactly what the backend returns)

interface BackendAreaRecord {
  zone_name: string;
  city: string;
  state: string;
  requests: number;
  prior_requests: number;
  // You can add any other specific fields that log out inside the areas array
}

interface BackendHeatPointRecord {
  lat: number;
  lng: number;
  count: number;
}

interface HeatMapPayload {
  areas: BackendAreaRecord[];
  heat_points: BackendHeatPointRecord[];
  period_label: string;
  prior_label: string;
  total_requests: number;
}

type HeatMapResponse = ApiResponse<HeatMapPayload>;
type HeatMapAreasResponse = ApiResponse<HeatMapPayload>;

// 2. Normalized Frontend Types (What your UI components consume)

interface HeatMapPoint {
  id: string; // Generated in your normalizer
  latitude: number; // Mapped from lat
  longitude: number; // Mapped from lng
  count: number; // Mapped from count
}

interface HeatMapData {
  points: HeatMapPoint[];
  areas: Demands[]; // Assuming Demands is exported from your @types
  period_label: string;
  prior_label: string;
  total_requests: number;
}

// 3. API Params (Unchanged, as these are what you send TO the backend)

interface HeatMapParams {
  period?: string;
  start_date?: string;
  end_date?: string;
  state?: string;
  service_type?: string;
}

interface HeatMapAreasParams extends HeatMapParams {
  tab?: "top" | "low";
}

export type ServiceType = "RIDES" | "TRUCK" | "DELIVERY" | "TOWING";




// Notification Templates

interface NotificationInbox {
  id: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

type NotificationInboxResponse = ApiResponse<NotificationInbox[]>;

interface NotificationInboxPayload {
  page?: number;
  pageSize?: number;
}
