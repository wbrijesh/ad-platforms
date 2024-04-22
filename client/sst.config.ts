import { SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "meta-ads",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, "site", {
        environment: {
          NEXT_PUBLIC_FACEBOOK_CLIENT_ID: "2382671861927128",
          FACEBOOK_CLIENT_ID: "2382671861927128",
          NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET:
            "e373ca95f95dbe171e379ed518ee8303",
          FACEBOOK_CLIENT_SECRET: "e373ca95f95dbe171e379ed518ee8303",
          NEXT_PUBLIC_NEXTAUTH_SECRET:
            "VtG0MPHfD7WhnHvgsYGznTW4L3OrRjraJmJGM0ew6",
          NEXTAUTH_SECRET: "akjbsfkjabsdf",
          NEXT_PUBLIC_NEXTAUTH_URL: "https://d4oe8ly9ij2l7.cloudfront.net",
          NEXTAUTH_URL: "https://d4oe8ly9ij2l7.cloudfront.net",
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
