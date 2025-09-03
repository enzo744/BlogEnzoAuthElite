import { useState, useEffect } from "react";

const SearchBar = ({ onSearch, onReset, resetSignal }) => {
  const [query, setQuery] = useState("");
  const [published, setPublished] = useState("");

  useEffect(() => {
    setQuery("");
    setPublished("");
  }, [resetSignal]);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query.trim(), published);
  };

  const handleReset = () => {
    setQuery("");
    setPublished("");
    onReset();
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 items-start md:items-center my-6 dark:bg-gray-800">
      <input
        type="text"
        placeholder="Cerca nei tuoi blog..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-4 py-2 border border-gray-400 rounded w-full md:w-1/2"
      />

      <select
        value={published}
        onChange={(e) => setPublished(e.target.value)}
        className="px-2 py-2 border border-gray-400 rounded w-full md:w-auto"
      >
        <option className="dark:bg-blue-600 bg-blue-500" value="">Tutti</option>
        <option className="dark:bg-blue-600" value="true">Pubblicati</option>
        <option className="dark:bg-blue-600" value="false">Non pubblicati</option>
      </select>

      <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Cerca
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Torna alla lista e resetta
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
