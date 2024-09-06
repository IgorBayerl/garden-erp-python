interface ErrorStateProps {
  message?: string;
}

export default function ErrorState({ message = "Falha ao carregar dados" }: ErrorStateProps) {
  return <p className="text-red-500">{message}</p>;
}
