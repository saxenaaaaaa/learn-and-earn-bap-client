import moment from "moment";
import { v4 as uuid } from "uuid";
import { searchJobWithCourseCategory, searchJobWithCourseName, searchJobWithCourseProvider } from "../JobsFlow/services";
import { ITrainingNetworkContext } from "./schema";
export const buildContext = (input: any = {}) => {
  const context: ITrainingNetworkContext = {
    transaction_id: input?.transactionId ?? uuid(),
    domain: `${process.env.DOMAIN}${input?.category ?? "courses"}`,
    country: process.env.COUNTRY || (input?.country ?? ""),
    city: process.env.CITY || (input?.city ?? ""),
    action: input.action ?? "",
    version: `${process.env.CORE_VERSION || (input?.core_version ?? "")}`,
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
  const context = buildContext({ action: "search", category: "courses" });
  const message: any = {
    intent: {}
  };
  let item: any = {};
  let provider: any = {};
  let category: any = {};
  const optional: any = {};
  if (input?.category) {
    category = {
      descriptor: {
        name: input?.category
      }
    };
  }

  if (input?.provider) {
    provider = {
      descriptor: {
        name: input?.provider
      }
    };
  }
  if (input?.deepSearch && input?.deepSearch.length) {
    item.tags = [];
    item.tags = input?.deepSearch.map((query: any) => {
      return {
        display: false,
        name: query?.searchCriteria,
        list: query?.searchParameters
      };
    });
  }
  if (input?.searchTitle) {
    item = {
      ...item,
      descriptor: {
        name: input?.searchTitle
      }
    };
  }

  if (Object.keys(item).length) {
    message.intent = {
      ...message.intent,
      item
    };
  }
  if (Object.keys(provider).length) {
    message.intent = {
      ...message.intent,
      provider
    };
  }
  if (Object.keys(category).length) {
    message.intent = {
      ...message.intent,
      category
    };
  }
  if (input?.loggedInUserEmail) {
    optional.user = { "email": input?.loggedInUserEmail };
  }

  return { payload: { context, message }, optional };
};

export const buildSearchRequestWithJobTitle = (jobSearchInput: any) => {
  const context = buildContext({ action: "search", category: "courses" });
  const message: any = {
    intent: {}
  };
  let item: any = {};
  let provider: any = {};
  let category: any = {};
  const optional: any = {};
  if (jobSearchInput?.title?.key) {
    // category = {
    //   descriptor: {
    //     name: jobSearchInput?.title?.key
    //   }
    // };
    // provider = {
    //   descriptor: {
    //     name: jobSearchInput?.title?.key
    //   }
    // };
    item = {
      descriptor: {
        name: jobSearchInput?.title?.key
      }
    };
  }
  if (Object.keys(item).length) {
    message.intent = {
      ...message.intent,
      item
    };
  }
  if (Object.keys(provider).length) {
    message.intent = {
      ...message.intent,
      provider
    };
  }
  if (Object.keys(category).length) {
    message.intent = {
      ...message.intent,
      category
    };
  }
  if (jobSearchInput?.loggedInUserEmail) {
    optional.user = { "email": jobSearchInput?.loggedInUserEmail };
  }

  return { payload: { context, message }, optional };
}

export const buildSearchRequestWithJobRole = (jobRole?: any) => {
  const context = buildContext({ action: "search", category: "courses" });
  const message: any = {
    intent: {}
  };
  let item: any = {};
  let provider: any = {};
  let category: any = {};
  const optional: any = {};
  if (jobRole) {
    // category = {
    //   descriptor: {
    //     name: jobRole
    //   }
    // };
    // provider = {
    //   descriptor: {
    //     name: jobRole
    //   }
    // };
    item = {
      descriptor: {
        name: jobRole
      }
    };
  }
  if (Object.keys(item).length) {
    message.intent = {
      ...message.intent,
      item
    };
  }
  if (Object.keys(provider).length) {
    message.intent = {
      ...message.intent,
      provider
    };
  }
  if (Object.keys(category).length) {
    message.intent = {
      ...message.intent,
      category
    };
  }
  return { payload: { context, message }, optional };
}

export const buildSearchRequestWithJobSkill = (skill: any) => {
  const context = buildContext({ action: "search", category: "courses" });
  const message: any = {
    intent: {}
  };
  let item: any = {};
  let provider: any = {};
  let category: any = {};
  const optional: any = {};
  if (skill?.code ?? skill?.name) {
    // category = {
    //   descriptor: {
    //     name: skill?.code ?? skill?.name
    //   }
    // };
    // provider = {
    //   descriptor: {
    //     name: skill?.code ?? skill?.name
    //   }
    // };
    item = {
      descriptor: {
        name: skill?.code ?? skill?.name
      }
    };
  }
  if (Object.keys(item).length) {
    message.intent = {
      ...message.intent,
      item
    };
  }
  if (Object.keys(provider).length) {
    message.intent = {
      ...message.intent,
      provider
    };
  }
  if (Object.keys(category).length) {
    message.intent = {
      ...message.intent,
      category
    };
  }
  return { payload: { context, message }, optional };
}

export const buildOnSearchMergedResponse = async (response: any = {}, body: any = {}, isJobSearchQuery: boolean = false) => {
  let savedAppliedResult = response?.itemRes ? await buildSavedAppliedCategoryResponse(response.itemRes[0], response.itemRes[1]) : null;
  return buildSearchResponse(response.searchRes, body, response?.itemRes?.[0]?.data?.courses, response?.itemRes?.[1]?.data?.courses, isJobSearchQuery);
}

export const buildSearchResponse = async (response: any = {}, body: any = {}, savedItems = [], appliedItems = [], isJobSearchQuery: boolean = false) => {
  const input = response?.data?.responses?.[0];
  if (!input)
    return { status: 200 };
  const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri }: any = input?.context ?? {};
  const context = { transactionId, messageId, bppId, bppUri };

  const courses: any[] = [];

  const providers = input?.message?.catalog?.providers;

  providers?.forEach((provider: any) => {
    provider?.items.forEach((item: any) => {
      const categoryFound: any = provider?.categories.find(
        (category: any) => category?.id === item.category_id
      );
      courses.push({
        id: item?.id,
        name: item?.descriptor?.name,
        description: item?.descriptor?.long_desc,
        userSavedItem: !!(savedItems?.find((savedItem: any) => savedItem?.course_id == item?.id)),
        userAppliedItem: !!(appliedItems?.find((appliedItem: any) => appliedItem?.course_id == item?.id)),
        imageLocations: item?.descriptor?.images.map(
          (img: any) => img?.url || ""
        ),
        duration: item?.time?.duration,
        provider: {
          id: provider?.id,
          name: provider?.descriptor?.name,
          description: provider?.descriptor?.name
        },
        category: {
          id: categoryFound ? categoryFound?.id : "",
          name: categoryFound ? categoryFound?.descriptor?.name : ""
        }
      });
    });
  });
  const enrichedCourses = isJobSearchQuery ? courses : await enrichCoursesWithRelevantJobs(courses);
  // console.log("non enriched courses : ", courses);
  console.log("enriched course : ", enrichedCourses);
  return { data: { context, courses: enrichedCourses } };
};

export async function enrichCoursesWithRelevantJobs(courses: any) {
  
  const enrichedCourses = [];
  for(let course of courses) {
    let jobsForCourse = await Promise.all([
      searchJobWithCourseName(course),
      searchJobWithCourseProvider(course),
      searchJobWithCourseCategory(course)
    ]).then((res => res)).catch(error=> null);
    enrichedCourses.push({
      ...course,
      myOutput: jobsForCourse
    })
  }
  



  // const enrichedCourses = await Promise.all(
  //   courses.map((course: any) => {
  //     return searchJobWithCourseName(course)
  //   })
  //   // searchJobWithCourseName(courses[0])
  // ).then(res => {
  //   console.log("value of res = ", res);
  //   let temp:any[]=[];
  //   let i=0;
  //   courses.forEach((course: any) => {
  //     temp.push({
  //       ...course,
  //       myOutput: res[i]
  //     })
  //     i=i+1;
  //   })
  //   return temp;
  // }).catch(error =>null);
  console.log("These are enriched courses - > ", enrichedCourses);
  return enrichedCourses;
}

export const buildSavedAppliedCategoryResponse = (savedResponse: any = {}, appliedResponse: any = {}) => {
  const savedInput = savedResponse?.data?.courses;
  const appliedInput = appliedResponse?.data?.courses;

  const mentorMap: any = {
    saved: {}, applied: {}
  };

  if (savedResponse?.data) {
    savedInput.forEach(({ course_id }: any) => {
      mentorMap['saved'][course_id] = true;
    });
  }

  if (appliedResponse?.data) {
    appliedInput.forEach(({ course_id }: any) => {
      mentorMap['applied'][course_id] = true;
    });
  }

  return mentorMap;
}

export const buildInitRequest = (input: any = {}) => {
  const context = buildContext({
    ...input?.context,
    category: "courses",
    action: "init"
  });

  const message: any = { order: { items: [{ id: input?.courseId }] } };
  if (input?.applicantProfile?.name) {
    message.order.fulfillments = [{ customer: { person: { name: input?.applicantProfile?.name } } }];
  }

  if (input?.additionalFormData) {
    message.order.xinput = {
      submission_id: input?.additionalFormData?.submissionId,
      data: Object.fromEntries(input?.additionalFormData?.data?.map((formData: any) => [formData?.formInputKey, formData?.formInputValue]) ?? [])
    }
  }

  return { payload: { context, message } };
};

export const buildInitResponse = (response: any = {}, body: any = {}) => {
  const input = response?.data?.responses?.[0];
  if (!input)
    return { status: 200 };

  const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri }: any = input?.context ?? {};
  const context = { transactionId, messageId, bppId, bppUri };

  const provider = input?.message?.order?.provider;
  const item = input?.message?.order?.items?.[0];

  const category: any = provider?.categories?.find((category: any) => category?.id === item?.category_id);

  const course = {
    id: item?.id,
    name: item?.descriptor?.name,
    description: item?.descriptor?.long_desc,
    imageLocations: item?.descriptor?.images?.map((image: any) => image?.url),
    duration: item?.time?.duration,
    provider: {
      id: provider?.id,
      name: provider?.descriptor?.name,
      description: provider?.descriptor?.long_desc
    },
    category: {
      id: category?.id,
      name: category?.name
    }
  };

  let courseDetails = item?.tags?.find((tag: any) => tag?.descriptor?.name == "courseDetails");

  const eligibility = item?.tags?.find((tag: any) => tag?.descriptor?.name == "eligibility");
  const courseHighlights = item?.tags?.find((tag: any) => tag?.descriptor?.name == "courseHighlights");
  const prerequisites = item?.tags?.find((tag: any) => tag?.descriptor?.name == "prerequisites");

  const additionalFormUrl = item?.xinput?.form?.url

  courseDetails = {
    price: courseDetails?.list?.find((detail: any) => detail?.descriptor?.name == "price")?.value,
    startDate: courseDetails?.list?.find((detail: any) => detail?.descriptor?.name == "startDate")?.value,
    endDate: courseDetails?.list?.find((detail: any) => detail?.descriptor?.name == "endDate")?.value,
    rating: courseDetails?.list?.find((detail: any) => detail?.descriptor?.name == "rating")?.value,
    credits: courseDetails?.list?.find((detail: any) => detail?.descriptor?.name == "credits")?.value,

    instructors: courseDetails?.list?.find((detail: any) => detail?.descriptor?.name == "instructors")?.value,
    offeringInstitue: courseDetails?.list?.find((detail: any) => detail?.descriptor?.name == "offeringInstitue")?.value,
    courseUrl: courseDetails?.list?.find((detail: any) => detail?.descriptor?.name == "url")?.value,
    enrollmentEndDate: courseDetails?.list?.find((detail: any) => detail?.descriptor?.name == "enrollmentEndDate")?.value,

    eligibility: eligibility?.list?.map((li: any) => ({ name: li?.descriptor?.name, value: li?.value })),
    courseHighlights: courseHighlights?.list?.map((li: any) => ({ name: li?.descriptor?.name, value: li?.value })),
    prerequisites: prerequisites?.list?.map((li: any) => ({ name: li?.descriptor?.name, value: li?.value }))
  }

  const fulfillment = input?.message?.order?.fulfillments?.[0];
  const applicantProfile = {
    name: fulfillment?.customer?.person?.name,
    email: fulfillment?.contact?.email,
    contact: fulfillment?.contact?.phone,
  };

  const additionalFormData = {
    formUrl: item?.xinput?.form?.url,
    formMimeType: item?.xinput?.form?.mime_type,
    submissionId: item?.xinput?.form?.submission_id,
    data: Object.keys(item?.xinput?.form?.data ?? {}).map((key: string) => { return { formInputKey: key, formInputValue: item?.xinput?.form?.data[key] }; })
  };

  return { data: { context, course, courseDetails, applicantProfile, additionalFormUrl, additionalFormData } };
};

export const buildConfirmRequest = (input: any = {}) => {
  const context = buildContext({
    ...input?.context,
    category: "courses",
    action: "confirm"
  });

  const message: any = { order: { items: [{ id: input?.courseId }] } };
  if (input?.applicantProfile?.name) {
    message.order.fulfillments = [{ customer: { person: { name: input?.applicantProfile?.name } } }];
  }

  return { payload: { context, message } };
};
export const buildConfirmResponse = (response: any = {}, body: any = {}) => {
  const input = response?.data?.responses?.[0];
  if (!input)
    return { status: 200 };

  const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri }: any = input?.context ?? {};
  const context = { transactionId, messageId, bppId, bppUri };

  const provider = input?.message?.order?.provider;
  const item = input?.message?.order?.items?.[0];

  const category: any = provider?.categories?.find((category: any) => category?.id === item?.category_id);

  const course = {
    id: item?.id,
    name: item?.descriptor?.name,
    description: item?.descriptor?.long_desc,
    imageLocations: item?.descriptor?.images?.map((image: any) => image?.url),
    duration: item?.time?.duration,
    provider: {
      id: provider?.id,
      name: provider?.descriptor?.name,
      description: provider?.descriptor?.long_desc
    },
    category: {
      id: category?.id,
      name: category?.name
    }
  };

  const applicationId = input?.message?.order?.id;
  const applicationState = input?.message?.order?.state;

  let courseDetails = item?.tags?.find((tag: any) => tag?.descriptor?.name == "courseDetails");

  const eligibility = item?.tags?.find((tag: any) => tag?.descriptor?.name == "eligibility");
  const courseHighlights = item?.tags?.find((tag: any) => tag?.descriptor?.name == "courseHighlights");
  const prerequisites = item?.tags?.find((tag: any) => tag?.descriptor?.name == "prerequisites");

  const additionalFormUrl = item?.xinput?.form?.url

  courseDetails = {
    price: courseDetails?.list?.find((detail: any) => detail?.descriptor?.name == "price")?.value,
    startDate: courseDetails?.list?.find((detail: any) => detail?.descriptor?.name == "startDate")?.value,
    endDate: courseDetails?.list?.find((detail: any) => detail?.descriptor?.name == "endDate")?.value,
    rating: courseDetails?.list?.find((detail: any) => detail?.descriptor?.name == "rating")?.value,
    credits: courseDetails?.list?.find((detail: any) => detail?.descriptor?.name == "credits")?.value,

    instructors: courseDetails?.list?.find((detail: any) => detail?.descriptor?.name == "instructors")?.value,
    offeringInstitue: courseDetails?.list?.find((detail: any) => detail?.descriptor?.name == "offeringInstitue")?.value,
    courseUrl: courseDetails?.list?.find((detail: any) => detail?.descriptor?.name == "url")?.value,
    enrollmentEndDate: courseDetails?.list?.find((detail: any) => detail?.descriptor?.name == "enrollmentEndDate")?.value,

    eligibility: eligibility?.list?.map((li: any) => ({ name: li?.descriptor?.name, value: li?.value })),
    courseHighlights: courseHighlights?.list?.map((li: any) => ({ name: li?.descriptor?.name, value: li?.value })),
    prerequisites: prerequisites?.list?.map((li: any) => ({ name: li?.descriptor?.name, value: li?.value }))
  }

  const fulfillment = input?.message?.order?.fulfillments?.[0];
  const applicantProfile = {
    name: fulfillment?.customer?.person?.name,
    email: fulfillment?.contact?.email,
    contact: fulfillment?.contact?.phone,
  };

  const additionalFormData = {
    formUrl: item?.xinput?.form?.url,
    formMimeType: item?.xinput?.form?.mime_type,
    submissionId: item?.xinput?.form?.submission_id,
    data: Object.keys(item?.xinput?.form?.data ?? {}).map((key: string) => { return { formInputKey: key, formInputValue: item?.xinput?.form?.data[key] }; })
  };

  return { data: { context, applicationId, applicationState, course, courseDetails, applicantProfile, additionalFormUrl, additionalFormData } };
};


export const buildStatusRequest = (input: any = {}) => {
  const context = buildContext({
    ...input?.context,
    category: "courses",
    action: "confirm"
  });
  const message = {};
  return { payload: { context, message } };
};
export const buildStatusResponse = (response: any = {}, input: any = {}) => {
  const context = {
    transactionId: response?.context?.message_id,
    bppId: response?.context?.bpp_id,
    bppUri: response?.context?.bpp_uri
  };

  return { context };
};

export const buildSelectRequest = (input: any = {}) => {
  const context = buildContext({
    ...input?.context,
    category: "courses",
    action: "select"
  });
  const message = {
    order: { items: [{ id: input?.courseId }] }
  };
  return { payload: { context, message } };
};

export const buildSelectResponse = (response: any = {}, body: any = {}) => {
  const input = response?.data?.responses?.[0];
  if (!input)
    return { status: 200 };

  const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri }: any = input?.context ?? {};
  const context = { transactionId, messageId, bppId, bppUri };

  const provider = input?.message?.order?.provider;
  const item = input?.message?.order?.items?.[0];

  const category: any = provider?.categories?.find((category: any) => category?.id === item?.category_id);

  const course = {
    id: item?.id,
    name: item?.descriptor?.name,
    description: item?.descriptor?.long_desc,
    imageLocations: item?.descriptor?.images?.map((image: any) => image?.url),
    duration: item?.time?.duration,
    provider: {
      id: provider?.id,
      name: provider?.descriptor?.name,
      description: provider?.descriptor?.long_desc
    },
    category: {
      id: category?.id,
      name: category?.name
    }
  };

  let courseDetails = item?.tags?.find((tag: any) => tag?.descriptor?.name == "courseDetails");

  const eligibility = item?.tags?.find((tag: any) => tag?.descriptor?.name == "eligibility");
  const courseHighlights = item?.tags?.find((tag: any) => tag?.descriptor?.name == "courseHighlights");
  const prerequisites = item?.tags?.find((tag: any) => tag?.descriptor?.name == "prerequisites");

  const additionalFormUrl = item?.xinput?.form?.url

  courseDetails = {
    price: courseDetails?.list?.find((detail: any) => detail?.descriptor?.name == "price")?.value,
    startDate: courseDetails?.list?.find((detail: any) => detail?.descriptor?.name == "startDate")?.value,
    endDate: courseDetails?.list?.find((detail: any) => detail?.descriptor?.name == "endDate")?.value,
    rating: courseDetails?.list?.find((detail: any) => detail?.descriptor?.name == "rating")?.value,
    credits: courseDetails?.list?.find((detail: any) => detail?.descriptor?.name == "credits")?.value,

    instructors: courseDetails?.list?.find((detail: any) => detail?.descriptor?.name == "instructors")?.value,
    offeringInstitue: courseDetails?.list?.find((detail: any) => detail?.descriptor?.name == "offeringInstitue")?.value,
    courseUrl: courseDetails?.list?.find((detail: any) => detail?.descriptor?.name == "url")?.value,
    enrollmentEndDate: courseDetails?.list?.find((detail: any) => detail?.descriptor?.name == "enrollmentEndDate")?.value,

    eligibility: eligibility?.list?.map((li: any) => ({ name: li?.descriptor?.name, value: li?.value })),
    courseHighlights: courseHighlights?.list?.map((li: any) => ({ name: li?.descriptor?.name, value: li?.value })),
    prerequisites: prerequisites?.list?.map((li: any) => ({ name: li?.descriptor?.name, value: li?.value }))
  }

  return { data: { context, course, courseDetails, additionalFormUrl } };
};
