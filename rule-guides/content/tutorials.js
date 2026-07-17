(() => {
  "use strict";

  const syntax = (token, name, description, example = "") => ({
    token,
    name,
    description,
    example,
  });

  const lesson = (title, description, pattern = "", result = "") => ({
    title,
    description,
    pattern,
    result,
  });

  const example = (title, pattern, rows, note = "") => ({
    title,
    pattern,
    rows,
    note,
  });

  const tutorials = [
    {
      id: "wildcards",
      name: "Wildcards",
      summary:
        "Learn how to describe groups of similar names with a few simple wildcard symbols.",
      sections: [
        {
          title: "What is a wildcard?",
          paragraphs: [
            "A wildcard pattern is a short description of text that may vary. You write the parts that stay the same and use wildcard symbols for the parts that change.",
            "For example, IMG_* describes text that starts with IMG_ and then contains any amount of text. It can match IMG_001, IMG_summer, and even IMG_ with nothing after the underscore.",
          ],
          callout:
            "Think of a wildcard as a blank in a form: the surrounding text provides the structure, and the wildcard says what may fill the blank.",
        },
        {
          title: "The symbols",
          intro:
            "These symbols are enough for most everyday matching tasks. Everything else is treated as literal text.",
          syntax: [
            syntax(
              "*",
              "Any amount of text",
              "Matches zero or more characters.",
              "IMG_* matches IMG_, IMG_1, and IMG_summer"
            ),
            syntax(
              "?",
              "Exactly one character",
              "Matches one character, but not zero or two characters.",
              "page_?.png matches page_1.png, not page_10.png"
            ),
            syntax(
              "[abc]",
              "One character from a set",
              "Matches exactly one of the characters between the brackets.",
              "file[123] matches file1, file2, or file3"
            ),
            syntax(
              "[a-z]",
              "One character from a range",
              "Matches one character inside the stated range.",
              "item[0-9] matches item0 through item9"
            ),
            syntax(
              "\\*",
              "A literal wildcard symbol",
              "A backslash makes the next wildcard character ordinary text.",
              "price\\* matches the actual text price*"
            ),
          ],
        },
        {
          title: "Build a pattern step by step",
          intro:
            "Start with a real name, keep the stable parts, and replace only the changing parts.",
          lessons: [
            lesson(
              "Find the stable structure",
              "In invoice_2026-07.pdf, invoice_ and .pdf stay the same while the date changes.",
              "invoice_2026-07.pdf"
            ),
            lesson(
              "Replace an unrestricted part with *",
              "Use * when the changing part may have different lengths.",
              "invoice_*.pdf",
              "Matches invoice_1.pdf and invoice_2026-07.pdf"
            ),
            lesson(
              "Use ? when the length is fixed",
              "Two question marks require exactly two characters.",
              "page_??.png",
              "Matches page_01.png, but not page_1.png"
            ),
            lesson(
              "Use ranges to limit accepted characters",
              "Two digit ranges require exactly two numeric characters.",
              "scan_[0-9][0-9].jpg",
              "Matches scan_04.jpg, but not scan_AB.jpg"
            ),
          ],
        },
        {
          title: "Worked examples",
          examples: [
            example("Any text after a prefix", "IMG_*", [
              { label: "Matches", value: "IMG_001, IMG_summer, IMG_" },
              { label: "Does not match", value: "PHOTO_001" },
            ]),
            example("Exactly one changing character", "photo_?.jpg", [
              { label: "Matches", value: "photo_1.jpg, photo_a.jpg" },
              { label: "Does not match", value: "photo_12.jpg, photo_.jpg" },
            ]),
            example("Choose from a small set", "file[123].txt", [
              { label: "Matches", value: "file1.txt, file2.txt, file3.txt" },
              { label: "Does not match", value: "file4.txt, file12.txt" },
            ]),
            example("Accept either uppercase or lowercase", "*.[Jj][Pp][Gg]", [
              { label: "Matches", value: "image.jpg, photo.JPG, scan.Jpg" },
              { label: "Does not match", value: "image.png" },
            ]),
          ],
        },
        {
          title: "Common mistakes",
          bullets: [
            "Using * when ? is more precise. * may match far more text because it accepts any length, including zero.",
            "Expecting ? to match an empty position. It always requires exactly one character.",
            "Expecting [123] to match 123. A bracket expression matches only one character: 1, 2, or 3.",
            "Forgetting that punctuation is literal. A dot matches a dot; an underscore matches an underscore.",
            "Using an unescaped *, ?, or valid bracket expression when you mean literal text. Prefix the wildcard token with a backslash; a ] outside a valid bracket expression is already literal.",
            "Testing only one name. Check a pattern against names that should match and names that should not match.",
          ],
        },
      ],
    },
    {
      id: "regular-expressions",
      name: "Regular Expressions",
      summary:
        "Learn to match, capture, and rearrange structured text with regular expressions.",
      sections: [
        {
          title: "What is a regular expression?",
          paragraphs: [
            "A regular expression, often shortened to regex, is a precise language for describing text. Literal characters describe what must stay the same, while special tokens describe what may vary.",
            "Regex is most useful when a pattern has structure: dates, sequence numbers, repeated separators, optional labels, or several acceptable formats.",
          ],
          callout:
            "Do not begin by memorizing every symbol. Start with literal text, replace one variable part at a time, and test after each change.",
        },
        {
          title: "Core syntax",
          intro:
            "Read a regex from left to right. Each token describes what may appear next in the text.",
          syntax: [
            syntax(".", "Any character", "Matches one character other than a line break.", "a.c matches abc and a-c"),
            syntax("\\d", "A digit", "Matches one numeric character.", "\\d+ matches 7 and 2026"),
            syntax("\\w", "A word character", "Matches a letter, digit, or underscore.", "\\w+ matches file_01"),
            syntax("\\s", "Whitespace", "Matches a space, tab, or other whitespace character.", "\\s+ matches one or more spaces"),
            syntax("[abc]", "Character set", "Matches one listed character.", "gr[ae]y matches gray and grey"),
            syntax("[^abc]", "Negated set", "Matches one character not listed in the set.", "[^0-9] matches a non-digit"),
            syntax("[a-z]", "Character range", "Matches one character inside the range.", "[0-9] matches one digit"),
            syntax("*", "Zero or more", "Repeats the previous token zero or more times.", "ab* matches a, ab, and abbb"),
            syntax("+", "One or more", "Repeats the previous token at least once.", "\\d+ matches a run of digits"),
            syntax("?", "Optional", "Makes the previous token appear zero or one time.", "colou?r matches color and colour"),
            syntax("{n,m}", "A repeat count", "Repeats the previous token a controlled number of times.", "\\d{2,4} matches 2 to 4 digits"),
            syntax("^", "Start anchor", "Requires the match to begin at the start of the text.", "^IMG_ matches only an opening IMG_"),
            syntax("$", "End anchor", "Requires the match to end at the end of the text.", "\\d+$ matches digits at the end"),
            syntax("(...)", "Capture group", "Groups tokens and remembers the matched text.", "(\\d{4}) captures a four-digit year"),
            syntax("(?:...)", "Non-capturing group", "Groups tokens without creating a numbered capture.", "(?:jpg|png) groups two choices"),
            syntax("|", "Alternative", "Matches the expression on either side.", "draft|final matches either word"),
            syntax("\\.", "Escaped character", "A backslash removes the special meaning of the next symbol.", "\\. matches an actual dot"),
          ],
        },
        {
          title: "Build a regex step by step",
          lessons: [
            lesson(
              "Begin with literal text",
              "Ordinary letters and digits match themselves. Some punctuation has a special meaning and must be escaped.",
              "report",
              "Matches the literal text report"
            ),
            lesson(
              "Describe the variable part",
              "Replace a run of changing digits with \\d+.",
              "report_\\d+",
              "Matches report_7 and report_2026"
            ),
            lesson(
              "Add anchors when the whole structure matters",
              "The anchors prevent extra text before or after the expected name.",
              "^report_\\d+$",
              "Matches report_2026, but not old_report_2026"
            ),
            lesson(
              "Capture the part you want to keep",
              "Parentheses store the digit run as capture group 1.",
              "^report_(\\d+)$",
              "$1 contains the matched number"
            ),
          ],
        },
        {
          title: "Capture and reuse text",
          paragraphs: [
            "Parentheses create numbered capture groups from left to right. $0 refers to the complete match, $1 to the first group, $2 to the second group, and so on.",
            "Use a non-capturing group, written (?:...), when you need grouping but do not need to reuse its text. This keeps later group numbers easier to understand.",
          ],
          examples: [
            example("Reorder a date", "^(\\d{4})-(\\d{2})-(\\d{2})$", [
              { label: "Input", value: "2026-07-17" },
              { label: "Captures", value: "$1 = 2026, $2 = 07, $3 = 17" },
              { label: "Replacement", value: "$3.$2.$1" },
              { label: "Result", value: "17.07.2026" },
            ]),
            example("Keep an identifier while changing its prefix", "^IMG_(\\d+)$", [
              { label: "Input", value: "IMG_0042" },
              { label: "Capture", value: "$1 = 0042" },
              { label: "Replacement", value: "Photo-$1" },
              { label: "Result", value: "Photo-0042" },
            ]),
          ],
        },
        {
          title: "More worked examples",
          examples: [
            example("Find every run of digits", "\\d+", [
              { label: "Input", value: "part12-section3" },
              { label: "Matches", value: "12 and 3" },
            ]),
            example("Match one of several prefixes", "^(draft|final)_", [
              { label: "Matches", value: "draft_report, final_report" },
              { label: "Does not match", value: "archived_report" },
            ]),
            example("Normalize repeated whitespace", "\\s+", [
              { label: "Input", value: "Project   Notes" },
              { label: "Replacement", value: "-" },
              { label: "Result", value: "Project-Notes" },
            ]),
            example("Match a final numeric suffix", "-(\\d+)$", [
              { label: "Matches", value: "-42 at the end of item-42" },
              { label: "Capture", value: "$1 = 42" },
              { label: "Does not match", value: "item-42-copy" },
            ]),
          ],
        },
        {
          title: "A reliable beginner workflow",
          lessons: [
            lesson("Use representative samples", "Collect several names that should match and several that should remain untouched."),
            lesson("Start literally", "Write the fixed text first. Confirm that the simplest part matches before adding special tokens."),
            lesson("Generalize one part", "Replace only one changing segment with a token such as \\d+, [a-z]+, or .+."),
            lesson("Add boundaries", "Use ^ and $ when the expression should describe the complete text, not a substring."),
            lesson("Capture deliberately", "Add parentheses only around text you plan to inspect or reuse, then verify the group numbers."),
          ],
        },
        {
          title: "Common mistakes",
          bullets: [
            "Writing . when you mean a literal dot. Use \\. to match the punctuation character.",
            "Using .* too early. It is broad and greedy, so it may consume more text than expected. Prefer a more specific token when possible.",
            "Forgetting anchors. Without ^ or $, a regex may match a valid fragment inside a longer unwanted name.",
            "Confusing [abc] with (abc). Brackets choose one character; parentheses group an entire expression.",
            "Losing track of capture numbers. Every capturing pair of parentheses counts from left to right; use (?:...) for groups you do not need to capture.",
            "Typing doubled backslashes in a text field. Enter \\d directly; forms such as \\\\d are usually required only inside programming-language strings.",
            "Testing only the successful case. Always include short, long, missing, and unexpected variants before applying a regex broadly.",
          ],
        },
      ],
    },
  ];

  globalThis.LIGHTNING_RENAMER_TUTORIALS = { tutorials };
})();
