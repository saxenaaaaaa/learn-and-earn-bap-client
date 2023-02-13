import moment from "moment";
import { v4 as uuid } from "uuid";
import { IScholarshipNetworkContext } from "./schema";
export const buildContext = (input: any = {}) => {
  const context: IScholarshipNetworkContext = {
    domain: `${process.env.DOMAIN}${input?.category ?? "scholarships"}`,
    country: process.env.COUNTRY || (input?.country ?? ""),
    city: process.env.CITY || (input?.city ?? ""),
    action: input.action ?? "",
    core_version: `${
      process.env.CORE_VERSION || (input?.core_version ?? "")
    }-draft`,
    bap_id: process.env.BAP_ID || (input?.bapId ?? ""),
    bap_uri: process.env.BAP_URI || (input?.bapUri ?? ""),
    bpp_id: input?.bppId ?? "",
    bpp_uri: input?.bppUri ?? "",
    message_id: input?.messageId ?? uuid(),
    timestamp: input.timestamp ?? moment().toISOString()
  };
  return context;
};

export const buildSearchRequest = (input: any = {}) => {
  const context = buildContext({ action: "search", category: "scholarships" });
  const message: any = {
    intent: { item: {}, provider: {} }
  };

  const fulfillment: any = {
    customer: {
      person: {}
    }
  };
  const tags: any = [];
  if (input?.name) {
    message.intent.item = {
      ...message.intent.item,
      descriptor: {
        name: input?.name
      }
    };
  }
  if (input?.gender) {
    fulfillment.customer.person = {
      ...fulfillment.customer.person,
      gender: input?.gender
    };
  }
  if (input?.finStatus) {
    fulfillment.customer.person = {
      ...fulfillment.customer.person,
      tags: [
        ...tags,
        {
          code: "fin_status",
          list: [
            {
              code: "family_income",
              value: input?.finStatus?.family_income
            }
          ]
        }
      ]
    };
  }
  if (input?.casteCategory && input?.casteCategory.length) {
    input.casteCategory.forEach((caste: any) => {
      fulfillment.customer.person.tags.push({
        code: "caste_category",
        list: [
          {
            value: caste?.caste
          }
        ]
      });
    });
  }
  message.intent.provider = input?.categories?.map((category: any) => ({ desciptor :{ code: category?.code}}));
  
  if (Object.keys(fulfillment.customer.person).length) {
    message.intent.item.fulfillment = fulfillment;
  }

  return { payload: { context, message } };
};
export const buildSearchResponse = (response: any = {}, input: any = {}) => {
  const context = {
    transactionId: response?.context?.transaction_id ?? "",
    messageId: response?.context?.message_id,
    bppId: response?.context?.bpp_id,
    bppUri: response?.context?.bpp_uri
  };

  let scholarshipProviders: any = [];

  response?.message?.catalog["bpp/providers"].forEach((provider: any) => {
    const providerObj: any = {
      id: provider?.id,
      name: provider?.descriptor?.name,

      scholarships: provider?.items.map((scholarship: any) => {
        const categoryFound: any = provider?.categories?.find(
          (category: any) => category.id === scholarship.category_id
        );
        const fulfillmentFound: any = provider?.fulfillments?.find(
          (fullfilment: any) => fullfilment?.id === scholarship?.fulfillment_id
        );

        return {
          id: scholarship?.id,
          name: scholarship?.descriptor?.name,
          description: scholarship?.descriptor?.long_desc,
          amount: {
            amount: scholarship?.price?.value,
            currency: scholarship?.price?.currency
          },
          category: {
            id: categoryFound ? categoryFound?.id : "",
            name: categoryFound ? categoryFound?.descriptor?.name : "",
            code: categoryFound ? categoryFound?.descriptor?.code : ""
          },
          scholarshipDetails: {
            id: fulfillmentFound ? fulfillmentFound?.id : "",
            type: fulfillmentFound ? fulfillmentFound?.type : "",
            gender: fulfillmentFound
              ? fulfillmentFound?.customer?.person?.gender
              : "",
            applicationStartDate: fulfillmentFound
              ? fulfillmentFound?.start?.time?.timestamp
              : "",
            applicationEndDate: fulfillmentFound
              ? fulfillmentFound?.end?.time?.timestamp
              : "",
            supportContact: {
              name: fulfillmentFound ? fulfillmentFound?.contact?.name : "",
              phone: fulfillmentFound ? fulfillmentFound?.contact?.phone : "",
              email: fulfillmentFound ? fulfillmentFound?.contact?.email : ""
            },
            academicQualifications: fulfillmentFound
              ? fulfillmentFound?.customer?.person?.tags.find(
                  (tag: any) => tag.code === "academic_qualifications"
                )
                ? fulfillmentFound?.customer?.person?.tags
                    .find((tag: any) => tag.code === "academic_qualifications")
                    ?.list.map((li: any) => {
                      return {
                        code: li?.code,
                        name: li?.name,
                        value: li?.value
                      };
                    })
                : []
              : ""
          }
        };
      })
    };

    scholarshipProviders.push(providerObj);
  });

  return { context, scholarshipProviders };
};

export const buildInitRequest = (input: any = {}) => {
  return { payload: {} };
};
export const buildInitResponse = (response: any = {}, input: any = {}) => {};

export const buildConfirmRequest = (input: any = {}) => {
  return { payload: {} };
};
export const buildConfirmResponse = (response: any = {}, input: any = {}) => {};

export const buildStatusRequest = (input: any = {}) => {
  return { payload: {} };
};
export const buildStatusResponse = (response: any = {}, input: any = {}) => {};
