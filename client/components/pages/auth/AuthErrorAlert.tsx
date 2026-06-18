interface AuthErrorAlertProps {
  message: string;
}

export default function AuthErrorAlert({ message }: AuthErrorAlertProps) {
  return (
    <div className="mb-4 p-3 bg-[#D12052]/10 border border-[#D12052] text-[#D12052] text-xs font-bold uppercase rounded-lg">
      ⚠️ {message}
    </div>
  );
}
