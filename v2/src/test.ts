import { TGXLoader } from "./tgx";
import { getItems } from "./util/export";

// getItemHashes().then(itemHashes => {
//   dumpFile(itemHashesPath, itemHashes);
// });

const loader = new TGXLoader();
getItems([
  //   4124984448, // Hard Light
  1667080811 // Knucklehead Radar
]);
