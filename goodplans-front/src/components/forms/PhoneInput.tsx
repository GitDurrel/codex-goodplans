import PhoneInputWithCountry from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import type { Country } from 'react-phone-number-input';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  defaultCountry?: string;
  helperText?: string;
}

/**
 * Composant de saisie de téléphone avec sélecteur de pays
 * 
 * Utilise react-phone-number-input pour gérer automatiquement :
 * - Le sélecteur de pays avec drapeaux
 * - L'indicatif téléphonique (+212, +237, etc.)
 * - La validation du format
 * - Le formatage automatique
 * 
 * @param value - Valeur du téléphone au format E.164 (ex: "+237612345678")
 * @param onChange - Callback appelé lors du changement
 * @param label - Label du champ
 * @param placeholder - Placeholder
 * @param required - Champ requis ou non
 * @param disabled - Champ désactivé ou non
 * @param error - Message d'erreur à afficher
 * @param defaultCountry - Pays par défaut (code ISO, ex: "MA" pour Maroc)
 * @param helperText - Texte d'aide sous le champ
 */
export function PhoneInput({
  value,
  onChange,
  label,
  placeholder = 'Entrez votre numéro',
  required = false,
  disabled = false,
  error,
  defaultCountry = 'MA',
  helperText,
}: PhoneInputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <PhoneInputWithCountry
          international
          defaultCountry={defaultCountry as Country}
          value={value}
          onChange={(val) => onChange(val || '')}
          placeholder={placeholder}
          disabled={disabled}
          countryCallingCodeEditable={false}
          className={`
            phone-input-modern
            ${error ? 'phone-input-error' : ''}
            ${disabled ? 'phone-input-disabled' : ''}
          `}
        />
      </div>

      {error && (
        <div className="flex items-start gap-1.5 mt-1.5">
          <svg className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-red-600 leading-relaxed">{error}</p>
        </div>
      )}

      {helperText && !error && (
        <p className="text-xs text-slate-500 mt-1.5">{helperText}</p>
      )}

      <style>{`
        /* ============================================
           CONTAINER PRINCIPAL
           ============================================ */
        .phone-input-modern {
          width: 100%;
          position: relative;
        }

        /* ============================================
           INPUT TÉLÉPHONE
           ============================================ */
        .phone-input-modern .PhoneInputInput {
          width: 100%;
          border: 1px solid rgb(203 213 225);
          border-radius: 0.75rem;
          padding: 0.875rem 1rem;
          padding-left: 5rem;
          font-size: 0.9375rem;
          line-height: 1.5;
          outline: none;
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          background-color: white;
          color: rgb(15 23 42);
        }

        @media (min-width: 640px) {
          .phone-input-modern .PhoneInputInput {
            font-size: 0.875rem;
            padding: 0.75rem 1rem;
            padding-left: 5.5rem;
          }
        }

        .phone-input-modern .PhoneInputInput::placeholder {
          color: rgb(148 163 184);
        }

        .phone-input-modern .PhoneInputInput:hover {
          border-color: rgb(148 163 184);
        }

        .phone-input-modern .PhoneInputInput:focus {
          border-color: rgb(59 130 246);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        /* ============================================
           CONTAINER DU SÉLECTEUR DE PAYS
           ============================================ */
        .phone-input-modern .PhoneInputCountry {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          padding: 0 0.75rem;
          border-right: 1px solid rgb(226 232 240);
          background: linear-gradient(to bottom, rgb(248 250 252), rgb(241 245 249));
          border-radius: 0.75rem 0 0 0.75rem;
          z-index: 1;
          width: 4.5rem;
          transition: background 0.15s;
        }

        @media (min-width: 640px) {
          .phone-input-modern .PhoneInputCountry {
            width: 5rem;
            padding: 0 1rem;
          }
        }

        .phone-input-modern .PhoneInputCountry:hover {
          background: linear-gradient(to bottom, rgb(241 245 249), rgb(226 232 240));
        }

        /* ============================================
           SÉLECTEUR DE PAYS (DROPDOWN)
           ============================================ */
        .phone-input-modern .PhoneInputCountrySelect {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4.5rem;
          border: none;
          background: transparent;
          cursor: pointer;
          opacity: 0;
          z-index: 2;
        }

        @media (min-width: 640px) {
          .phone-input-modern .PhoneInputCountrySelect {
            width: 5rem;
          }
        }

        .phone-input-modern .PhoneInputCountrySelect:focus {
          outline: 2px solid rgb(59 130 246);
          outline-offset: -2px;
          border-radius: 0.75rem 0 0 0.75rem;
        }

        /* Style natif du select pour mobile */
        .phone-input-modern .PhoneInputCountrySelect option {
          padding: 0.75rem 1rem;
          font-size: 1rem;
        }

        /* ============================================
           ICÔNE DU DRAPEAU
           ============================================ */
        .phone-input-modern .PhoneInputCountryIcon {
          width: 1.75rem;
          height: 1.25rem;
          border-radius: 0.25rem;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(0, 0, 0, 0.08);
        }

        @media (min-width: 640px) {
          .phone-input-modern .PhoneInputCountryIcon {
            width: 2rem;
            height: 1.5rem;
          }
        }

        .phone-input-modern .PhoneInputCountryIconImg {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Flèche dropdown */
        .phone-input-modern .PhoneInputCountrySelectArrow {
          display: block;
          width: 0.375rem;
          height: 0.375rem;
          margin-left: 0.375rem;
          margin-top: 0.125rem;
          border-right: 1px solid rgb(100 116 139);
          border-bottom: 1px solid rgb(100 116 139);
          transform: rotate(45deg);
          transition: transform 0.15s;
          opacity: 0.7;
        }

        @media (min-width: 640px) {
          .phone-input-modern .PhoneInputCountrySelectArrow {
            width: 0.5rem;
            height: 0.5rem;
            margin-left: 0.5rem;
          }
        }

        .phone-input-modern .PhoneInputCountry:hover .PhoneInputCountrySelectArrow {
          opacity: 1;
          border-color: rgb(59 130 246);
        }

        /* ============================================
           INDICATIF TÉLÉPHONIQUE
           ============================================ */
        .phone-input-modern .PhoneInputCountryCallingCode {
          display: none;
        }

        /* ============================================
           ÉTAT D'ERREUR
           ============================================ */
        .phone-input-error .PhoneInputInput {
          border-color: rgb(239 68 68);
          background-color: rgb(254 242 242);
        }

        .phone-input-error .PhoneInputInput:focus {
          border-color: rgb(239 68 68);
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .phone-input-error .PhoneInputCountry {
          border-right-color: rgb(239 68 68);
          background: linear-gradient(to bottom, rgb(254 242 242), rgb(254 226 226));
        }

        /* ============================================
           ÉTAT DÉSACTIVÉ
           ============================================ */
        .phone-input-disabled .PhoneInputInput {
          background-color: rgb(248 250 252);
          color: rgb(148 163 184);
          cursor: not-allowed;
          opacity: 0.7;
        }

        .phone-input-disabled .PhoneInputCountry {
          background: rgb(241 245 249);
          cursor: not-allowed;
          opacity: 0.7;
        }

        .phone-input-disabled .PhoneInputCountrySelect {
          cursor: not-allowed;
        }

        .phone-input-disabled .PhoneInputCountryIcon {
          opacity: 0.5;
        }

        /* ============================================
           RESPONSIVE - MOBILE
           ============================================ */
        @media (max-width: 639px) {
          .phone-input-modern .PhoneInputInput {
            font-size: 16px !important; /* Évite le zoom sur iOS */
          }
        }

        /* ============================================
           RESPONSIVE - TABLET
           ============================================ */
        @media (min-width: 640px) and (max-width: 1023px) {
          .phone-input-modern .PhoneInputCountry {
            width: 5rem;
          }
          
          .phone-input-modern .PhoneInputInput {
            padding-left: 5.5rem;
          }
        }

        /* ============================================
           RESPONSIVE - DESKTOP
           ============================================ */
        @media (min-width: 1024px) {
          .phone-input-modern .PhoneInputCountry {
            width: 5.5rem;
          }

          .phone-input-modern .PhoneInputInput {
            padding-left: 6rem;
            font-size: 0.9375rem;
          }
        }

        /* ============================================
           ANIMATIONS
           ============================================ */
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }

        .phone-input-error .PhoneInputInput:focus {
          animation: shake 0.4s ease-in-out;
        }

        /* ============================================
           DARK MODE SUPPORT (optionnel)
           ============================================ */
        @media (prefers-color-scheme: dark) {
          .phone-input-modern .PhoneInputInput {
            background-color: rgb(30 41 59);
            border-color: rgb(51 65 85);
            color: rgb(226 232 240);
          }

          .phone-input-modern .PhoneInputInput::placeholder {
            color: rgb(100 116 139);
          }

          .phone-input-modern .PhoneInputCountry {
            background: linear-gradient(to bottom, rgb(30 41 59), rgb(15 23 42));
            border-right-color: rgb(51 65 85);
          }
        }
      `}</style>
    </div>
  );
}