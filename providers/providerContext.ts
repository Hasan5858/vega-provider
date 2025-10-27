import axios from "axios";
import { getBaseUrl } from "./getBaseUrl";
import { headers } from "./headers";
import * as cheerio from "cheerio";
import { hubcloudExtracter } from "./hubcloudExtractor";
import { gofileExtracter } from "./gofileExtracter";
import { superVideoExtractor } from "./superVideoExtractor";
import { gdFlixExtracter } from "./gdflixExtractor";
import { nexdriveExtractor } from "./nexdriveExtractor";
import { fastdlExtractor } from "./fastdlExtractor";
import { vcloudExtractor } from "./vcloudExtractor";
import { filepresExtractor } from "./filepresExtractor";
import { streamtapeExtractor } from "./streamtapeExtractor";
import { doodExtractor } from "./doodExtractor";
import { mixdropExtractor } from "./mixdropExtractor";
import { voeExtractor } from "./voeExtractor";
import { filelionsExtractor } from "./filelionsExtractor";
import { filemoonExtractor } from "./filemoonExtractor";
import { streamwishExtractor } from "./streamwishExtractor";
import { ProviderContext } from "./types";
import Aes from "react-native-aes-crypto";

/**
 * Context for provider functions.
 * This context is used to pass common dependencies to provider functions.
 */

const extractors = {
  hubcloudExtracter,
  gofileExtracter,
  superVideoExtractor,
  gdFlixExtracter,
  nexdriveExtractor,
  fastdlExtractor,
  vcloudExtractor,
  filepresExtractor,
  streamtapeExtractor,
  doodExtractor,
  mixdropExtractor,
  filelionsExtractor,
  filemoonExtractor,
  voeExtractor,
  streamwishExtractor,
};

export const providerContext: ProviderContext = {
  axios,
  getBaseUrl,
  commonHeaders: headers,
  Aes,
  cheerio,
  extractors,
};
