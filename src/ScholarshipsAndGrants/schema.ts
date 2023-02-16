export interface IScholarshipNetworkContext {
  domain: string;
  country: string;
  city: string;
  action: string;
  version: string;
  transaction_id: string;
  bap_id: string;
  bap_uri: string;
  bpp_id?: string;
  bpp_uri?: string;
  message_id: string;
  timestamp: string;
}
