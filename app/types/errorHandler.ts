export type FeedbackColor = "warning" | "error" | "neutral";

export interface FriendlyError {
  title: string;
  description: string;
  icon: string;
  color: FeedbackColor;
  status?: number;
  showRetry?: boolean;
  customAction?: {
    label: string;
    icon?: string;
    event: "contactSupport";
  };
}

export interface FriendlyErrorOptions {
  maskStatus?: number;
  title?: string;
  description?: string;
  showRetry?: boolean;
}
