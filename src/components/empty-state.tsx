export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center text-sm text-gray-500">
      {message}
    </div>
  );
}
