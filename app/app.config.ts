export default defineAppConfig({
  ui: {
    colors: {
      primary: "blue",
      neutral: "slate",
    },
    table: {
      slots: {
        root: "border border-default rounded ",
        tr: "hover:bg-elevated transition-all",
        th: "font-mono uppercase text-muted bg-elevated text-xs",
        td: "text-default text-sm",
      },
    },
    card: {
      defaultVariants: {
        variant: "subtle",
      },
    },
    button: {
      slots: {
        base: "cursor-pointer",
      },
    },
  },
});
