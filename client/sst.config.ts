/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "Ad_Platforms_Client",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      domain: {
        name: "ad-platforms.brijesh.dev",
      },
    };
  },
  async run() {
    new sst.aws.Nextjs("AdPlatformsClient");
  },
});
