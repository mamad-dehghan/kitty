import { type ReactNode } from "react";
import "./DemoLayout.scss";

type pageProps = {
  title: string;
  description?: ReactNode;
  children: ReactNode;
};

export const DemoPage = ({ title, description, children }: pageProps) => {
  return (
    <div className="demo-page">
      <header className="demo-page__header">
        <h1>{title}</h1>
        {description ? <p>{description}</p> : undefined}
      </header>
      <div className="demo-page__sections">{children}</div>
    </div>
  );
};

type sectionProps = {
  title: string;
  description?: ReactNode;
  children: ReactNode;
};

export const DemoSection = ({
  title,
  description,
  children,
}: sectionProps) => {
  return (
    <section className="demo-section">
      <div className="demo-section__header">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : undefined}
      </div>
      <div className="demo-section__body">{children}</div>
    </section>
  );
};

type rowProps = {
  children: ReactNode;
  align?: "start" | "center" | "end";
};

export const DemoRow = ({ children, align = "center" }: rowProps) => {
  return (
    <div className="demo-row" data-align={align}>
      {children}
    </div>
  );
};

export const DemoColumn = ({ children }: { children: ReactNode }) => {
  return <div className="demo-column">{children}</div>;
};

export const DemoNote = ({ children }: { children: ReactNode }) => {
  return <p className="demo-note">{children}</p>;
};

export const DemoField = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => {
  return (
    <label className="demo-field">
      <span className="demo-field__label">{label}</span>
      {children}
    </label>
  );
};

export const DemoFrame = ({
  height = "320px",
  children,
}: {
  height?: string;
  children: ReactNode;
}) => {
  return (
    <div className="demo-frame" style={{ height }}>
      {children}
    </div>
  );
};
