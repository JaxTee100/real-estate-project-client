"use server";

import { createNewHouseRules } from "@/arcjet";
import { request } from "@arcjet/next";

export const protectHouseFormAction = async () => {
  const req = await request();
  const decision = await createNewHouseRules.protect(req);

  if (decision.isDenied()) {
    if (decision.reason.isBot()) {
      return {
        error: "Bot activity detected",
        success: false,
        status: 403,
      };
    } else if (decision.reason.isRateLimit()) {
      return {
        error: "Too many requests! Please try again later",
        success: false,
        status: 403,
      };
    } else if (decision.reason.isShield()) {
      return {
        error: "Invalid activity detected",
        success: false,
        status: 403,
      };
    }
  }

  return {
    success: true,
  };
};
