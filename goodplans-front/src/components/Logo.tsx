import { Link } from "react-router-dom";

const LOGO_URL =
  "https://unixwmlawlmpsycmuwhy.supabase.co/storage/v1/object/sign/logo/black.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5Xzk4ZmU2MmMxLTFlNGQtNDRhOS1hOWM5LWYwNDY2NjFiZThmYyJ9.eyJ1cmwiOiJsb2dvL2JsYWNrLnBuZyIsImlhdCI6MTc0NjYzOTExMCwiZXhwIjoyMDYxOTk5MTEwfQ.dgkVjSHznMp6gb-vpj4vDbDWi2XV4ytf4AHIoUUIp5o";

type LogoProps = {
  className?: string;
};

export default function Logo({ className = "" }: LogoProps) {
  return (
    <Link to="/" className={`flex items-center shrink-0 ${className}`}>
      <img
        src={LOGO_URL}
        alt="Goodplans Logo"
        className="
          h-28
          sm:h-24
          md:h-32
          lg:h-40
          xl:h-45
          2xl:h-44
          w-auto
          object-contain
          max-w-none
        "
      />
    </Link>
  );
}


// // import React from 'react';
// import { Link } from 'react-router-dom';

// const LOGO_URL = 'https://unixwmlawlmpsycmuwhy.supabase.co/storage/v1/object/sign/logo/black.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5Xzk4ZmU2MmMxLTFlNGQtNDRhOS1hOWM5LWYwNDY2NjFiZThmYyJ9.eyJ1cmwiOiJsb2dvL2JsYWNrLnBuZyIsImlhdCI6MTc0NjYzOTExMCwiZXhwIjoyMDYxOTk5MTEwfQ.dgkVjSHznMp6gb-vpj4vDbDWi2XV4ytf4AHIoUUIp5o';

// export default function Logo() {
//   return (
//     <Link to="/" className="flex items-center">
//       <img
//         src={LOGO_URL}
//         alt="Goodplans Logo"
//         className="h-42 sm:h-42 md:h-60 w-auto object-contain" // Tailles augmentées
//       />
//     </Link>
//   );
// }