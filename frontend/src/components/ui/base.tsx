import { ReactNode } from "react";

const BaseLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <div className="mx-auto mt-16 mb-12 px-2 md:px-6 lg:px-8 xl:px-10">
      {children}
    </div>
  );
};

export default BaseLayout;
