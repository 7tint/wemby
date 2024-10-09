import { ReactNode } from "react";

const BaseLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return <div className="mx-auto my-12 px-2 md:px-6 lg:px-8">{children}</div>;
};

export default BaseLayout;
