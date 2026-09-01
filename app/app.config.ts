export default defineAppConfig({
  ui: {
    colors: {
      primary: "blue",
    },
    table: {
      slots: {
        root: "border border-default rounded dark:bg-elevated",
        tr: "hover:bg-slate-500/10 dark:hover:bg-slate-500/10 transition-all cursor-pointer",
        th: "font-mono uppercase text-muted bg-accented text-xs",
        td: "text-default text-sm",
      },
    },
    card: {
      variants: {
        variant: {
          subtle: {
            root: "bg-neutral-50 dark:bg-elevated ring ring-default divide-y divide-default",
          },
        },
      },
      defaultVariants: {
        variant: "subtle",
      },
    },
    button: {
      variants: {
        variant: {
          customButton: "",
        },
      },
      compoundVariants: [
        {
          variant: "customButton",
          color: "primary",
          class:
            "bg-accented text-muted hover:bg-primary-400/15 hover:text-primary-400 transition-all duration-300",
        },
        {
          variant: "customButton",
          color: "success",
          class:
            "bg-accented text-muted hover:bg-success-400/15 hover:text-success-400 transition-all duration-300",
        },
        {
          variant: "customButton",
          color: "info",
          class:
            "bg-accented text-muted hover:bg-info-400/15 hover:text-info-400 transition-all duration-300",
        },
        {
          variant: "customButton",
          color: "warning",
          class:
            "bg-accented text-muted hover:bg-warning-400/15 hover:text-warning-400 transition-all duration-300",
        },
        {
          variant: "customButton",
          color: "error",
          class:
            "bg-accented text-muted hover:bg-error-400/15 hover:text-error-400 transition-all duration-300",
        },
      ],
    },
  },
});
