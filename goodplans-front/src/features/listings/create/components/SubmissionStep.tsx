import { Loader2 } from "lucide-react";

interface SubmissionStepProps {
  listing: any;
  details: any;
  category: string;
  createListing: () => Promise<void>;
  loading: boolean;
}

export function SubmissionStep({
  listing,
  details,
  category,
  createListing,
  loading,
}: SubmissionStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Finalisation</h3>

      <p className="text-gray-600">
        Vérifiez vos informations avant de publier l’annonce.
      </p>

      <button
        onClick={createListing}
        disabled={loading}
        className="bg-blue-600 text-white w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="animate-spin w-5 h-5" />}
        Publier mon annonce
      </button>
    </div>
  );
}
