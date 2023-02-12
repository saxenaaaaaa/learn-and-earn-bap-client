import moment from "moment";
import { v4 as uuid } from "uuid";
import { MentoringContext } from "./schema";

export const buildContext = (input: any = {}) => {
  const context: MentoringContext = {
    domain: `${process.env.DOMAIN}${input?.category ?? "mentoring"}`,
    action: input.action ?? "",
    bap_id: process.env.MENTORSHIP_BAP_ID || (input?.bppId ?? ""),
    bap_uri: process.env.MENTORSHIP_BAP_URI || (input?.bppUri ?? ""),
    timestamp: input.timestamp ?? moment().toISOString(),
    message_id: input?.messageId ?? uuid(),
    version: process.env.CORE_VERSION || (input?.core_version ?? ""),
    ttl: "PT10M", // ask Ajay for its significance
    transaction_id: input?.transactionId ?? uuid()
  };
  return context;
};

export const buildSearchRequest = (input: any = {}) => {
  const context = buildContext({
    action: "search",
    category: "mentoring"
  });

  const intent: any = {};

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

  return { payload: { context, message: intent } };
};

export const buildSearchResponse = (response: any = {}, input: any = {}) => {
  const context = { transactionId: response?.context?.transaction_id };
  const mentorshipProviders: any = [];
  const responseMentorShipProviders: any =
    response?.message?.catalog?.providers ?? [];

  responseMentorShipProviders.forEach((provider: any) => {
    let rawProviderObjects: any = {};

    rawProviderObjects = {
      id: provider?.id,
      code: provider?.descriptor?.code,
      name: provider?.descriptor?.name,
      description: provider?.descriptor?.short_desc
    };

    const mentorships: any = [];
    const responseMentorships: any = provider?.items ?? [];

    responseMentorships.forEach((mentorShip: any, index: any) => {
      let rawMentorShipObject: any = {};

      rawMentorShipObject = {
        id: mentorShip?.id,
        code: mentorShip?.descriptor?.code,
        name: mentorShip?.descriptor?.name,
        description: mentorShip?.descriptor?.short_desc,
        longDescription: mentorShip?.descriptor?.long_desc,
        imageLocations: mentorShip?.descriptor?.images,
        available: mentorShip?.quantity?.available?.count,
        allocated: mentorShip?.quantity?.allocated?.count,
        price: mentorShip?.price?.value
      };

      rawMentorShipObject.categories = provider?.categories.map(
        (category: any) => {
          return {
            id: category?.id,
            code: category?.descriptor?.code,
            name: category?.descriptor?.name
          };
        }
      );

      rawMentorShipObject.recommendedFor = mentorShip?.tags
        .filter((elem: any) => elem.code === "recommended_for")
        .map((elem: any) => ({
          recommendationForCode: elem.list[0].code,
          recommendationForName: elem.list[0].name
        }));
      rawMentorShipObject.mentorshipSessions = mentorShip?.fulfillment_ids.map(
        (id: string) => {
          let rawFulfillmentObj: any = {};
          const fullfilementFound = provider?.fulfillments.find(
            (elem: any) => elem.id === id
          );
          if (Object.keys(fullfilementFound).length) {
            rawFulfillmentObj = {
              id: fullfilementFound?.id,
              language: fullfilementFound?.language[0],
              timingStart: fullfilementFound?.time?.range?.start,
              timingEnd: fullfilementFound?.time?.range?.end,
              type: fullfilementFound?.type,
              status: fullfilementFound?.tags.find(
                (elem: any) => elem.code === "status"
              ).list[0]?.name,
              timezone: fullfilementFound?.tags.find(
                (elem: any) => elem.code === "timeZone"
              ).list[0]?.name,
              mentor: {
                id: fullfilementFound?.agent?.person?.id,
                name: fullfilementFound?.agent?.person?.name,
                gender: fullfilementFound?.agent?.person?.gender ?? "Male",
                image:
                  fullfilementFound?.agent?.person?.image ?? "image location",
                rating: fullfilementFound?.agent?.person?.rating ?? "4.9"
              }
            };
          }
          return rawFulfillmentObj;
        }
      );

      mentorships.push(rawMentorShipObject);
      rawProviderObjects = {
        ...rawProviderObjects,
        mentorships
      };
    });
    mentorshipProviders.push(rawProviderObjects);
  });
  return { context, mentorshipProviders };
};

export const buildSelectRequest = (input: any = {}) => {
  const context = buildContext({
    ...input?.context,
    action: "select",
    category: "mentoring"
  });
  const message = { order: { item: { id: input?.mentorshipId } } };

  return { payload: { context, message } };
};
export const buildSelectResponse = (response: any = {}, input: any = {}) => {
  const context = {
    transactionId: response?.context?.transaction_id,
    bppId: response?.context?.bpp_id,
    bppUri: response?.context?.bpp_uri
  };

  const { provider } = response?.message?.order;
  const mentorshipProvider: any = {
    id: provider?.id,
    code: provider?.descriptor?.code,
    name: provider?.descriptor?.name,
    description: provider?.descriptor?.short_desc
  };

  mentorshipProvider.mentorships = provider?.items.map((mentorship: any) => {
    let mentorshipResponse: any = {
      id: mentorship?.id,
      code: mentorship?.descriptor?.code,
      name: mentorship?.descriptor?.name,
      description: mentorship?.descriptor?.short_desc,
      longDescription: mentorship?.descriptor?.long_desc,
      imageLocations: mentorship?.descriptor?.images,
      categories: provider?.categories.map((category: any) => {
        let categoryResponse: any = {
          id: category?.id,
          code: category?.descriptor?.code,
          name: category?.descriptor?.name
        };
        return categoryResponse;
      }),
      available: mentorship?.quantity?.available?.count,
      allocated: mentorship?.quantity?.allocated?.count,
      price: mentorship?.price?.value
    };
    mentorshipResponse.mentorshipSessions = mentorship?.fulfillment_ids?.map(
      (id: string) => {
        let fullfilmentObj: any = {};
        const fullfilementFound = provider?.fulfillments.find(
          (fulfillment: any) => fulfillment.id === id
        );

        if (Object.keys(fullfilementFound).length) {
          fullfilmentObj = {
            id: fullfilementFound?.id,
            language: fullfilementFound?.language[0] ?? "",
            timingStart: fullfilementFound?.time?.range?.start,
            timingEnd: fullfilementFound?.time?.range?.end,
            type: fullfilementFound?.type,
            status: Object.keys(
              fullfilementFound?.tags.find((tag: any) => tag.code === "status")
            ).length
              ? fullfilementFound?.tags.find(
                  (tag: any) => tag.code === "status"
                )?.list[0]?.name
              : "",
            timezone: Object.keys(
              fullfilementFound?.tags.find(
                (tag: any) => tag.code === "timeZone"
              )
            ).length
              ? fullfilementFound?.tags.find(
                  (tag: any) => tag.code === "timeZone"
                )?.list[0]?.name
              : "",
            mentor: {
              id: fullfilementFound?.agent?.person?.id,
              name: fullfilementFound?.agent?.person?.name,
              gender: "Male",
              image: "image location",
              rating: "4.9"
            }
          };
        }
        return fullfilmentObj;
      }
    );

    mentorshipResponse.recommendedFor = mentorship?.tags
      .filter((elem: any) => elem.code === "recommended_for")
      .map((elem: any) => ({
        recommendationForCode: elem.list[0].code,
        recommendationForName: elem.list[0].name
      }));

    return mentorshipResponse;
  });

  return {
    context,
    mentorshipProvider
  };
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
export const buildConfirmResponse = (response: any = {}, input: any = {}) => {
  const context = {
    transactionId: response?.context?.transaction_id,
    bppId: response?.context?.bpp_id,
    bppUri: response?.context?.bpp_uri
  };
  const { order } = response?.message ?? {};
  const mentorshipApplicationId = order?.id;
  const fulfillment = order?.fulfillments.length ? order?.fulfillments[0] : {};
  const sessionJoinLinks = Object.keys(
    fulfillment?.tags.find((tag: any) => tag.code === "joinLink")
  ).length
    ? fulfillment?.tags.find((tag: any) => tag.code === "joinLink").list[0]
    : { code: "", name: "" };

  const mentorshipSession: any = {
    id: fulfillment?.id,
    sessionJoinLinks: [
      {
        id: sessionJoinLinks.code,
        link: sessionJoinLinks.name
      }
    ],

    language: fulfillment?.language[0],
    timingStart: fulfillment?.time?.range?.start,
    timingEnd: fulfillment?.time?.range?.end,
    type: fulfillment?.type,
    status: fulfillment?.tags.find((tag: any) => tag.code === "status")
      ? fulfillment?.tags.find((tag: any) => tag.code === "status")?.list[0]
          ?.name
      : "Live",
    timezone: fulfillment?.tags.find((tag: any) => tag.code === "timeZone")
      ? fulfillment?.tags.find((tag: any) => tag.code === "timeZone")?.list[0]
          ?.name
      : "Asia/Calcutta",
    mentor: {
      id: fulfillment?.agent?.person?.id,
      name: fulfillment?.agent?.person?.name,
      gender: "Male",
      image: "image location",
      rating: "4.9"
    }
  };

  return {
    mentorshipApplicationId,
    context,
    mentorshipSession
  };
};

export const buildInitRequest = (input: any = {}) => {};
export const buildInitResponse = () => {};

export const buildStatusRequest = (input: any = {}) => {};
export const buildStatusResponse = () => {};
