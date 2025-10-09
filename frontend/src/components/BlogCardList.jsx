import React from "react";

const BlogCardList = ({ blog }) => {
  const date = new Date(blog.createdAt);
  const formattedDate = date.toLocaleDateString("it-IT");
  return (
    <div className="bg-sky-100 dark:bg-gray-700 dark:border-gray-600 flex flex-col lg:flex-row md:gap-12 rounded-2xl mt-4 p-2 shadow-lg border transition-all">
      <div>
        {blog.thumbnail ? (
          <img
            src={blog.thumbnail}
            alt="Anteprima blog"
            className="rounded-lg lg:w-[250px] md:w-[300px] hover:scale-105 transition-all"
          />
        ) : null}
        <p className="text-sm  mt-2">
          By {blog.author?.username} | {blog.category} | {formattedDate}
        </p>
      </div>
      <div>
        <h2 className="text-lg font-semibold mt-3 lg:mt-1">{blog.title}</h2>
        <h3 className="text-gray-800 mt-1 ">{blog.subtitle}</h3>

        {/* Spiegazione:
            dangerouslySetInnerHTML: È il metodo ufficiale di React per renderizzare codice HTML da una stringa. 
            Usalo solo se ti fidi della fonte da cui proviene l'HTML (come in questo caso, visto che arriva dal tuo blog).
            className="line-clamp-3": Questa è una classe di Tailwind CSS che 
            limiterà il testo a 3 righe e aggiungerà ... alla fine. 
            Vediamo come attivarla. 
            npm install -D @tailwindcss/line-clamp
        */}
        <div
          className="mt-2 line-clamp-3" // Aggiungiamo una classe per il taglio CSS
          dangerouslySetInnerHTML={{ __html: blog.description || "" }}
        />
      </div>
    </div>
  );
};

export default BlogCardList;
