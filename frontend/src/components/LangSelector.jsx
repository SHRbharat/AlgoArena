import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { languages } from "../assets/mapping";

export const LangSelector = ({ language_id, onSelect }) => {
  return (
    <Select
      defaultValue={language_id}
      onValueChange={(value) => onSelect(value)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(languages).map(([id, language]) => {
          return (
            <SelectItem key={id} value={id}>
              {language.name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
