import moment from "moment";
import { v4 as uuid } from "uuid";
import { IScholarshipNetworkContext } from "./schema";
export const buildContext = (input: any = {}) => {
  const context: IScholarshipNetworkContext = {
    domain: `${process.env.DOMAIN}${input?.category ?? "scholarships"}`,
    country: process.env.COUNTRY || (input?.country ?? ""),
    city: process.env.CITY || (input?.city ?? ""),
    action: input.action ?? "",
    version: `${process.env.CORE_VERSION || (input?.core_version ?? "")}`,
    transaction_id: input?.transactionId ?? uuid(),
    bap_id: process.env.BAP_ID || (input?.bapId ?? ""),
    bap_uri: process.env.BAP_URI || (input?.bapUri ?? ""),
    bpp_id: input?.bppId,
    bpp_uri: input?.bppUri,
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
  if (input?.casteCategory?.length) {
    input?.casteCategory?.forEach((caste: any) => {
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
  message.intent.provider = { categories: input?.categories?.map((category: any) => ({ descriptor: { code: category?.code } })) };

  if (Object.keys(fulfillment?.customer?.person ?? {})?.length) {
    message.intent.fulfillment = fulfillment;
  }

  return { payload: { context, message } };
};
export const buildSearchResponse = (res: any = {}, body: any = {}) => {
  const response = res?.data?.responses?.[0];
  console.log("response", response);
  if (!response)
    return { status: 200 };

  const context = {
    transactionId: response?.context?.transaction_id,
    bppId: response?.context?.bpp_id,
    bppUri: response?.context?.bpp_uri,
  };


  const scholarshipProviders = response?.message?.catalog?.providers?.map((provider: any) => ({
    id: provider?.id,
    name: provider?.descriptor?.name,
    scholarships: provider?.items?.map((item: any) => ({
      id: item?.id,
      name: item?.desciptor?.name,
      description: item?.descriptor?.long_desc,
      amount: {
        amount: item?.price?.value,
        currency: item?.price?.currency,
      },
      categories: provider?.categories?.filter((category: any) => item.category_ids?.find((category_id: any) => category_id == category?.id))
        ?.map((category: any) => ({ id: category?.id, code: category?.descriptor?.code, name: category?.descriptor?.name })),
      scholarshipDetails: provider?.fulfillments?.filter((fulfillment: any) => item?.fulfillment_ids?.find((fulfillment_id: any) => fulfillment_id == fulfillment?.id))
        ?.map((fulfillment: any) => ({
          id: fulfillment?.id,
          type: fulfillment?.type,
          gender: fulfillment?.customer?.person?.gender,
          applicationStartDate: fulfillment.stops?.find((stop: any) => stop?.type == "APPLICATION-START")?.time?.timestamp,
          applicationEndDate: fulfillment.stops?.find((stop: any) => stop?.type == "APPLICATION-END")?.time?.timestamp,
          supportContact: fulfillment?.contact,
          academicQualifications: fulfillment?.customer?.person?.tags?.find((tag: any) => tag?.code == "academic_qualifications")
            ?.list?.map((li: any) => ({ code: li?.code, name: li?.name, value: li?.value }))
        }))
    }))
  }));

  return { data: { context, scholarshipProviders } };
};

export const buildSelectRequest = (input: any = {}) => {
  const payload = {
    context: buildContext({ ...(input?.context ?? {}), action: 'select' }),
    message: {
      order: {
        provider: { id: input?.scholarshipProiderId }, items: [{ id: input?.scholarshipId }]
      }
    }
  }
  return { payload };
}

export const buildSelectResponse = (res: any = {}, input: any = {}) => {
  const response = res?.data?.responses?.[0];
  if (!response)
    return { status: 200 };

  const context = {
    transactionId: response?.context?.transaction_id,
    bppId: response?.context?.bpp_id,
    bppUri: response?.context?.bpp_uri,
  };

  const provider = response?.message?.order?.provider;

  const scholarshipProviders = [{
    id: provider?.id,
    name: provider?.descriptor?.name,
    description: provider?.descriptor?.long_desc ?? provider?.descriptor?.short_desc,
    scholarships: response?.message?.order?.items?.map((item: any) => ({
      id: item?.id,
      name: item?.desciptor?.name,
      description: item?.descriptor?.long_desc,
      amount: {
        amount: item?.price?.value,
        currency: item?.price?.currency,
      },
      additionalForm: {
        url: item?.xinput?.form?.url,
        mime_type: item?.xinput?.form?.mime_type,
      },
      academicQualifications: item.tags?.find((tag: any) => tag?.descriptor?.code == "edu_qual")
        ?.list?.map((li: any) => ({ code: li?.descriptor?.code, name: li?.descriptor?.name, value: li?.value })),
      categories: response?.message?.order?.categories?.filter((category: any) => item.category_ids?.find((category_id: any) => category_id == category?.id))
        ?.map((category: any) => ({ id: category?.id, code: category?.descriptor?.code, name: category?.descriptor?.name })),
      // scholarshipDetails: response?.message?.order?.fulfillments?.filter((fulfillment: any) => item?.fulfillment_ids?.find((fulfillment_id: any) => fulfillment_id == fulfillment?.id))
      //   ?.map((fulfillment: any) => ({
      //     id: fulfillment?.id,
      //     type: fulfillment?.type,
      //     gender: fulfillment?.customer?.person?.gender,
      //     applicationStartDate: fulfillment.stops?.find((stop: any) => stop?.type == "APPLICATION-START")?.time?.timestamp,
      //     applicationEndDate: fulfillment.stops?.find((stop: any) => stop?.type == "APPLICATION-END")?.time?.timestamp,
      //     supportContact: fulfillment?.contact,
      //     academicQualifications: fulfillment?.customer?.person?.tags?.find((tag: any) => tag?.code == "edu_qual")
      //       ?.list?.map((li: any) => ({ code: li?.code, name: li?.name, value: li?.value }))
      //   }))

      scholarshipDetails: response?.message?.order?.fulfillments?.map((fulfillment: any) => ({
        id: fulfillment?.id,
        type: fulfillment?.type,
        gender: fulfillment?.customer?.person?.gender,
        applicationStartDate: fulfillment.stops?.find((stop: any) => stop?.type == "APPLICATION-START")?.time?.timestamp,
        applicationEndDate: fulfillment.stops?.find((stop: any) => stop?.type == "APPLICATION-END")?.time?.timestamp,
        supportContact: fulfillment?.contact,
        academicQualifications: fulfillment?.customer?.person?.tags?.find((tag: any) => tag?.code == "edu_qual")
          ?.list?.map((li: any) => ({ code: li?.code, name: li?.name, value: li?.value }))
      }))
    }))
  }];

  return { data: { context, scholarshipProviders } };
}


export const buildInitRequest = (input: any = {}) => {
  const context = buildContext({
    ...input?.context,
    category: "scholarships",
    action: "init"
  });
  const { scholarshipProvider = {} } = input;
  const message: any = {
    order: {
      provider: {
        id: scholarshipProvider?.id,
        category_id: scholarshipProvider?.categoryId,
        descriptor: {
          name: scholarshipProvider?.name
        },
        items: scholarshipProvider?.scholarships?.map((scholarship: any) => {
          return {
            id: scholarship?.id,
            descriptor: {
              name: scholarship?.name
            },
            price: {
              currency: scholarship?.amount?.currency,
              value: scholarship?.amount?.amount?.toString()
            },
            xinput: {
              required: true,
              form: {
                url: scholarship?.additionalForm?.url,
                mime_type: scholarship?.additionalForm?.urmimeTypel,
                submission_id: scholarship?.additionalForm?.submissionId
              }
            },
            tags: [{
              code: "academic_qualifications",
              name: "Academic Qualifications",
              list: scholarship.scholarshipDetails?.scholarshipRequestor?.academicQualifications.map(
                (qualification: any) => ({ descriptor: { code: qualification?.code, name: qualification?.name }, value: qualification?.value })
              )
            }, {
              code: "current_education",
              name: "Current Education",
              list: scholarship?.scholarshipDetails?.scholarshipRequestor?.currentEducations.map(
                (education: any) => ({ descriptor: { code: education?.code, name: education?.name }, value: education?.value })
              )
            }],
            category_ids: [scholarshipProvider?.categoryId]
          };
        }),
        fulfillments: scholarshipProvider?.scholarships?.map(
          (scholarship: any) => {
            let tags: any = [];
            const { scholarshipDetails = {} } = scholarship;

            return {
              id: scholarshipDetails?.id,
              type: scholarshipDetails?.type,
              customer: {
                person: {
                  id: scholarshipDetails?.scholarshipRequestor?.id,
                  name: scholarshipDetails?.scholarshipRequestor?.name,
                  gender: scholarshipDetails?.scholarshipRequestor?.gender,
                },
                contact: {
                  address: {
                    full: scholarshipDetails?.scholarshipRequestor
                      ?.scholarshipRequestorContact?.address,
                    format:
                      scholarshipDetails?.scholarshipRequestor
                        ?.scholarshipRequestorContact?.addressFormat
                  }
                }
              }
            };
          }
        )
      }
    }
  };

  return { payload: { context, message } };
};
export const buildInitResponse = (response: any = {}, input: any = {}) => {
  const context = {
    transactionId: response?.context?.message_id,
    bppId: response?.context?.bpp_id,
    bppUri: response?.context?.bpp_uri
  };

  const { order = {} } = response?.message;

  const scholarshipApplicationId = order?.id;

  const scholarshipProvider: any = {
    id: order?.provider?.id,
    name: order?.provider?.descriptor?.name,
    categoryId: order?.provider?.category_id,
    scholarships: order?.provider?.items.map((scholarship: any) => {
      const fulfillmentFound: any = order?.provider?.fulfillments?.find(
        (elem: any) => elem?.id === scholarship?.fulfillment_id
      );

      const academicQualifications = fulfillmentFound
        ? fulfillmentFound?.customer?.person?.tags.find(
          (tag: any) => tag?.code === "academic_qualifications"
        )
          ? fulfillmentFound?.customer?.person?.tags
            .find((tag: any) => tag?.code === "academic_qualifications")
            .list.map((li: any) => li)
          : []
        : "";

      const currentEducations = fulfillmentFound
        ? fulfillmentFound?.customer?.person?.tags.find(
          (tag: any) => tag?.code === "current_education"
        )
          ? fulfillmentFound?.customer?.person?.tags
            .find((tag: any) => tag?.code === "current_education")
            .list.map((li: any) => li)
          : []
        : "";

      return {
        id: scholarship?.id,
        name: order?.provider?.descriptor?.name,
        description: scholarship?.descriptor?.name,
        amount: {
          amount: scholarship?.price?.value,
          currency: scholarship?.price?.currency
        },
        categoryId: scholarship?.category_id,
        additionalForm: {
          url: scholarship?.xinput_required?.xinput?.form?.url,
          mime_type: scholarship?.xinput_required?.xinput?.form?.mime_type
        },
        scholarshipDetails: {
          id: fulfillmentFound ? fulfillmentFound?.id : "",
          type: fulfillmentFound ? fulfillmentFound?.type : "",
          scholarshipStatus: {
            code: fulfillmentFound
              ? fulfillmentFound?.state?.descriptor?.code
              : "",
            description: fulfillmentFound
              ? fulfillmentFound?.state?.descriptor?.short_desc
              : "",
            updatedAt: fulfillmentFound
              ? fulfillmentFound?.state?.updated_at
              : "",
            updatedBy: fulfillmentFound
              ? fulfillmentFound?.state?.updated_by
              : ""
          },
          scholarshipRequestor: {
            id: fulfillmentFound ? fulfillmentFound?.customer?.person?.id : "",
            name: fulfillmentFound
              ? fulfillmentFound?.customer?.person?.name
              : "",
            gender: fulfillmentFound
              ? fulfillmentFound?.customer?.person?.gender
              : "",

            scholarshipRequestorContact: {
              address: fulfillmentFound
                ? fulfillmentFound?.customer?.contact?.address?.full
                : "",
              addressFormat: fulfillmentFound
                ? fulfillmentFound?.customer?.contact?.address?.format
                : ""
            },
            academicQualifications,
            currentEducations
          }
        }
      };
    })
  };

  return { context, scholarshipApplicationId, scholarshipProvider };
};

export const buildConfirmRequest = (input: any = {}) => {
  const context = buildContext({
    ...input?.context,
    category: "scholarships",
    action: "confirm"
  });
  const { scholarshipProvider = {} } = input;
  const message: any = {
    order: {
      id: input?.scholarshipApplicationId,
      provider: {
        id: scholarshipProvider?.id,
        category_id: scholarshipProvider?.categoryId,
        descriptor: {
          name: scholarshipProvider?.name
        },
        fulfillments: scholarshipProvider?.scholarships.map(
          (scholarship: any) => {
            let tags: any = [];
            const { scholarshipDetails = {} } = scholarship;
            if (
              scholarshipDetails?.scholarshipRequestor
                ?.academicQualifications &&
              scholarshipDetails?.scholarshipRequestor?.academicQualifications
                ?.length
            ) {
              tags.push({
                code: "academic_qualifications",
                name: "Academic Qualifications",
                list: scholarshipDetails?.scholarshipRequestor?.academicQualifications.map(
                  (qualification: any) => {
                    return {
                      code: qualification?.code,
                      name: qualification?.name,
                      value: qualification?.value
                    };
                  }
                )
              });
            }

            if (
              scholarshipDetails?.scholarshipRequestor?.currentEducations &&
              scholarshipDetails?.scholarshipRequestor?.currentEducations
                ?.length
            ) {
              tags.push({
                code: "current_education",
                name: "Current Education",
                list: scholarshipDetails?.scholarshipRequestor?.currentEducations.map(
                  (education: any) => {
                    return {
                      code: education?.code,
                      name: education?.name,
                      value: education?.value
                    };
                  }
                )
              });
            }

            return {
              id: scholarshipDetails?.id,
              type: scholarshipDetails?.type,
              customer: {
                person: {
                  id: scholarshipDetails?.scholarshipRequestor?.id,
                  name: scholarshipDetails?.scholarshipRequestor?.name,
                  gender: scholarshipDetails?.scholarshipRequestor?.gender,
                },
                contact: {
                  address: {
                    full: scholarshipDetails?.scholarshipRequestor
                      ?.scholarshipRequestorContact?.address,
                    format:
                      scholarshipDetails?.scholarshipRequestor
                        ?.scholarshipRequestorContact?.addressFormat
                  }
                }
              }
            };
          }
        ),
        items: scholarshipProvider?.scholarships.map((scholarship: any) => {
          return {
            id: scholarship?.id,
            descriptor: {
              name: scholarship?.name
            },
            price: {
              currency: scholarship?.amount?.currency,
              value: scholarship?.amount?.amount
            },
            category_id: scholarshipProvider.categoryId,
            fulfillment_id: scholarship?.scholarshipDetails?.id,
            xinput: {
              "required": true,
              form: {
                url: scholarship?.additionalForm?.url,
                mime_type: scholarship?.additionalForm?.urmimeTypel,
                submission_id: scholarship?.additionalForm?.submissionId
              }
            },
            tags: [{
              code: "academic_qualifications",
              name: "Academic Qualifications",
              list: scholarship.scholarshipDetails?.scholarshipRequestor?.academicQualifications.map(
                (qualification: any) => ({ descriptor: { code: qualification?.code, name: qualification?.name }, value: qualification?.value })
              )
            }, {
              code: "current_education",
              name: "Current Education",
              list: scholarship?.scholarshipDetails?.scholarshipRequestor?.currentEducations.map(
                (education: any) => ({ descriptor: { code: education?.code, name: education?.name }, value: education?.value })
              )
            }]
          };
        })
      }
    }
  };
  return { payload: { context, message } };
};
export const buildConfirmResponse = (response: any = {}, input: any = {}) => {
  const context = {
    transactionId: response?.context?.message_id,
    bppId: response?.context?.bpp_id,
    bppUri: response?.context?.bpp_uri
  };

  const { order = {} } = response?.message;

  const scholarshipApplicationId = order?.id;

  const scholarshipProvider: any = {
    id: order?.provider?.id,
    name: order?.provider?.descriptor?.name,

    scholarships: order?.provider?.items.map((scholarship: any) => {
      const fulfillmentFound: any = order?.provider?.fulfillments?.find(
        (elem: any) => elem?.id === scholarship?.fulfillment_id
      );

      return {
        id: scholarship?.id,
        name: order?.provider?.descriptor?.name,
        amount: {
          amount: scholarship?.price?.value,
          currency: scholarship?.price?.currency
        },

        scholarshipDetails: {
          id: fulfillmentFound ? fulfillmentFound?.id : "",
          type: fulfillmentFound ? fulfillmentFound?.type : "",
          scholarshipStatus: {
            code: fulfillmentFound
              ? fulfillmentFound?.state?.descriptor?.code
              : "",
            description: fulfillmentFound
              ? fulfillmentFound?.state?.descriptor?.short_desc
              : "",
            updatedAt: fulfillmentFound
              ? fulfillmentFound?.state?.updated_at
              : "",
            updatedBy: fulfillmentFound
              ? fulfillmentFound?.state?.updated_by
              : ""
          }
        }
      };
    })
  };

  return { context, scholarshipApplicationId, scholarshipProvider };
};

export const buildStatusRequest = (input: any = {}) => {
  const context = buildContext({
    ...input?.context,
    category: "scholarships",
    action: "status"
  });
  const message = {
    order_id: input?.scholarshipApplicationId
  };
  return { payload: { context, message } };
};
export const buildStatusResponse = (res: any = {}, input: any = {}) => {
  const response = res?.data?.responses?.[0];
  if (!response)
    return { status: 200 };

  const context = {
    transactionId: response?.context?.transaction_id,
    bppId: response?.context?.bpp_id,
    bppUri: response?.context?.bpp_uri,
  };

  const provider = response?.message?.order?.provider;
  const scholarshipApplicationId = response?.message?.order?.id;

  const scholarshipProviders = [{
    id: provider?.id,
    name: provider?.descriptor?.name,
    description: provider?.descriptor?.long_desc ?? provider?.descriptor?.short_desc,
    scholarships: response?.message?.order?.items?.map((item: any) => ({
      id: item?.id,
      name: item?.desciptor?.name,
      description: item?.descriptor?.long_desc,
      amount: {
        amount: item?.price?.value,
        currency: item?.price?.currency,
      },
      // scholarshipDetails: response?.message?.order?.fulfillments?.filter((fulfillment: any) => item?.fulfillment_ids?.find((fulfillment_id: any) => fulfillment_id == fulfillment?.id))
      //   ?.map((fulfillment: any) => ({
      //     id: fulfillment?.id,
      //     type: fulfillment?.type,

      //   })),

      scholarshipDetails: response?.message?.order?.fulfillments?.map((fulfillment: any) => ({
        id: fulfillment?.id,
        type: fulfillment?.type,
        scholarshipStatus: { code: response?.message?.order?.status }
      }))?.[0]
    }))
  }];

  return { data: { context, scholarshipApplicationId, scholarshipProviders } };
};
