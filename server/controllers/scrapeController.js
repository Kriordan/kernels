const fs = require("fs");
const { execSync } = require("child_process");

const scrapePage = require("../scraper");

function removeExistingFiles() {
  const files = ["./cssresponses", "main.scss", "main.css", "main.css.map"];

  fs.existsSync("./cssresponses")
    ? fs.rmdirSync("./cssresponses", { recursive: true })
    : "";
  files.forEach((file) => (fs.existsSync(file) ? fs.unlinkSync(file) : ""));
}

function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
}

function replaceAll(str, find, replace) {
  return str.replace(
    new RegExp(typeof find === "string" ? escapeRegExp(find) : find, "g"),
    replace
  );
}

function cleanCss(cssString) {
  let cleanCssString = cssString;
  const matches = [
    '@charset "UTF-8";',
    '@charset "utf-8";',
    /\d\d%:[\bbefore\b\bafter\b][^]+?{[^]+?}/,
  ];
  matches.forEach(
    (match) => (cleanCssString = replaceAll(cleanCssString, match, ""))
  );
  return cleanCssString;
}

exports.scrapeForRender = async (req, res) => {
  scrapePage(req.body.url).then((data) => {
    const { requests, cssResponses, htmlResponses, bodyContents } = data;

    removeExistingFiles();

    fs.mkdirSync("cssresponses");

    cssResponses.forEach((cssString, i) => {
      let cleanCssStr = cleanCss(cssString);
      fs.writeFileSync(`./cssresponses/0${i}.css`, cleanCssStr);
      execSync(`npx prettier --write ./cssresponses/0${i}.css`);
    });

    fs.writeFileSync("main.scss", ".simulator-container {");

    fs.readdirSync("./cssresponses")
      .sort((a, b) =>
        a.localeCompare(b, undefined, {
          numeric: true,
          ignorePunctuation: true,
        })
      )
      .forEach((file) => {
        console.log(file);
        fs.appendFileSync(
          "main.scss",
          fs.readFileSync(`./cssresponses/${file}`)
        );
      });

    fs.appendFileSync("main.scss", "}");

    execSync("sass main.scss main.css");

    const scopedCss = fs.readFileSync("main.css", { encoding: "utf-8" });

    removeExistingFiles();

    res.json({
      requests,
      cssResponse: scopedCss,
      htmlResponses,
      bodyContents,
    });
  });
};
