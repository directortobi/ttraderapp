import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-deriv-dark text-white p-4">
          <div className="bg-deriv-dark-200 p-8 rounded-lg shadow-2xl text-center">
            <h1 className="text-2xl font-bold text-deriv-red mb-4">Something went wrong.</h1>
            <p className="text-gray-400 mb-6">
              An unexpected error occurred in a component. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-deriv-green text-white font-bold py-2 px-6 rounded-md hover:bg-teal-500 transition-colors duration-300"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
