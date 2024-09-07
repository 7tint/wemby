import type { Metadata } from "next";
import { fonts } from "./fonts";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Wemby Fantasy Helper",
  description: "Become the fantasy basketball CHAMP.",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" className={fonts.rubik.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
