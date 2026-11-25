import { type Icon } from "@phosphor-icons/react";
import classNames from "classnames";
import {
  type LazyExoticComponent,
  type ReactElement,
  Suspense,
} from "react";
import { LoadingIndicator } from "../LoadingIndicator/LoadingIndicator";

export type pageComponent =
  | LazyExoticComponent<() => ReactElement>
  | (() => ReactElement);

export type tabBase = {
  title: string;
  PageContent: pageComponent;
  PageLoadder?: pageComponent;
};

export type iconTab = tabBase & {
  Icon: Icon;
};

export type simpleTab = tabBase & {
  Icon?: never;
};

export type TabItem = iconTab | simpleTab;

export type TabContentHandle = {
  activate: (
    index: number,
    options?: { behavior?: ScrollBehavior },
  ) => void;
};

export type TabContentProps = {
  tabs: TabItem[];
  activeIndex: number;
  baseId: string;
  onActiveChange: (title: string) => void;
};

type tabPanelProps = {
  tab: Pick<TabItem, "PageContent" | "PageLoadder">;
  isActive: boolean;
  isRendered: boolean;
  id: string;
  labelledBy: string;
};

export const clampIndex = (index: number, length: number) =>
  Math.min(Math.max(index, 0), Math.max(length - 1, 0));

export const getTabId = (baseId: string, index: number) =>
  `${baseId}-tab-${index}`;

export const getPanelId = (baseId: string, index: number) =>
  `${baseId}-panel-${index}`;

const PageLoading = () => (
  <div className="tab-loading">
    <LoadingIndicator />
  </div>
);

export const TabPanel = ({
  tab,
  isActive,
  isRendered,
  id,
  labelledBy,
}: tabPanelProps) => {
  return (
    <div
      className={classNames("page", isActive && "active")}
      id={id}
      role="tabpanel"
      aria-labelledby={labelledBy}
      aria-busy={isActive && !isRendered ? true : undefined}
      tabIndex={0}
      inert={!isActive}
    >
      {isRendered ? (
        <Suspense fallback={<TabLoader tab={tab} />}>
          <tab.PageContent />
        </Suspense>
      ) : null}
    </div>
  );
};

const TabLoader = ({ tab }: { tab: Pick<TabItem, "PageLoadder"> }) => {
  if (!tab.PageLoadder) return <PageLoading />;

  return (
    <Suspense fallback={<PageLoading />}>
      <tab.PageLoadder />
    </Suspense>
  );
};
