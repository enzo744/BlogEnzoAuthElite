import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SearchBar = ({ onSearch, onReset, resetSignal }) => {
  const [query, setQuery] = useState("");
  // Lo stato iniziale "" è corretto, mostrerà il placeholder
  const [published, setPublished] = useState("");

  useEffect(() => {
    setQuery("");
    setPublished("");
  }, [resetSignal]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Convertiamo "all" in "" prima di inviare la ricerca
    const searchPublishedValue = published === "all" ? "" : published;
    onSearch(query.trim(), searchPublishedValue);
  };

  const handleReset = () => {
    setQuery("");
    // impostiamo a "" per far riapparire il placeholder
    setPublished(""); 
    onReset();
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 my-6 items-center no-print">
      <Input
        type="text"
        placeholder="Cerca nei tuoi blog..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-5 lg:w-auto md:flex-grow border-gray-500"
      />

      <Select value={published} onValueChange={setPublished}>
        <SelectTrigger className="w-full md:w-[180px] border-gray-500">
          <SelectValue placeholder="Stato" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tutti</SelectItem>
          <SelectItem value="true">Pubblicati</SelectItem>
          <SelectItem value="false">Non pubblicati</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex w-wrap gap-2 md:w-auto">
        <Button type="submit" className="w-1/2 ">
          Cerca
        </Button>
        <Button
          type="button"
          onClick={handleReset}
          variant="outline"
          className="w-1/2 "
        >
          Reset
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;

