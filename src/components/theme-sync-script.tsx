export function ThemeSyncScript({ theme }: { theme?: string }) {
  const themeScript = `
    (function() {
      try {
        const theme = ${JSON.stringify(theme)};
        if (theme && theme !== 'system') {
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(theme);
          document.documentElement.style.colorScheme = theme;
        } else {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(systemTheme);
          document.documentElement.style.colorScheme = systemTheme;
        }
      } catch (e) {}
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
      suppressHydrationWarning
    />
  );
}
