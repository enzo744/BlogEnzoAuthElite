import aboutImg from "../assets/About-blog.avif"

const About = () => {
  return (
    <div className=" min-h-screen pt-28 px-4 md:px-0 mb-7 ">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="md:text-5xl text-4xl font-extrabold  mb-4">
            Informazioni sul nostro blog
          </h1>
          <p className="text-lg ">
            Un luogo dove condividere pensieri, ispirare gli altri e crescere insieme.
          </p>
        </div>

        {/* Image + Text Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-10 items-center">
          <img
            src={aboutImg}
            alt="Blog Illustration"
            className="w-full h-72 object-cover rounded-2xl shadow-md"
          />
          <div>
            <p className=" text-lg mb-4">
              Benvenuti nella nostra app Blog! Abbiamo creato questa piattaforma per consentire a lettori,
              scrittori e pensatori di entrare in contatto attraverso storie, tutorial e
              intuizioni creative. Che tu sia un blogger appassionato o qualcuno
              che ama leggere, questo spazio è pensato per te.
            </p>
            <p className=" text-lg mb-4">
              La nostra missione è dare alle persone la possibilità di esprimersi liberamente.
              Offriamo strumenti semplici per scrivere, pubblicare e interagire con gli altri in
              modi significativi.
            </p>
            <p className=" text-lg">
              Grazie per far parte della nostra comunità in crescita.
            </p>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="mt-16 text-center">
          <blockquote className="text-2xl italic text-gray-500">
            {/* "Words are powerful. Use them to inspir" */}
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default About;
