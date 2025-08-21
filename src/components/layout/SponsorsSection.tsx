import React from "react";

interface SponsorsSectionProps {
  className?: string;
  showTitle?: boolean;
}

const SponsorsSection: React.FC<SponsorsSectionProps> = ({
  className = "",
  showTitle = true,
}) => {
  const sponsors = [
    { name: "CR", logo: "/images/Logo_CR.jpg" },
    { name: "Honório Coelho", logo: "/images/Logo_Honorio_coelho.jpg" },
    {
      name: "Ilê Asé Iyá Oju Omi",
      logo: "/images/Logo_Ile_Ase_Iya_Oju_Omi.png",
    },
    { name: "Bantu Brasil", logo: "/images/Logo_bantu_brasil.png" },
    { name: "Cia Teatral", logo: "/images/Logo_cia_teatral.png" },
    { name: "Grupo Acto", logo: "/images/Logo_grupo_acto.jpg" },
  ];

  const realizacao = {
    name: "Realização Governo",
    logo: "/images/Logo_Realização_Gov.png",
  };

  const desenvolvedor = {
    name: "Desenvolvedor",
    logo: "/images/Logo_Automatizai.png",
  };

  const culturaLogo = {
    name: "Cultura",
    logo: "/images/Logo_cultura.png"
  };

  return (
    <div className={`w-full max-w-[700px] mx-auto px-4 ${className}`}>
      {/* base: coluna; md+: grid 4x2 */}
      <div
        className="flex flex-col items-center gap-6 mb-6
                  md:grid md:grid-cols-4 md:grid-rows-2 md:justify-items-center md:items-center md:gap-4"
      >
        {/* Cultura */}
        <img
          src={culturaLogo.logo}
          alt={culturaLogo.name}
          className="w-32 md:w-24 object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />

        {/* Sponsors */}
        {sponsors.map((sponsor, index) => (
          <div key={index} className="flex items-center justify-center">
            <img
              src={sponsor.logo}
              alt={sponsor.name}
              className="w-24 md:w-16 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
        ))}

        {/* Realização */}
        <img
          src={realizacao.logo}
          alt={realizacao.name}
          className="w-64 md:w-96 object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
      </div>

      {/* Título */}

      <div className="flex flex-col items-center justify-center pb-2">

        <h2 className="text-lg font-bold text-center text-gray-800 mb-6">
          Desenvolvido por
        </h2>

        <img
          src={desenvolvedor.logo}
          alt="Desenvolvedor"
          className="w-32 object-contain"
        />
      </div>
    </div>
  );
};

export default SponsorsSection;
