export default defineAppConfig({
  ui: {
    colors: {
      primary: "blue",
    },
    table: {
      slots: {
        root: "shadow-sm border border-default rounded dark:bg-elevated",
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
  },
});
