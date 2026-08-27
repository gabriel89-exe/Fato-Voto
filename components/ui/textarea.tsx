import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-24 w-full border-2 border-tinta-900 bg-papel-alta px-3.5 py-3 font-texto text-base leading-relaxed text-tinta-900 shadow-[inset_2px_2px_0_0_rgba(27,26,22,0.08)] placeholder:text-tinta-400 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
