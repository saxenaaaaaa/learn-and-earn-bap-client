import moment from "moment";
import { v4 as uuid } from "uuid";
import { MentoringContext } from "./schema";

export const buildContext = (input: any = {}) => {
  const context: MentoringContext = {
    domain: `${process.env.DOMAIN}${input?.category ?? "mentoring"}`,
    action: input.action ?? "",
    bap_id: process.env.BAP_ID || (input?.bap_id ?? ""),
    bap_uri: process.env.BAP_URI || (input?.bap_uri ?? ""),
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
