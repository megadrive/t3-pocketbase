export const Alert = ({
  type,
  message,
}: {
  type: "info" | "warn" | "error";
  message: string;
}) => {
  return (
    <div
      className={`uppercase ${
        type === "error"
          ? "border border-red-100 bg-red-300 text-red-500"
          : type === "warn"
          ? "border border-amber-100 bg-amber-300 text-amber-500"
          : type === "info"
          ? "bg-grey-300 border border-gray-100 text-gray-600"
          : ""
      }`}
    >
      {message}
    </div>
  );
};
