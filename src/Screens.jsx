import { useState } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Tile } from "./Tile";

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];

export function StartScreen({ start }) {
  return (
    <div className="w-full relative h-screen">
      <div className="w-[80%] md:w-[60%] lg:w-[40%] bg-[#fdf3f8] rounded-lg text-[#ec4899] text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 py-20">
        <h1 className="text-3xl md:text-5xl lg:text-8xl font-bold">Memory</h1>
        <p className="my-10 font-medium text-base sm:text-lg md:text-xl lg:text-3xl ">
          Flip over tiles looking for pairs
        </p>
        <button
          onClick={start}
          className=" font-medium text-base sm:text-lg md:text-xl lg:text-3xl rounded-full bg-gradient-to-b from-[#f16baf] to-[#dc2c7a] text-white w-[30%] md:w-[20%] p-2 shadow-xl shadow-[#ccccc] hover:from-[#dc2c7a] hover:to-[#f16baf] transition ease-linear duration-100 delay-100"
        >
          Play
        </button>
      </div>
    </div>
  );
}

export function PlayScreen({ end }) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti({
          ticks: 100,
        });
        newState = "matched";
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setTimeout(end, 0);
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };

  return (
    <>
      <div className="scale-75 md:scale-90 lg:scale-100 max-w-full flex flex-col gap-10 items-center justify-center h-screen ">
        <h1 className="text-base sm:text-lg md:texxt-xl lg:text-3xl font-medium text-[#6466f1]">
          {" "}
          Tries
          <span className="m1-2 bg-[#a5b4fc] px-2 rounded-lg py-1 text-[#6466f1]">
            {tryCount}
          </span>
        </h1>

        <div className="bg-[#eef2ff] p-4 rounded-lg grid grid-cols-4 gap-4 place-items-center m-0">
          {getTiles(16).map((tile, i) => (
            <Tile key={i} flip={() => flip(i)} {...tile} />
          ))}
        </div>
      </div>
    </>
  );
}
