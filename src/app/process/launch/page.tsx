import ProcessGuidePage from "../ProcessGuidePage";
import { processGuides } from "../processGuideData";

export default function LaunchProcessPage() {
  return <ProcessGuidePage guide={processGuides.launch} />;
}
