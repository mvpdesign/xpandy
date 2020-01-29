import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";

import { main, version } from "./package.json";

const config = {
	plugins: [typescript(), commonjs(), resolve()],
	watch: {
		include: "src/**"
	}
};

export default [
	{
		input: "src/index.ts",
		output: {
			banner: `/*
XXXXXXXXXXXXXXXXXXXX$$$$$$$$$$$$$$$$$$$$
-#XXXXXXXXXXXXXXXXX///$$$$$$$$$$$$$$$$$-
---XXXXXXXXXXXXXX$/////$$$$$$$$$$$$$$#--
----$XXXXXXXXXXX/////////$$$$$$$$$$$----
------XXXXXXXXX///////////$$$$$$$$%-----
-------%XXXXX$/////////////$$$$$$-------
---------XXX/////////////////$$&--------
----------#&&&&&&&&&&&&&&&&&&&----------
------------&&&&&&&&&&&&&&&&#-----------
-------------#&&&&&&&&&&&&&&------------
---------------&&&&&&&&&&#--------------
----------------&&&&&&&&%---------------
-----------------&&&&&&-----------------
-------------------#&#------------------
Xpandy ${version}
From MVP Marketing + Design
*/`,
			file: main,
			format: "umd",
			name: "xpandy",
			sourcemap: true
		},
		...config
	}
];
