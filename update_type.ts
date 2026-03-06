import fs from "fs";

const filePath = "apps/studio/app/pipeline/components/activity-logger.tsx";
let content = fs.readFileSync(filePath, "utf8");

// Replace the onValueChange prop to cast the value
content = content.replace(
  "<Select value={type} onValueChange={setType}>",
  '<Select value={type} onValueChange={(val) => setType(val as "note" | "call" | "email" | "meeting")}>',
);

fs.writeFileSync(filePath, content);
