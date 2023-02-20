export interface IScholarshipNetworkContext {
  domain: string;

  location: {
    city: {
      name: string;
      code: string;
    };
    country: {
      name: string;
      code: string;
    };
  };
  ttl?: string;
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
