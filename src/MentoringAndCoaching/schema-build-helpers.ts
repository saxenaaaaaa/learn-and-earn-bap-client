import moment from "moment";
import { v4 as uuid } from "uuid";
import { MentoringContext } from "./schema";

export const buildContext = (input: any = {}) => {
  const context: MentoringContext = {
    domain: `${process.env.DOMAIN}${input?.category ?? "mentoring"}`,
    action: input.action ?? "",
    bap_id: process.env.BAP_ID || "",
    bap_uri: process.env.BAP_URI || "",
    timestamp: input.timestamp ?? moment().toISOString(),

    message_id: input?.messageId ?? uuid(),
    version: process.env.CORE_VERSION || (input?.core_version ?? ""),
    ttl: "PT10M", // ask Ajay for its significance
    transaction_id: input?.transactionId ?? uuid()
  };
  if (input?.bppId) {
    context.bpp_id = input?.bppId;
  }
  if (input?.bppUri) {
    context.bpp_uri = input?.bppUri;
  }
  return context;
};

export const buildOnSearchMergedResponse = async (response: any = {}, body: any = {}) => {
  let savedAppliedResult = response?.itemRes ? await buildSavedAppliedCategoryResponse(response.itemRes[0], response.itemRes[1]) : null;
  return buildSearchResponse(response.searchRes, body, savedAppliedResult);
}

export const buildSearchRequest = (input: any = {}) => {
  const context = buildContext({
    action: "search",
    category: "mentoring"
  });

  const intent: any = {};
  const optional: any = {};

  if (input?.sessionTitle?.key) {
    intent.item = {
      descriptor: {
        name: input?.sessionTitle?.key
      }
    };
  }
  if (input?.mentor?.name) {
    intent.agent = {
      person: {
        name: input?.mentor?.name
      }
    };
  }

  if (input?.loggedInUserEmail) {
    optional.user = { "email": input?.loggedInUserEmail };
  }

  return { payload: { context, message: { intent } }, optional };
};

export const buildSearchResponse = (response: any = {}, body: any = {}, savedAppliedResult?: any) => {
  const input = response?.data?.responses?.[0];
  if (!input)
    return { status: 200 };
  const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri }: any = input?.context ?? {};
  const context = { transactionId, messageId, bppId, bppUri };

  const { providers } = input.message?.catalog;

  const mentorshipProviders = providers?.map((provider: any) => ({
    id: provider?.id,
    code: provider?.descriptor?.code,
    name: provider?.descriptor?.name,
    description: provider?.descriptor?.short_desc,

    mentorships: provider?.items?.map((item: any) => ({
      id: item?.id,
      code: item?.descriptor?.code,
      name: item?.descriptor?.name,
      description: item?.descriptor?.short_desc,
      longDescription: item?.descriptor?.long_desc,
      userSavedItem: savedAppliedResult?.saved && savedAppliedResult?.saved[item?.id] ? true : false,
      // userAppliedItem: savedAppliedResult?.saved && savedAppliedResult?.saved[item?.id] ? true : false,

      imageLocations: item?.descriptor?.images?.map((image: any) => image?.url),
      categories: provider?.categories?.filter((category: any) => item?.category_ids?.find((categoryId: any) => categoryId == category?.id))
        ?.map((category: any) => ({ id: category?.id, code: category?.descriptor?.code, name: category?.descriptor?.name })),
      available: item?.quantity?.available?.count,
      allocated: item?.quantity?.allocated?.count,
      price: item?.price?.value,
      mentorshipSessions: provider?.fulfillments?.filter((fulfillment: any) => item?.fulfillment_ids?.find((fulfillmentId: any) => fulfillmentId == fulfillment?.id))
        ?.map((fulfillment: any) => ({
          id: fulfillment?.id,
          language: fulfillment?.language?.[0],
          timingStart: fulfillment?.time?.range?.start,
          timingEnd: fulfillment?.time?.range?.end,
          type: fulfillment?.type,
          status: fulfillment?.tags?.find((tag: any) => tag?.code == "status")?.list?.[0]?.name,
          timezone: fulfillment?.tags?.find((tag: any) => tag?.code == "timeZone")?.list?.[0]?.name,
          userSavedItem: savedAppliedResult?.saved && savedAppliedResult?.saved[item?.id][fulfillment?.id] ? true : false,
          userAppliedItem: savedAppliedResult?.applied && savedAppliedResult?.saved[fulfillment?.id] ? true : false,
          mentor: {
            id: fulfillment?.agent?.person?.id,
            name: fulfillment?.agent?.person?.name,
            gender: fulfillment?.agent?.person?.gender,
            image: fulfillment?.agent?.person?.image,
            rating: fulfillment?.agent?.person?.rating
          }
        })),
      recommendedFor: item?.tags?.find((tag: any) => tag?.code == "recommended_for")
        ?.list?.map((li: any) => ({ recommendationForCode: li?.code, recommendationForName: li?.name })),
    })),
  }));

  return { data: { context, mentorshipProviders } };
};

export const buildSavedAppliedCategoryResponse = (savedResponse: any = {}, appliedResponse: any = {}) => {
  const savedInput = savedResponse?.data?.mentorships;
  const appliedInput = appliedResponse?.data?.mentorships;

  const mentorMap: any = {
    saved: {}, applied: {}
  };

  if (savedResponse?.data) {
    savedInput.forEach(({ mentorship_id, mentorshipSession_id}: any) => {
      // mentorMap['saved'][mentorship_id] = true;
      mentorMap['saved'][mentorship_id][mentorshipSession_id] = true;
    });
  }

  if (appliedResponse?.data) {
    appliedInput.forEach(({ mentorship_id, mentorshipSession_id }: any) => {
      mentorMap['applied'][mentorship_id][mentorshipSession_id] = true;
    });
  }

  return mentorMap;
}

export const buildSelectRequest = (input: any = {}) => {
  const context = buildContext({
    ...input?.context,
    action: "select",
    category: "mentoring"
  });
  const message = { order: { item: { id: input?.mentorshipId } } };

  return { payload: { context, message } };
};
export const buildSelectResponse = (response: any = {}, body: any = {}) => {

  const input = response?.data?.responses?.[0];
  if (!input)
    return { status: 200 };

  const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri }: any = input?.context ?? {};
  const context = { transactionId, messageId, bppId, bppUri };

  const provider = input.message?.order?.provider;

  const mentorshipProvider = {
    id: provider?.id,
    code: provider?.descriptor?.code,
    name: provider?.descriptor?.name,
    description: provider?.descriptor?.short_desc,

    mentorships: provider?.items?.map((item: any) => ({
      id: item?.id,
      code: item?.descriptor?.code,
      name: item?.descriptor?.name,
      description: item?.descriptor?.short_desc,
      longDescription: item?.descriptor?.long_desc,

      imageLocations: item?.descriptor?.images?.map((image: any) => image?.url),
      categories: provider?.categories?.filter((category: any) => item?.category_ids?.find((categoryId: any) => categoryId == category?.id))
        ?.map((category: any) => ({ id: category?.id, code: category?.descriptor?.code, name: category?.descriptor?.name })),
      available: item?.quantity?.available?.count,
      allocated: item?.quantity?.allocated?.count,
      price: item?.price?.value,
      mentorshipSessions: provider?.fulfillments?.filter((fulfillment: any) => item?.fulfillment_ids?.find((fulfillmentId: any) => fulfillmentId == fulfillment?.id))
        ?.map((fulfillment: any) => ({
          id: fulfillment?.id,
          language: fulfillment?.language?.[0],
          timingStart: fulfillment?.time?.range?.start,
          timingEnd: fulfillment?.time?.range?.end,
          type: fulfillment?.type,
          status: fulfillment?.tags?.find((tag: any) => tag?.code == "status")?.list?.[0]?.name,
          timezone: fulfillment?.tags?.find((tag: any) => tag?.code == "timeZone")?.list?.[0]?.name,
          mentor: {
            id: fulfillment?.agent?.person?.id,
            name: fulfillment?.agent?.person?.name,
            gender: fulfillment?.agent?.person?.gender,
            image: fulfillment?.agent?.person?.image,
            rating: fulfillment?.agent?.person?.rating
          }
        })),
      recommendedFor: item?.tags?.find((tag: any) => tag?.code == "recommended_for")
        ?.list?.map((li: any) => ({ recommendationForCode: li?.code, recommendationForName: li?.name })),
    })),
  }

  return { data: { context, mentorshipProvider } };
};

export const buildConfirmRequest = (input: any = {}) => {
  const context = buildContext({
    ...input?.context,
    category: "mentoring",
    action: "confirm"
  });

  const message = {
    order: {
      items: [
        {
          id: input?.mentorshipId
        }
      ],
      fulfillments: [
        {
          id: input?.mentorshipSessionId
        }
      ],
      billing: input?.billing
    }
  };

  return { payload: { context, message } };
};

export const buildConfirmResponse = (response: any = {}, body: any = {}) => {
  const input = response?.data?.responses?.[0];
  if (!input)
    return { status: 200 };

  const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri }: any = input?.context ?? {};
  const context = { transactionId, messageId, bppId, bppUri };

  const order = input?.message?.order;

  const mentorshipSession = {
    id: order?.id,
    sessionJoinLinks: order?.fulfillments?.[0]?.tags?.find((fulfillment: any) => fulfillment?.code == 'joinLink')?.list?.map((li: any) => ({ id: li?.code, link: li?.name })),
    language: order?.fulfillments?.[0]?.language?.[0],
    timingStart: order?.fulfillments?.[0]?.time?.range?.start,
    timingEnd: order?.fulfillments?.[0]?.time?.range?.ends,
    type: order?.type,
    status: order?.fulfillments?.[0]?.tags?.find((tag: any) => tag?.code == "status")?.list?.[0]?.name,
    timezone: order?.fulfillments?.[0]?.tags?.find((tag: any) => tag?.code == "timeZone")?.list?.[0]?.name,
    mentor: {
      id: order?.fulfillments?.[0]?.agent?.person?.id,
      name: order?.fulfillments?.[0]?.agent?.person?.name,
      gender: order?.fulfillments?.[0]?.agent?.person?.gender,
      image: order?.fulfillments?.[0]?.agent?.person?.image,
      rating: order?.fulfillments?.[0]?.agent?.person?.rating
    }
  }

  return { data: { context, mentorshipSession } };


};

export const buildStatusRequest = (input: any = {}) => {
  const context = buildContext({
    ...input?.context,
    action: "status",
    category: "mentoring"
  });

  const message = {
    order_id: input?.mentorshipApplicationId
  };

  return { payload: { context, message } };
};

export const buildStatusResponse = (response: any = {}, body: any = {}) => {

  const input = response?.data?.responses?.[0];
  if (!input)
    return { status: 200 };

  const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri }: any = input?.context ?? {};
  const context = { transactionId, messageId, bppId, bppUri };

  const order = input.message?.order;
  const provider = order?.provider;

  const mentorshipApplicationId = order?.id
  const mentorshipApplicationStatus = order?.id;

  const mentorshipProvider = {
    id: provider?.id,
    code: provider?.descriptor?.code,
    name: provider?.descriptor?.name,
    description: provider?.descriptor?.short_desc,

    mentorships: provider?.items?.map((item: any) => ({
      id: item?.id,
      code: item?.descriptor?.code,
      name: item?.descriptor?.name,
      description: item?.descriptor?.short_desc,
      longDescription: item?.descriptor?.long_desc,

      imageLocations: item?.descriptor?.images?.map((image: any) => image?.url),
      categories: provider?.categories?.filter((category: any) => item?.category_ids?.find((categoryId: any) => categoryId == category?.id))
        ?.map((category: any) => ({ id: category?.id, code: category?.descriptor?.code, name: category?.descriptor?.name })),
      available: item?.quantity?.available?.count,
      allocated: item?.quantity?.allocated?.count,
      price: item?.price?.value,
      mentorshipSessions: provider?.fulfillments?.filter((fulfillment: any) => item?.fulfillment_ids?.find((fulfillmentId: any) => fulfillmentId == fulfillment?.id))
        ?.map((fulfillment: any) => ({
          id: fulfillment?.id,
          language: fulfillment?.language?.[0],
          timingStart: fulfillment?.time?.range?.start,
          timingEnd: fulfillment?.time?.range?.end,
          type: fulfillment?.type,
          status: fulfillment?.tags?.find((tag: any) => tag?.code == "status")?.list?.[0]?.name,
          timezone: fulfillment?.tags?.find((tag: any) => tag?.code == "timeZone")?.list?.[0]?.name,
          mentor: {
            id: fulfillment?.agent?.person?.id,
            name: fulfillment?.agent?.person?.name,
            gender: fulfillment?.agent?.person?.gender,
            image: fulfillment?.agent?.person?.image,
            rating: fulfillment?.agent?.person?.rating
          }
        })),
      recommendedFor: item?.tags?.find((tag: any) => tag?.code == "recommended_for")
        ?.list?.map((li: any) => ({ recommendationForCode: li?.code, recommendationForName: li?.name })),
    })),
  }

  return { data: { context, mentorshipApplicationId, mentorshipApplicationStatus, mentorshipProvider } };
};

export const buildCancelRequest = (input: any = {}) => {
  const context = buildContext({
    ...input.context,
    action: "cancel",
    category: "mentoring"
  });

  let message: any = { order_id: input?.mentorshipApplicationId };
  if (input?.mentorshipCancellationReasonId) {
    message = {
      ...message,
      cancellation_reason_id: `${input?.mentorshipCancellationReasonId}`
    };
  }
  if (input?.mentorshipCancellationReason) {
    message = {
      ...message,
      descriptor: { name: input?.mentorshipCancellationReason }
    };
  }
  return { payload: { context, message } };
};
export const buildCancelResponse = (response: any = {}, input: any = {}) => {
  const context = {
    transactionId: response?.responses[0]?.context?.transaction_id,
    bppId: response?.responses[0]?.context?.bpp_id,
    bppUri: response?.responses[0]?.context?.bpp_uri
  };

  const mentorshipApplicationId = response?.responses[0]?.message?.order?.id;

  return { context, mentorshipApplicationId };
};

export const buildInitRequest = (input: any = {}) => {
  const context = buildContext({
    ...input.context,
    action: "init",
    category: "mentoring"
  });

  const message: any = {
    order: {
      items: [{ id: input?.mentorshipId }],
      fulfillments: [
        {
          id: input?.mentorshipSessionId
        }
      ],
      billing: input?.billing
    }
  };

  return { payload: { context, message } };
};
export const buildInitResponse = (response: any = {}, body: any = {}) => {
  const input = response?.data?.responses?.[0];
  if (!input)
    return { status: 200 };

  const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri }: any = input?.context ?? {};
  const context = { transactionId, messageId, bppId, bppUri };

  const mentorshipSessionId = input.message?.order?.id;

  return { data: { context, mentorshipSessionId } };
};
