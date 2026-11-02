import { useBoardStore, GRID_MIN, GRID_MAX } from "@entities/board";
import { Input } from "@shared/ui";
import { Label } from "@shared/ui";
import { parseDraft, useGridSizeDraftStore } from "../model/grid-size-draft";

interface GridSizeFieldProps {
  id: string;
  label: string;
  storeValue: number;
  draft: string | null;
  setDraft: (value: string | null) => void;
  onCommit: (value: number) => void;
}

/**
 * One dimension (width/height) of the grid. The user types freely; the value is
 * committed (and clamped by the board store) as soon as it is a valid number,
 * the field shows the clamped store value again on blur.
 */
const GridSizeField = ({ id, label, storeValue, draft, setDraft, onCommit }: GridSizeFieldProps) => {
  const shown = draft ?? String(storeValue);

  return (
    <div className="flex items-center gap-1.5">
      <Label htmlFor={id} className="text-xs">
        {label}
      </Label>
      <Input
        id={id}
        inputMode="numeric"
        className="h-8 w-16"
        value={shown}
        onChange={(e) => {
          const text = e.target.value;
          setDraft(text);
          const { value } = parseDraft(text, storeValue, GRID_MIN, GRID_MAX);
          onCommit(value);
        }}
        onBlur={() => setDraft(null)}
      />
    </div>
  );
};

const GridSizeControls = () => {
  const width = useBoardStore((s) => s.width);
  const height = useBoardStore((s) => s.height);
  const setGridSize = useBoardStore((s) => s.setGridSize);
  const draft = useGridSizeDraftStore((s) => s);
  const { setWidthDraft, setHeightDraft } = draft;

  return (
    <div className="flex items-center gap-1.5">
      <GridSizeField
        id="grid-width"
        label="W"
        storeValue={width}
        draft={draft.widthDraft}
        setDraft={setWidthDraft}
        onCommit={(value) => setGridSize(value, height)}
      />
      <span className="text-xs text-muted-foreground">×</span>
      <GridSizeField
        id="grid-height"
        label="H"
        storeValue={height}
        draft={draft.heightDraft}
        setDraft={setHeightDraft}
        onCommit={(value) => setGridSize(width, value)}
      />
      <span className="ml-1 text-xs text-muted-foreground">
        tiles ({GRID_MIN}–{GRID_MAX})
      </span>
    </div>
  );
};

export { GridSizeControls };
