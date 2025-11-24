import { useState } from "react";
import { AlertCircle, Check, Loader2, Lock, Mail } from "lucide-react";
import { resetPassword, verifyResetCode } from "../api/apiAuth";

const RESET_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

export function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !code || !newPassword) {
      setError("Merci de remplir tous les champs");
      return;
    }
    if (!RESET_REGEX.test(newPassword)) {
      setError("Le mot de passe doit contenir 6 caractères, une majuscule, une minuscule et un chiffre");
      return;
    }

    setLoading(true);
    try {
      await verifyResetCode(email, code);
      await resetPassword(email, newPassword);
      setSuccess("Mot de passe réinitialisé. Vous pouvez vous connecter.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Réinitialisation impossible");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold mb-4">Réinitialiser le mot de passe</h1>
      {error && (
        <div className="mb-3 flex items-center rounded-lg bg-red-50 p-3 text-red-700">
          <AlertCircle className="mr-2 h-5 w-5" /> {error}
        </div>
      )}
      {success && (
        <div className="mb-3 flex items-center rounded-lg bg-emerald-50 p-3 text-emerald-700">
          <Check className="mr-2 h-5 w-5" /> {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
        <label className="block text-sm font-medium">
          Email
          <div className="mt-1 flex items-center rounded-lg border border-gray-200 px-3 py-2">
            <Mail className="mr-2 h-4 w-4 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 text-sm outline-none"
              required
            />
          </div>
        </label>

        <label className="block text-sm font-medium">
          Code de vérification
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            required
          />
        </label>

        <label className="block text-sm font-medium">
          Nouveau mot de passe
          <div className="mt-1 flex items-center rounded-lg border border-gray-200 px-3 py-2">
            <Lock className="mr-2 h-4 w-4 text-gray-400" />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="flex-1 text-sm outline-none"
              required
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Min 6 caractères avec majuscule, minuscule et chiffre.</p>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Valider
        </button>
      </form>
    </div>
  );
}
