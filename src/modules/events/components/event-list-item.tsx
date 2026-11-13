import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

type EventListItemProps = {
  event: { name: string; isActive: boolean };
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};
export function EventListItem({
  event,
  onToggle,
  onEdit,
  onDelete,
}: EventListItemProps) {
  return (
    <li
      className="flex items-center gap-4 rounded-lg border
                border-gray-200 p-4 transition-colors
                hover:bg-gray-200 hover:border-gray-400"
    >
      <h2 className="min-w-0 flex-1 break-words font-medium">{event.name}</h2>

      <div className="flex shrink-0 items-center gap-2">
        <Switch
          checked={event.isActive}
          aria-label={`Активность события «${event.name}»`}
          title={event.isActive ? "Деактивировать" : "Активировать"}
          onCheckedChange={() => onToggle()}
        />
        <Button
          variant="icon"
          type="button"
          aria-label={`Редактировать событие «${event.name}»`}
          title="Edit"
          onClick={() => onEdit()}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="m16 3 5 5L8 21H3v-5L16 3Z" />
            <path d="m14 5 5 5" />
          </svg>
        </Button>
        <Button
          variant="icon"
          type="button"
          aria-label={`Delete event «${event.name}»`}
          title="Удалить"
          onClick={() => onDelete()}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15" />
            <path d="M10 10v7M14 10v7" />
          </svg>
        </Button>
      </div>
    </li>
  );
}
