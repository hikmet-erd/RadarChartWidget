import { ReactElement, Component, ErrorInfo, ReactNode, createElement } from "react";
import { isDevelopmentMode } from "../utils/envUtils";
import { logError } from "../utils/loggerUtils";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactElement;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.setState({ error, errorInfo });

        // Log error for debugging using environment-aware logging
        logError("Error Boundary caught an error", error, {
            componentStack: errorInfo.componentStack,
            errorBoundary: "RadarChart"
        });

        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    private handleRetry = (): void => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Custom fallback UI or default error UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="radar-chart-widget__error" role="alert" aria-live="assertive">
                    <div className="radar-chart-widget__error__icon" aria-hidden="true">
                        ⚠️
                    </div>
                    <div className="radar-chart-widget__error__title">Something went wrong</div>
                    <div className="radar-chart-widget__error__message">
                        {this.state.error?.message || "An unexpected error occurred while rendering the chart."}
                    </div>
                    <div className="radar-chart-widget__error__actions">
                        <button
                            className="radar-chart-widget__error__retry-btn"
                            onClick={this.handleRetry}
                            type="button"
                            aria-label="Retry loading chart"
                        >
                            Try Again
                        </button>
                    </div>
                    {isDevelopmentMode() && this.state.errorInfo && (
                        <details className="radar-chart-widget__error__details">
                            <summary>Error Details (Development Only)</summary>
                            <pre style={{ fontSize: "10px", marginTop: "8px", color: "#666" }}>
                                {this.state.error?.stack}
                                {this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }
}
