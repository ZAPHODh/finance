export const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL || "";

export const siteConfig = (locale: string = "en") => ({
    name: "D2D",
    url: siteUrl + "/" + locale,
    ogImage: `${siteUrl}/${locale}/opengraph-image`,
    description: "A financial management tool to track your income and expenses.",
    links: {
        twitter: "",
        github: "",
    },
});


export type SiteConfig = typeof siteConfig

export const META_THEME_COLORS = {
    light: "#ffffff",
    dark: "#09090b",
}