export default function UserPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="px-4 md:px-6 py-6 w-full">
      {children}
    </div>
  );
}
