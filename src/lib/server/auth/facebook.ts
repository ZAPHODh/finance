import { Facebook } from "arctic";

export const facebook = new Facebook(
    process.env.FACEBOOK_CLIENT_ID!,
    process.env.FACEBOOK_CLIENT_SECRET!,
    process.env.FACEBOOK_REDIRECT_URI!
);
