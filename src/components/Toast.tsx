import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function Toast() {
    return (
        <Button
            variant="outline"
            onClick={() =>
                toast("Event has been created", {
                    position: "top-right",
                    description: "Welcome to our website",
                    action: {
                        label: "Undo",
                        onClick: () => console.log("Undo"),
                    },
                })
            }
        >
            Show Toast
        </Button>
    )
}
