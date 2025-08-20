// Minimal layout required by Next.js App Router
export const metadata = {
  title: "federated_backend_api",
  description: "API Server",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
