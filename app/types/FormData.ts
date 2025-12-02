export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  industry: string;
  country: string;
  state: string | null;
  username: string;
  expertise: string;
  hasLocation: boolean;
  locationType: string;
  locationTypeOther: string | null;
  locationDetails: string | null;
  needsAuthorization: boolean;
  expectedAttendees: string | null;
  timeframe: string;
  otherDetails: string | null;
  acknowledgement: boolean;
}
