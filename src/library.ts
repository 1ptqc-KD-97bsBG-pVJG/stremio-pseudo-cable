import { ProgramRef } from "./types";

// Seed content library for MVP; in production this should come from curated lists.
export const PROGRAM_LIBRARY: Record<string, ProgramRef> = {
  tt0111161: { id: "tt0111161", type: "movie", title: "The Shawshank Redemption", genres: ["Drama"], runtimeMin: 142 },
  tt0068646: { id: "tt0068646", type: "movie", title: "The Godfather", genres: ["Crime", "Drama"], runtimeMin: 175 },
  tt0034583: { id: "tt0034583", type: "movie", title: "Casablanca", genres: ["Drama", "Romance"], runtimeMin: 102 },
  tt0109830: { id: "tt0109830", type: "movie", title: "Forrest Gump", genres: ["Drama", "Romance"], runtimeMin: 142 },
  tt0110912: { id: "tt0110912", type: "movie", title: "Pulp Fiction", genres: ["Crime", "Drama"], runtimeMin: 154 },

  tt0102926: { id: "tt0102926", type: "movie", title: "The Silence of the Lambs", genres: ["Crime", "Thriller"], runtimeMin: 118 },
  tt0071315: { id: "tt0071315", type: "movie", title: "Chinatown", genres: ["Mystery", "Drama"], runtimeMin: 130 },
  tt0119488: { id: "tt0119488", type: "movie", title: "L.A. Confidential", genres: ["Crime", "Mystery"], runtimeMin: 138 },
  tt0114369: { id: "tt0114369", type: "movie", title: "Se7en", genres: ["Crime", "Thriller"], runtimeMin: 127 },
  tt0053125: { id: "tt0053125", type: "movie", title: "North by Northwest", genres: ["Mystery", "Adventure"], runtimeMin: 136 },

  tt0099785: { id: "tt0099785", type: "movie", title: "Home Alone", genres: ["Comedy", "Family"], runtimeMin: 103 },
  tt0083866: { id: "tt0083866", type: "movie", title: "E.T. the Extra-Terrestrial", genres: ["Family", "Sci-Fi"], runtimeMin: 115 },
  tt0114709: { id: "tt0114709", type: "movie", title: "Toy Story", genres: ["Animation", "Family"], runtimeMin: 81 },
  tt0110357: { id: "tt0110357", type: "movie", title: "The Lion King", genres: ["Animation", "Family"], runtimeMin: 88 },
  tt0088763: { id: "tt0088763", type: "movie", title: "Back to the Future", genres: ["Adventure", "Comedy"], runtimeMin: 116 },

  tt0060196: { id: "tt0060196", type: "movie", title: "The Good, the Bad and the Ugly", genres: ["Western"], runtimeMin: 178 },
  tt0059800: { id: "tt0059800", type: "movie", title: "True Grit", genres: ["Western"], runtimeMin: 128 },
  tt0064115: { id: "tt0064115", type: "movie", title: "Butch Cassidy and the Sundance Kid", genres: ["Western", "Crime"], runtimeMin: 110 },
  tt0105695: { id: "tt0105695", type: "movie", title: "Unforgiven", genres: ["Western", "Drama"], runtimeMin: 130 },
  tt0044706: { id: "tt0044706", type: "movie", title: "High Noon", genres: ["Western", "Drama"], runtimeMin: 85 },

  tt0057115: { id: "tt0057115", type: "movie", title: "The Great Escape", genres: ["War", "Adventure"], runtimeMin: 172 },
  tt0050212: { id: "tt0050212", type: "movie", title: "The Bridge on the River Kwai", genres: ["War", "Drama"], runtimeMin: 161 },
  tt0066206: { id: "tt0066206", type: "movie", title: "Patton", genres: ["War", "Biography"], runtimeMin: 172 },
  tt0112384: { id: "tt0112384", type: "movie", title: "Apollo 13", genres: ["History", "Drama"], runtimeMin: 140 },
  tt0082096: { id: "tt0082096", type: "movie", title: "Das Boot", genres: ["War", "Drama"], runtimeMin: 149 },

  tt0107048: { id: "tt0107048", type: "movie", title: "Groundhog Day", genres: ["Comedy", "Fantasy"], runtimeMin: 101 },
  tt0053291: { id: "tt0053291", type: "movie", title: "Some Like It Hot", genres: ["Comedy", "Romance"], runtimeMin: 121 },
  tt0107614: { id: "tt0107614", type: "movie", title: "Mrs. Doubtfire", genres: ["Comedy", "Family"], runtimeMin: 125 },
  tt0104952: { id: "tt0104952", type: "movie", title: "My Cousin Vinny", genres: ["Comedy", "Crime"], runtimeMin: 120 },
  tt0087332: { id: "tt0087332", type: "movie", title: "Ghostbusters", genres: ["Comedy", "Fantasy"], runtimeMin: 105 },

  tt0095016: { id: "tt0095016", type: "movie", title: "Die Hard", genres: ["Action", "Thriller"], runtimeMin: 132 },
  tt0106977: { id: "tt0106977", type: "movie", title: "The Fugitive", genres: ["Action", "Thriller"], runtimeMin: 130 },
  tt0082971: { id: "tt0082971", type: "movie", title: "Raiders of the Lost Ark", genres: ["Action", "Adventure"], runtimeMin: 115 },
  tt0133093: { id: "tt0133093", type: "movie", title: "The Matrix", genres: ["Action", "Sci-Fi"], runtimeMin: 136 },
  tt0172495: { id: "tt0172495", type: "movie", title: "Gladiator", genres: ["Action", "Drama"], runtimeMin: 155 },

  tt0046250: { id: "tt0046250", type: "movie", title: "Roman Holiday", genres: ["Romance", "Comedy"], runtimeMin: 118 },
  tt0098635: { id: "tt0098635", type: "movie", title: "When Harry Met Sally...", genres: ["Romance", "Comedy"], runtimeMin: 96 },
  tt0100405: { id: "tt0100405", type: "movie", title: "Pretty Woman", genres: ["Romance", "Comedy"], runtimeMin: 119 },
  tt0108160: { id: "tt0108160", type: "movie", title: "Sleepless in Seattle", genres: ["Romance", "Drama"], runtimeMin: 105 },
  tt0059742: { id: "tt0059742", type: "movie", title: "The Sound of Music", genres: ["Musical", "Family"], runtimeMin: 172 },

  tt0076759: { id: "tt0076759", type: "movie", title: "Star Wars", genres: ["Sci-Fi", "Adventure"], runtimeMin: 121 },
  tt0075860: { id: "tt0075860", type: "movie", title: "Close Encounters of the Third Kind", genres: ["Sci-Fi", "Drama"], runtimeMin: 138 },
  tt0107290: { id: "tt0107290", type: "movie", title: "Jurassic Park", genres: ["Adventure", "Sci-Fi"], runtimeMin: 127 },
  tt1375666: { id: "tt1375666", type: "movie", title: "Inception", genres: ["Sci-Fi", "Action"], runtimeMin: 148 },
  tt3659388: { id: "tt3659388", type: "movie", title: "The Martian", genres: ["Sci-Fi", "Adventure"], runtimeMin: 144 },

  tt0045152: { id: "tt0045152", type: "movie", title: "Singin' in the Rain", genres: ["Musical", "Comedy"], runtimeMin: 103 },
  tt0086879: { id: "tt0086879", type: "movie", title: "Amadeus", genres: ["Music", "Drama"], runtimeMin: 160 },
  tt0076666: { id: "tt0076666", type: "movie", title: "Saturday Night Fever", genres: ["Drama", "Music"], runtimeMin: 119 },
  tt0047522: { id: "tt0047522", type: "movie", title: "A Star Is Born", genres: ["Drama", "Music"], runtimeMin: 176 },
  tt0061722: { id: "tt0061722", type: "movie", title: "The Graduate", genres: ["Drama", "Romance"], runtimeMin: 106 },

  tt6751668: { id: "tt6751668", type: "movie", title: "Parasite", genres: ["Drama", "Thriller"], runtimeMin: 132 }
};

export function getProgramById(id: string): ProgramRef | undefined {
  return PROGRAM_LIBRARY[id];
}
