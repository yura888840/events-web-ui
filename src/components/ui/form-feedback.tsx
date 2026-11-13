export function FormFeedback({
  errors = [],
  success,
}: {
  errors?: string[];
  success?: string;
}) {
  return (
    <>
      {errors.length > 0 && (
        <ul role="alert" className="list-disc space-y-1 pl-5 text-red-700">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
      {success && (
        <p role="status" className="text-green-700">
          {success}
        </p>
      )}
    </>
  );
}
