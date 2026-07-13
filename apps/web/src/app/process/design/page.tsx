import ProcessGuidePage from "../ProcessGuidePage";
import { processGuides } from "../processGuideData";

export default function DesignProcessPage() {
  return <ProcessGuidePage guide={processGuides.design} />;
}
