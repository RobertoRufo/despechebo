const CREW = [
  {
    name: "Roberto",
    role: "The Organizer 🗺️",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663317159989/divoTFuiZ4zME3qNVuo2UX/caricature_roberto_sm_dd890896.png",
  },
  {
    name: "Sebastian",
    role: "The Groom 👰",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663317159989/divoTFuiZ4zME3qNVuo2UX/caricature_sebastian_veil_64492769.png",
  },
  {
    name: "Jorge",
    role: "The Adventurer 🌍",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663317159989/divoTFuiZ4zME3qNVuo2UX/caricature_jorge_sm_6e01b28e.png",
  },
  {
    name: "Pablo",
    role: "The Explorer 🎒",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663317159989/divoTFuiZ4zME3qNVuo2UX/caricature_pablo_new-J7Wxq52bue9n9JK34nQ2W9.webp",
  },
];

export default function CrewSection() {
  return (
    <section className="py-16 px-4 bg-stone-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-black text-red-700 mb-2 text-center">💃 The Crew</h2>
        <p className="text-stone-500 text-sm mb-10 text-center">Four friends taking Madrid by storm 🇪🇸</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {CREW.map((member) => (
            <div key={member.name} className="flex flex-col items-center group">
              <div className={`relative w-full aspect-square rounded-2xl overflow-hidden border-3 transition-all duration-300 bg-white shadow-md ${
                member.name === "Sebastian"
                  ? "border-yellow-400 shadow-yellow-200 ring-2 ring-yellow-300"
                  : "border-stone-200 group-hover:border-red-400 group-hover:shadow-red-100"
              }`}>
                <img
                  src={member.img}
                  alt={`${member.name} caricature`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {member.name === "Sebastian" && (
                  <div className="absolute top-2 right-2 text-lg bg-yellow-100 rounded-full px-1">👰</div>
                )}
              </div>
              <p className="font-display font-bold text-stone-800 text-lg mt-3">{member.name}</p>
              <p className="text-stone-400 text-xs text-center">{member.role}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <div className="spanish-flag-bar w-32 mx-auto rounded-full" />
          <p className="font-display text-xl text-red-700 font-bold mt-4">¡Viva Sebastian! 🥂</p>
          <p className="text-stone-400 text-sm mt-1">Long live the Bachelor Party!</p>
        </div>
      </div>
    </section>
  );
}
