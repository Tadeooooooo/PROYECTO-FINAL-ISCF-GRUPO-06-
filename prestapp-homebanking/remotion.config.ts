import { Config } from "@remotion/cli/config";

Config.setRspack(true);
// Cuadros sin pérdida (PNG) para que texto y bordes queden nítidos.
Config.setVideoImageFormat("png");
// Color estándar de video (bt709).
Config.setColorSpace("bt709");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);
