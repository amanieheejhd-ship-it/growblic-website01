import ProcessGuidePage from "../ProcessGuidePage";
import { processGuides } from "../processGuideData";

export default function BuildProcessPage() {
  return <ProcessGuidePage guide={processGuides.build} />;
}
