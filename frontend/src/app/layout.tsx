import type { Metadata } from "next";
import { fonts } from "./fonts";

import "./globals.css";

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
      <body className="text-sm bg-inherit">{children}</body>
    </html>
  );
};

export default RootLayout;
