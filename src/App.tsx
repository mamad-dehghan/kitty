import { NavBar, TabBar } from "./components";
import { demoCategories } from "./demos/registry";
import { breakPoints } from "./providers/Theme/types";

const sections = demoCategories.map((category) => ({
  title: category.title,
  Icon: category.Icon,
  content: (
    <TabBar
      key={category.title}
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
    <main
      key="light"
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <NavBar
        items={sections}
        initialActiveItem={demoCategories[0]?.title ?? "Actions"}
        media={{ md: breakPoints.lg }}
      />
    </main>
  );
}

export default App;
