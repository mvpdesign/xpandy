import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { uglify } from "rollup-plugin-uglify";

import { main, version } from "./package.json";

const config = {
	plugins: [typescript(), commonjs(), uglify(), resolve()],
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
  },
  {
		input: "src/index.polyfills.ts",
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
			file: 'dist/xpandy-polyfill.js',
			format: "umd",
			name: "xpandy-polyfill",
			sourcemap: true
		},
		...config
	}
];
