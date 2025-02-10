Array.prototype.move = function (from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};

const checkOrdering = (additions, linkMap) => {
  let orderingAllCorrect = true;
  for (const addition of additions) {
    const id = addition.entity.sys.id;
    const link = linkMap.find((i) => i.id === id);

    if (!link) continue;

    const index = additions.indexOf(addition);

    // Check if any of the items that reference this addition are before its creation
    for (const matched of link.matchedIds) {
      const matchedIndex = additions.indexOf(
        additions.find((a) => a.entity.sys.id === matched)
      );

      if (matchedIndex === -1) {
        continue;
      }

      const incorrectlyReferenced = index < matchedIndex;

      if (incorrectlyReferenced) {
        // need to move creation before referencing item
        additions.move(index, matchedIndex);
        orderingAllCorrect = false;
      }
    }
  }
  console.log(
    orderingAllCorrect ? "💚" : "❤",
    " Items ordered correctly: ",
    orderingAllCorrect
  );

  if (!orderingAllCorrect) {
    checkOrdering(additions, linkMap);
  }
};

const getCommandlineArguments = () => {
  const args = process.argv.slice(2);
  if (
    !args.length === 4 ||
    !args.includes("--input") ||
    !args.includes("--output")
  ) {
    throw new Error(
      "Usage: node content-reorder.js --input <input_file> --output <output_file>"
    );
  }

  const inputFile = args[args.indexOf("--input") + 1];
  const outputFile = args[args.indexOf("--output") + 1];

  return { inputFile, outputFile };
};

console.log("🏃‍♂️ Running Script to tidy content");

try {
  const { inputFile, outputFile } = getCommandlineArguments();

  var fs = require("fs");
  var contentScript = JSON.parse(fs.readFileSync(inputFile, "utf8"));

  var deletions = contentScript.items.filter(
    (change) => change.changeType === "delete"
  );
  var updates = contentScript.items.filter(
    (change) => change.changeType === "update"
  );
  var additions = contentScript.items.filter(
    (change) => change.changeType === "add"
  );

  console.log("✅ Script successfully loaded");

  console.log("➕ Processing added content");
  const linkMap = [];
  for (const addition of additions) {
    const id = addition.entity.sys.id;
    const stringifiedFields = JSON.stringify(addition.data.fields);
    const containsLink = stringifiedFields.indexOf('"id"') > 0;

    // If has a linked entry in the content, extracts the id of that item
    if (containsLink) {
      const idRegex = /(?<="id":")[^"]*/g;
      const regexOutput = [...stringifiedFields.matchAll(idRegex)];
      const matchedIds = regexOutput.flatMap((match) => match[0]);

      // Engineered content also matches with this so exclude them
      if (matchedIds.length > 0) {
        linkMap.push({ id, matchedIds });
      }
    }
  }

  console.log("📰 Sorting added content");
  checkOrdering(additions, linkMap);

  console.log("🖊 Rewriting file");
  contentScript.items = deletions.concat(additions).concat(updates);
  fs.writeFileSync(outputFile, JSON.stringify(contentScript, null, 2));

  console.log("✅ Successfully rewritten file");
} catch (e) {
  console.log("❌ Error processing script");
  console.log(e);
}
