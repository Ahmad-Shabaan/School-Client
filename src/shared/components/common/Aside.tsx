import { type ReactNode } from "react";
const Aside = ({
  children,
  asideHeader,
}: {
  children: ReactNode;
  asideHeader: string | ReactNode;
}) => {
  return (
    <section className="aside-section">
      <div className=" aside-section-blur" />
      <h2 className="aside-header flex justify-between">{asideHeader}</h2>
      {children}
    </section>
  );
};

export default Aside;
