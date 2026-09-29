/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setRspack(true);
// Cuadros sin pérdida (PNG): el texto y los bordes quedan nítidos.
Config.setVideoImageFormat("png");
// Compresión de alta calidad (número más bajo = más calidad).
Config.setCrf(10);
Config.setX264Preset("slow");
// Color estándar de video (bt709, yuv420p): el que esperan Instagram y los celulares.
Config.setColorSpace("bt709");
Config.setOverwriteOutput(true);
Config.overrideBundlerConfig(enableTailwind);
