import { Google } from "arctic";

export const google = new Google(
    process.env.GITHUB_CLIENT_ID!,
    process.env.GITHUB_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
);