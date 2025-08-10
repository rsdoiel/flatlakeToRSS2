/**
 * mod.ts implements the cli interface for flatlakeToRSS2.ts
 *  
 *  Copyright (C) 2025  R. S. Doiel
 * 
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
// Import the necessary modules
import { parse as parseArgs } from "@std/flags";
import { parse } from "@std/yaml";
import { licenseText, releaseDate, releaseHash, version } from "./version.ts";
import { fmtHelp, helpText } from "./helptext.ts";
import { convertToRSS, generateRSS, RSSFeed } from "./src/flatlakeToRSS2.ts";

// Main function to handle command line arguments
async function main(): Promise<number> {
  const appName = "flatlakeToRSS2";
  const args = parseArgs(Deno.args, {
    boolean: [
      "help",
      "version",
      "license",
    ],
    string: ["prefix", "apply"],
    alias: {
      h: "help",
      v: "version",
      l: "license",
    },
  });

  if (args.help) {
    console.log(
      fmtHelp(helpText, appName, version, releaseDate, releaseHash),
    );
    return 0;
  }

  if (args.version) {
    console.log(`${appName} ${version} ${releaseDate} ${releaseHash}`);
    return 0;
  }

  if (args.license) {
    console.log(licenseText);
    return 0;
  }

  if (Deno.args.length < 2) {
    console.error(
      `USAGE: ${appName} CHANNEL_INFO_FILE JSON_INPUT_FILE
  Arguments:
    CHANNEL_INFO_FILE  Path to the YAML file containing channel information
    JSON_INPUT_FILE    Path to the JSON file containing input data
  
  See ${appName} --help for details
`,
    );
    return 1;
  }

  const [channelInfoFilename, jsonFilename] = Deno.args;

  try {
    // Read and parse the channel info YAML file
    const channelInfoYaml = await Deno.readTextFile(channelInfoFilename);
    const channelInfo = parse(channelInfoYaml) as Partial<RSSFeed>;

    // Read and parse the input JSON file
    const jsonData = JSON.parse(await Deno.readTextFile(jsonFilename));

    // Convert JSON data to RSS feed with YAML configuration
    const rssFeed = convertToRSS(jsonData.values, channelInfo);

    // Generate the RSS XML
    const rssXML = generateRSS(rssFeed);
    console.log(rssXML);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }
    return 1;
  }
  return 0;
}

// Run the main function
if (import.meta.main) {
  Deno.exit(await main());
}
