import { ReactNode } from "react";

const BaseLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <div className="mx-auto mt-16 mb-12 px-6 md:px-8 lg:px-12">{children}</div>
  );
};

export default BaseLayout;
