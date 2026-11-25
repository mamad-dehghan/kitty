import { NavBar, TabBar } from "./components";
import { demoCategories } from "./demos/registry";
import { breakPoints } from "./providers/Theme/types";

const sections = demoCategories.map((category) => ({
  title: category.title,
  Icon: category.Icon,
  content: (
    <TabBar
      key={category.title}
      scrollable="lazy"
      tabs={category.demos.map(({ title, Icon, PageContent }) => ({
        title,
        Icon,
        PageContent,
      }))}
    />
  ),
}));

function App() {
  return (
    <NavBar
      items={sections}
      initialActiveItem={demoCategories[0]?.title ?? "Actions"}
      media={{ md: breakPoints.lg }}
    />
  );
}

export default App;
