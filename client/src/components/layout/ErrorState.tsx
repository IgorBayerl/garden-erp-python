interface ErrorStateProps {
  message?: string;
}

export default function ErrorState({ message = "Failed to load data" }: ErrorStateProps) {
  return <p className="text-red-500">{message}</p>;
}
