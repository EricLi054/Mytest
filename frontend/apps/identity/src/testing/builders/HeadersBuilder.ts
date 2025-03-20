import { NpeOtpFeatureHeaders } from "@racwa/mfa/types";

export default class HeadersBuilder {
  headers: Record<string, string>;

  constructor() {
    this.headers = {};
  }

  build(): Record<string, string> {
    return this.headers;
  }

  withCorrelationId(correlationId?: string): HeadersBuilder {
    this.headers.CorrelationId = correlationId ?? "123456789-98765321";
    return this;
  }

  withUserAgent(userAgent?: string): HeadersBuilder {
    this.headers["User-Agent"] = userAgent ?? "This is a user agent";
    return this;
  }

  withBypassOtp(bypassOtp: boolean): HeadersBuilder {
    this.headers[NpeOtpFeatureHeaders.BypassOtp] = bypassOtp.toString();
    return this;
  }

  withOverrideToNumber(overrideToNumber: string): HeadersBuilder {
    this.headers[NpeOtpFeatureHeaders.OverrideToNumber] = overrideToNumber;
    return this;
  }

  withDefaultNpeOtpFeatureHeaders(): HeadersBuilder {
    this.withBypassOtp(true);
    this.withOverrideToNumber("");
    return this;
  }
}
