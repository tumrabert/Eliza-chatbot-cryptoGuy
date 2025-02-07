import type { Plugin } from "@elizaos/core";
import { continueAction } from "./actions/continue.ts";
import { followRoomAction } from "./actions/followRoom.ts";
import { ignoreAction } from "./actions/ignore.ts";
import { muteRoomAction } from "./actions/muteRoom.ts";
import { noneAction } from "./actions/none.ts";
import { unfollowRoomAction } from "./actions/unfollowRoom.ts";
import { unmuteRoomAction } from "./actions/unmuteRoom.ts";
import { factEvaluator } from "./evaluators/fact.ts";
import { goalEvaluator } from "./evaluators/goal.ts";
import { boredomProvider } from "./providers/boredom.ts";
import { factsProvider } from "./providers/facts.ts";
import { timeProvider } from "./providers/time.ts";

export * as actions from "./actions/index.ts";
export * as evaluators from "./evaluators/index.ts";
export * as providers from "./providers/index.ts";

import { getLastedNews } from "./actions/getLastedNews";


export const cointelegraphPlugin: Plugin = {
    name: "cointelegraph",
    description: "Cointelegraph news plugin for Eliza",
    actions:[getLastedNews],
    evaluators: [],
    providers: [],
    
};

export default cointelegraphPlugin;


// export const bootstrapPlugin: Plugin = {
//     name: "bootstrap",
//     description: "Agent bootstrap with basic actions and evaluators",
//     actions: [
//         continueAction,
//         followRoomAction,
//         unfollowRoomAction,
//         ignoreAction,
//         noneAction,
//         muteRoomAction,
//         unmuteRoomAction,
//     ],
//     evaluators: [factEvaluator, goalEvaluator],
//     providers: [boredomProvider, timeProvider, factsProvider],
// };
// export default bootstrapPlugin;