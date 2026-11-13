import * as React from "react";
import { cn } from "@/lib/utils";

const sizeStyles = {
  sm: "h-8 px-2.5 text-xs gap-1.5",
  default: "h-9 px-3.5 text-sm gap-2",
  md: "h-9 px-3.5 text-sm gap-2",
  lg: "h-10 px-4 text-sm font-semibold gap-2",
};

const SegmentedControlContext = React.createContext({
  size: "default",
});

export const SegmentedControl = React.forwardRef(
  ({ render, size = "default", className, children, ...props }, ref) => {
    const baseClasses = cn(
      "inline-flex items-center gap-1 p-1 rounded-xl bg-muted border border-border transition-colors",
      className
    );

    const contextValue = React.useMemo(() => ({ size }), [size]);

    const content = (
      <SegmentedControlContext.Provider value={contextValue}>
        {children}
      </SegmentedControlContext.Provider>
    );

    if (React.isValidElement(render)) {
      return React.cloneElement(render, {
        ref,
        className: cn(baseClasses, render.props.className),
        ...props,
        children: content,
      });
    }

    return (
      <div ref={ref} className={baseClasses} role="group" {...props}>
        {content}
      </div>
    );
  }
);
SegmentedControl.displayName = "SegmentedControl";

export const SegmentedControlItem = React.forwardRef(
  ({ render, active, className, children, ...props }, ref) => {
    const { size } = React.useContext(SegmentedControlContext);

    // Determine active status:
    // 1. Explicit `active` prop
    // 2. `aria-current` from props or render prop ("page", "step", "location", "date", "time", or truthy)
    const isAriaCurrent =
      Boolean(props["aria-current"]) ||
      (React.isValidElement(render) && Boolean(render.props["aria-current"]));

    const isActive = Boolean(active ?? isAriaCurrent);

    const itemClasses = cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all duration-200 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
      sizeStyles[size] || sizeStyles.default,
      isActive
        ? "bg-primary text-primary-foreground border border-border shadow-xs font-semibold"
        : "text-foreground/75 hover:text-foreground hover:bg-card/70 border border-transparent",
      className
    );

    if (React.isValidElement(render)) {
      // If render has a className function (like NavLink), we wrap it or merge
      const renderClass =
        typeof render.props.className === "function"
          ? (navState) =>
              cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all duration-200 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
                sizeStyles[size] || sizeStyles.default,
                navState.isActive
                  ? "bg-primary text-primary-foreground border border-border shadow-xs font-semibold"
                  : "text-foreground/75 hover:text-foreground hover:bg-card/70 border border-transparent",
                className,
                render.props.className(navState)
              )
          : cn(itemClasses, render.props.className);

      return React.cloneElement(render, {
        ref,
        className: renderClass,
        ...props,
        children: children ?? render.props.children,
      });
    }

    return (
      <button
        ref={ref}
        type="button"
        className={itemClasses}
        aria-pressed={isActive}
        {...props}
      >
        {children}
      </button>
    );
  }
);
SegmentedControlItem.displayName = "SegmentedControlItem";
