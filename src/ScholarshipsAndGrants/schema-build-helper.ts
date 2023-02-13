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
    transactionId: response?.context?.message_id
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
                  tags
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
            fulfillment_id: scholarship?.scholarshipDetails?.id
          };
        })
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
                  tags
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
            xinput_required: {
              xinput: {
                form: {
                  url: scholarship?.additionalForm?.url,
                  mime_type: scholarship?.additionalForm?.urmimeTypel,
                  submission_id: scholarship?.additionalForm?.submissionId
                }
              }
            }
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
    order: {
      id: input?.scholarshipApplicationId
    }
  };
  return { payload: { context, message } };
};
export const buildStatusResponse = (response: any = {}, input: any = {}) => {
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
        description: scholarship?.descriptor?.name,
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
