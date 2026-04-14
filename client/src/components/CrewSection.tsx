const CREW = [
  {
    name: "Roberto",
    role: "The Organizer 🗺️",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663317159989/divoTFuiZ4zME3qNVuo2UX/caricature_roberto_sm_347f2805.png",
  },
  {
    name: "Sebastian",
    role: "The Groom 👑",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663317159989/divoTFuiZ4zME3qNVuo2UX/caricature_sebastian_sm_883a6874.png",
  },
  {
    name: "Jorge",
    role: "The Adventurer 🌍",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663317159989/divoTFuiZ4zME3qNVuo2UX/caricature_jorge_sm_d2837c2e.png",
  },
  {
    name: "Pablo",
    role: "The Explorer 🎒",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663317159989/divoTFuiZ4zME3qNVuo2UX/caricature_pablo_sm_d4834723.png",
  },
];

export default function CrewSection() {
  return (
    <section className="py-16 px-4 bg-secondary/20">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-gold-gradient mb-2 text-center">The Crew</h2>
        <p className="text-muted-foreground text-sm mb-10 text-center">The four amigos taking Madrid by storm 🇪🇸</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {CREW.map((member) => (
            <div key={member.name} className="flex flex-col items-center group">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-border group-hover:border-primary transition-all duration-300 bg-card">
                <img
                  src={member.img}
                  alt={`${member.name} caricature`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {member.name === "Sebastian" && (
                  <div className="absolute top-2 right-2 text-lg">👑</div>
                )}
              </div>
              <p className="font-display font-bold text-foreground text-lg mt-3">{member.name}</p>
              <p className="text-muted-foreground text-xs text-center">{member.role}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <div className="spanish-flag-bar w-32 mx-auto rounded-full" />
          <p className="font-display text-xl text-gold-gradient mt-4">¡Que viva la Despedida! 🥂</p>
        </div>
      </div>
    </section>
  );
}
