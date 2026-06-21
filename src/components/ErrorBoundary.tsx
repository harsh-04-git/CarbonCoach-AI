import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Application boundary error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F0FDF4] text-slate-800 flex items-center justify-center px-6">
          <div className="max-w-md bg-white border border-emerald-100 rounded-3xl p-8 shadow-sm text-center">
            <h1 className="text-2xl font-black text-slate-900 font-display">
              CarbonCoach AI
            </h1>
            <p className="mt-3 text-sm text-slate-600 font-medium">
              Something unexpected happened. Refresh the page to continue your
              carbon planning journey.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
