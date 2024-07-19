import { Provider } from "next-auth/providers/index";

const CustomFacebookBusinessProvider = {
  id: "facebook_business",
  name: "Facebook for Business",
  type: "oauth",
  authorization: {
    url: "https://www.facebook.com/dialog/oauth",
    params: {
      scope:
        "pages_show_list ads_management business_management pages_read_engagement pages_manage_posts email ads_read",
    },
  },
  token: {
    url: "https://graph.facebook.com/oauth/access_token",
  },
  userinfo: {
    url: "https://graph.facebook.com/me",
    params: { fields: "id,name,email,picture" },
    async request({ tokens, client, provider }) {
      return await client.userinfo(tokens.access_token!, {
        // @ts-expect-error
        params: provider.userinfo?.params,
      });
    },
  },
  clientId: process.env.DEV_FACEBOOK_CLIENT_ID,
  clientSecret: process.env.DEV_FACEBOOK_CLIENT_SECRET,

  profile(profile) {
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      image: profile.picture.data.url,
    };
  },
} satisfies Provider;

export default CustomFacebookBusinessProvider;
