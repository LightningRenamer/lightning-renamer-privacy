(() => {
  "use strict";

  const option = (name, description) => ({ name, description });
  const change = (before, after, note = "") => ({ before, after, note });
  const example = (title, settings, transformations, note = "", code = "") => ({
    title,
    settings,
    transformations,
    note,
    code,
  });

  const rules = [
    {
      id: "replace",
      name: "Replace",
      summary:
        "Find text in a file name and replace it with different text, metadata, or captured wildcard content.",
      whenToUse: [
        "Change a repeated word, prefix, date separator, or naming code across many files.",
        "Convert a family of similarly structured names while preserving the varying part of each name.",
      ],
      quickStart: [
        "Enter the existing text in Find.",
        "Enter the new text in Replace.",
        "Leave Occurrences set to All and check the preview before adding the rule.",
      ],
      optionGroups: [
        {
          title: "Find and replace",
          options: [
            option(
              "Find",
              "The literal text to locate. Use the separator button to add more search terms. Multiple terms are processed from left to right."
            ),
            option(
              "Replace",
              "The text that takes the place of each matching Find term. Multiple replacements pair with the Find terms in order. If replacements run short, the last replacement is reused; an empty replacement deletes the match."
            ),
            option(
              "Select Metadata Tag",
              "Inserts a metadata token into Replace. The token is resolved separately for each file, so one rule can insert each file's own artist, date, camera model, or other available value."
            ),
          ],
        },
        {
          title: "Occurrences",
          options: [
            option("All", "Replaces every match in the editable part of the file name."),
            option("First", "Replaces only the first match."),
            option("Last", "Replaces only the last match."),
          ],
        },
        {
          title: "Matching options",
          options: [
            option(
              "Case Sensitive",
              "Treats uppercase and lowercase as different characters. With it off, IMG, Img, and img all match the same Find text."
            ),
            option(
              "Whole Word Only",
              "Matches a literal term only at word boundaries. For example, cat matches cat but not catalog. This option does not apply in wildcard mode."
            ),
            option(
              "Skip Extension",
              "Protects the final extension segment. Replacing txt in report.txt will not change the extension while this option is on."
            ),
            option(
              "Interpret '?', '*', '[', ']' as wildcards and '$n' as backreferences",
              "Uses ? for one character, * for any number of characters, and brackets for a character set or range. Wildcards create capture groups that can be reused as $1, $2, and so on in Replace. Wildcard mode replaces all matches and does not use First, Last, or Whole Word Only."
            ),
          ],
        },
      ],
      examples: [
        example(
          "Replace a project status",
          ["Find: draft", "Replace: final", "Occurrences: All", "Skip Extension: On"],
          [change("draft-report.pdf", "final-report.pdf"), change("draft-notes.pdf", "final-notes.pdf")]
        ),
        example(
          "Replace a whole word only",
          ["Find: cat", "Replace: pet", "Whole Word Only: On", "Skip Extension: On"],
          [change("cat-catalog.txt", "pet-catalog.txt", "catalog is left unchanged")]
        ),
        example(
          "Keep the variable part with a wildcard",
          [
            "Find: IMG_*",
            "Replace: PHOTO_$1",
            "Wildcard interpretation: On",
            "Skip Extension: On",
          ],
          [change("IMG_00123_edit.jpg", "PHOTO_00123_edit.jpg")],
          "$1 contains the text matched by *."
        ),
      ],
      tips: [
        "Use the separator control when you want one rule to perform several replacements in sequence.",
        "Only the final extension segment is protected. In archive.tar.gz, Skip Extension protects .gz; .tar remains part of the editable name.",
        "A backslash makes the next wildcard character literal, so \\* searches for an actual asterisk.",
      ],
    },
    {
      id: "insert",
      name: "Insert",
      summary:
        "Insert fixed text or file-specific metadata at the beginning, end, a numbered position, or around matching text.",
      whenToUse: [
        "Add a common prefix or suffix without changing the rest of each file name.",
        "Insert a separator, label, or metadata value at a predictable location.",
      ],
      quickStart: [
        "Enter the value in Insert Text.",
        "Choose Prefix or Suffix under Insert Position.",
        "Keep Skip Extension on when a suffix should appear before the extension.",
      ],
      optionGroups: [
        {
          title: "Content",
          options: [
            option("Insert Text", "The text added to each file name."),
            option(
              "Select Metadata Tag",
              "Inserts a metadata token into Insert Text. Its value is looked up independently for every file."
            ),
          ],
        },
        {
          title: "Insert Position",
          options: [
            option("Prefix", "Adds Insert Text at the beginning of the editable name."),
            option("Suffix", "Adds Insert Text at the end of the editable name."),
            option(
              "Position",
              "Inserts before the character at the selected one-based position. Position 1 means the beginning. A position beyond the name is clamped to the end."
            ),
            option(
              "Right to Left",
              "Counts Position from the end instead of the beginning. Position 1 inserts at the end of the editable name."
            ),
            option(
              "After Text",
              "Inserts after every case-insensitive literal match of the supplied text. The matched text itself is preserved."
            ),
            option(
              "Before Text",
              "Inserts before every case-insensitive literal match of the supplied text. The matched text itself is preserved."
            ),
            option(
              "Replace Current Name",
              "Replaces the entire editable name with Insert Text. With Skip Extension on, the original extension is kept."
            ),
          ],
        },
        {
          title: "Options",
          options: [
            option(
              "Skip Extension",
              "Protects the final extension segment and positions a suffix immediately before it."
            ),
          ],
        },
      ],
      examples: [
        example(
          "Add a prefix",
          ["Insert Text: 2026-", "Insert Position: Prefix", "Skip Extension: On"],
          [change("report.pdf", "2026-report.pdf")]
        ),
        example(
          "Add a suffix before the extension",
          ["Insert Text: -final", "Insert Position: Suffix", "Skip Extension: On"],
          [change("report.pdf", "report-final.pdf")]
        ),
        example(
          "Insert after every matching token",
          ["Insert Text: -", "Insert Position: After Text", "After this text: KR", "Skip Extension: On"],
          [change("KrKRkRkr.txt", "Kr-KR-kR-kr-.txt")],
          "After Text matching is case-insensitive and affects every occurrence."
        ),
        example(
          "Replace the name but keep the extension",
          ["Insert Text: cover", "Insert Position: Replace Current Name", "Skip Extension: On"],
          [change("IMG_4832.jpg", "cover.jpg")]
        ),
      ],
      tips: [
        "Position counts user-visible characters, including emoji, rather than UTF-16 code units.",
        "After Text and Before Text do nothing when their search text is empty or not found.",
        "Turn off Skip Extension only when the extension itself should participate in the insertion or replacement.",
      ],
    },
    {
      id: "remove",
      name: "Remove",
      summary:
        "Remove matching words, codes, or wildcard-shaped text while leaving the rest of the file name in place.",
      whenToUse: [
        "Delete an unwanted tag such as copy, draft, or a repeated camera prefix.",
        "Remove text that varies but follows a consistent wildcard pattern.",
      ],
      quickStart: [
        "Enter the unwanted value in Remove Text.",
        "Choose All, First, or Last under Occurrences.",
        "Keep Skip Extension on and confirm the result in the preview.",
      ],
      optionGroups: [
        {
          title: "Remove Text",
          options: [
            option(
              "Remove Text",
              "The literal text to delete. Use the separator button to add multiple independent patterns; each pattern is applied in order."
            ),
          ],
        },
        {
          title: "Occurrences",
          options: [
            option("All", "Removes every match."),
            option("First", "Removes only the first match."),
            option("Last", "Removes only the last match."),
          ],
        },
        {
          title: "Matching options",
          options: [
            option("Case Sensitive", "Requires the letter case in the file name to match Remove Text exactly."),
            option(
              "Whole Word Only",
              "Removes a literal term only at word boundaries, so word is removed from word-list but not from password."
            ),
            option("Skip Extension", "Protects the final extension segment from removal."),
            option(
              "Interpret '?', '*', '[', ']' as wildcards",
              "Uses ? for one character, * for any number of characters, and brackets for a character set or range. Wildcard mode removes all matches and does not use First, Last, or Whole Word Only."
            ),
          ],
        },
      ],
      examples: [
        example(
          "Remove every status tag",
          ["Remove Text: draft", "Occurrences: All", "Case Sensitive: Off", "Skip Extension: On"],
          [change("DRAFT-report-draft.pdf", "-report-.pdf")]
        ),
        example(
          "Remove only the last occurrence",
          ["Remove Text: -copy", "Occurrences: Last", "Skip Extension: On"],
          [change("photo-copy-copy.jpg", "photo-copy.jpg")]
        ),
        example(
          "Remove whole words without touching longer words",
          ["Remove Text: word", "Whole Word Only: On", "Skip Extension: On"],
          [change("a-word-password.txt", "a--password.txt")]
        ),
        example(
          "Remove a wildcard-shaped prefix",
          ["Remove Text: IMG_*_", "Wildcard interpretation: On", "Skip Extension: On"],
          [change("IMG_2026_Trip.jpg", "Trip.jpg")]
        ),
      ],
      tips: [
        "Use Replace with an empty Replace value when you need deletion plus metadata or wildcard backreferences.",
        "Wildcard * is greedy, so a broad pattern can remove more than expected. Check the preview with representative names.",
        "If Remove Text is empty, the rule leaves the name unchanged.",
      ],
    },
    {
      id: "serialize",
      name: "Serialize",
      summary:
        "Assign an ordered decimal, alphabetic, Roman, Chinese, or custom sequence to files in their current list order.",
      whenToUse: [
        "Number episodes, scans, photos, or exported pages in a predictable sequence.",
        "Repeat the same index for groups of files or restart numbering when a grouping condition changes.",
      ],
      quickStart: [
        "Set Index starts to 1, Repeat to 1, and Step to 1.",
        "Choose Prefix or Suffix under Insert Position.",
        "Select Decimal digits and enable zero padding when fixed-width numbers are required.",
      ],
      optionGroups: [
        {
          title: "Sequence",
          options: [
            option("Index starts", "The first sequence value assigned at the start of each batch or after a reset."),
            option("Repeat", "How many consecutive files receive the same sequence value before Step is applied."),
            option("Step", "The positive amount added to the current value after the repeat count is reached."),
            option(
              "Reset every",
              "Restarts from Index starts after the specified number of processed files. The interval counts files, not distinct sequence values."
            ),
            option(
              "Reset if folder changes",
              "Restarts when the next file comes from a different source folder. Keep related folders adjacent in the file list."
            ),
            option(
              "Reset if file name changes",
              "Restarts whenever the editable name differs from the previous file. Use this only when identical adjacent names define a group."
            ),
          ],
        },
        {
          title: "Insert Position",
          options: [
            option("Prefix", "Adds the sequence at the beginning."),
            option("Suffix", "Adds the sequence at the end of the editable name."),
            option(
              "Position",
              "Inserts before the character at a one-based position. Values beyond the name are clamped to the end."
            ),
            option(
              "Replace Current Name",
              "Replaces the editable name with the sequence. Skip Extension can preserve the original extension."
            ),
          ],
        },
        {
          title: "Numbering System",
          options: [
            option("Decimal digits", "Uses 1, 2, 3, and so on. Decimal values can be padded with leading zeros."),
            option("English letters", "Uses a, b, c through z, then ba, bb, and so on."),
            option("Roman numerals", "Uses uppercase Roman numerals from 1 through 3,999. Larger values fall back to decimal digits."),
            option("Chinese numerals", "Uses Chinese numerals up to 99,999; larger values fall back to decimal digits."),
            option(
              "Custom Characters",
              "Treats the entered characters as a custom counting alphabet. For ABC, the sequence starts A, B, C, BA. An empty custom set leaves names unchanged."
            ),
            option(
              "Pad sequence to length",
              "Pads supported sequence types to a minimum width. Decimal uses zero; alphabetic and custom sequences use their first character."
            ),
            option("Skip Extension", "Keeps the final extension segment outside the numbering operation."),
          ],
        },
      ],
      examples: [
        example(
          "Add three-digit episode numbers",
          [
            "Index starts: 1",
            "Repeat: 1",
            "Step: 1",
            "Insert Position: Prefix",
            "Numbering System: Decimal digits",
            "Pad sequence to length: 3",
            "Skip Extension: On",
          ],
          [change("intro.mp4", "001intro.mp4"), change("interview.mp4", "002interview.mp4")]
        ),
        example(
          "Repeat each number twice",
          ["Index starts: 1", "Repeat: 2", "Step: 1", "Insert Position: Suffix"],
          [
            change("front.jpg", "front1.jpg"),
            change("back.jpg", "back1.jpg"),
            change("detail.jpg", "detail2.jpg"),
            change("label.jpg", "label2.jpg"),
          ]
        ),
        example(
          "Use letters instead of digits",
          ["Index starts: 1", "Numbering System: English letters", "Insert Position: Prefix"],
          [change("chapter.txt", "achapter.txt"), change("appendix.txt", "bappendix.txt")]
        ),
        example(
          "Replace the original name",
          ["Numbering System: Roman numerals", "Insert Position: Replace Current Name", "Skip Extension: On"],
          [change("scan-front.pdf", "I.pdf"), change("scan-back.pdf", "II.pdf")]
        ),
      ],
      tips: [
        "Sequence assignment follows the current file-list order. Sort the list before applying the rule when order matters.",
        "The sequence state restarts for each new batch preview or rename operation.",
        "If Reset if file name changes is on and every adjacent name is different, every file will restart at Index starts.",
      ],
    },
    {
      id: "clean",
      name: "Clean",
      summary:
        "Apply several common cleanup operations in one pass to normalize separators, spaces, brackets, Unicode forms, and web-escaped text.",
      whenToUse: [
        "Turn downloaded or generated names into readable words with consistent spacing.",
        "Remove bracketed release tags, emoji, accents, or encoded web characters before applying other rules.",
      ],
      quickStart: [
        "Select the unwanted bracket types and separators.",
        "Enable Single space only to collapse the spaces created by cleanup.",
        "Keep Skip extension on so dots and formatting inside the extension remain untouched.",
      ],
      optionGroups: [
        {
          title: "Strip out bracketed content",
          options: [
            option("(...)", "Removes parenthesized content such as (copy)."),
            option("[...]", "Removes square-bracketed content such as [1080p]."),
            option("{...}", "Removes curly-braced content such as {old}."),
          ],
        },
        {
          title: "Replace these characters with spaces",
          options: [
            option(". (Dot)", "Replaces dots in the editable name with spaces."),
            option(", (Comma)", "Replaces commas with spaces."),
            option("_", "Replaces underscores with spaces."),
            option("+", "Replaces plus signs with spaces."),
            option("-", "Replaces hyphens with spaces."),
            option(
              "Skip number sequences, for example version 1.93.2",
              "Protects separators inside multi-part numeric sequences such as 1.93.2 or 2026-07-17 while replacing the same characters elsewhere."
            ),
          ],
        },
        {
          title: "Other cleanup",
          options: [
            option("Remove emojis", "Removes complete Unicode emoji sequences, including flags, keycaps, modifiers, and joined emoji."),
            option(
              "Convert fullwidth characters to halfwidth",
              "Converts characters with clear halfwidth equivalents, such as ＡＢＣ１２３（） to ABC123(). CJK text remains unchanged."
            ),
            option(
              "Add space before uppercase letters",
              "Inserts a space before every ASCII uppercase letter, then trims standard spaces from the ends. Acronyms are split letter by letter."
            ),
            option(
              "Replace whitespace characters with a standard space",
              "Converts visible horizontal whitespace such as tabs and non-ASCII spacing characters to ordinary spaces."
            ),
            option(
              "Single space only, no spaces on sides of basename",
              "Collapses runs of ordinary spaces and removes ordinary spaces from the beginning and end of the editable name."
            ),
            option(
              "Remove diacritics",
              "Folds accent marks where Foundation has a direct diacritic-insensitive form, such as résumé to resume. It does not transliterate every non-ASCII letter."
            ),
            option(
              "Clean HTML entities and web encoding",
              "Decodes valid HTML entities and URL percent encoding, such as &amp; to &, %20 to a space, and UTF-8 percent sequences to their text. Unknown or malformed sequences stay unchanged."
            ),
            option("Skip extension", "Protects the final extension segment from all selected cleanup operations."),
          ],
        },
      ],
      examples: [
        example(
          "Turn separators into readable spaces",
          [
            "Dot, Underscore, Hyphen, Plus, Comma: On",
            "Single space only: On",
            "Skip extension: On",
          ],
          [change("file.name_with-many+separators,and+spaces.txt", "file name with many separators and spaces.txt")]
        ),
        example(
          "Remove release notes in brackets",
          ["Parentheses, Square brackets, Curly braces: On", "Single space only: On"],
          [change("Movie (copy) [1080p] {old}.mkv", "Movie.mkv")]
        ),
        example(
          "Decode a web-sourced file name",
          ["Clean HTML entities and web encoding: On", "Skip extension: On"],
          [change("Tom%20%26amp%3B%20Jerry.txt", "Tom & Jerry.txt")]
        ),
        example(
          "Normalize width, accents, and emoji",
          [
            "Convert fullwidth characters to halfwidth: On",
            "Remove diacritics: On",
            "Remove emojis: On",
          ],
          [change("Ｒésumé😀１２３.pdf", "Resume123.pdf")]
        ),
      ],
      tips: [
        "Cleanup runs in a defined order: width conversion, web decoding, bracket removal, separator replacement, whitespace conversion, emoji removal, accent folding, uppercase spacing, then final space cleanup.",
        "Enable Single space only when removed brackets or replaced separators could leave doubled or edge spaces.",
        "Skip number sequences protects numeric sequences only during the selected separator replacements; it does not protect them from other rules.",
      ],
    },
  ];

  rules.push(
    {
      id: "strip",
      name: "Strip",
      summary:
        "Remove or replace selected character categories, or invert the selection to keep only the characters you want.",
      whenToUse: [
        "Remove digits, punctuation, brackets, symbols, or a custom set of characters from file names.",
        "Keep only a controlled character set, such as digits for an extracted identifier.",
      ],
      quickStart: [
        "Select one or more character categories.",
        "Leave Any Position selected to process matching characters throughout the name.",
        "Keep Skip Extension on, then check the preview before enabling keep-only or replacement modes.",
      ],
      optionGroups: [
        {
          title: "Character filters",
          options: [
            option("Letters", "Matches the Latin letters a-z. With Case Sensitive off, uppercase and lowercase are both matched."),
            option("Numbers", "Matches the digits 0-9."),
            option("Symbols", "Matches the app's common symbol set, such as @, #, $, %, &, *, +, and =."),
            option("Other Symbols", "Matches remaining Unicode symbol characters such as infinity, check marks, sun symbols, and music symbols."),
            option("Brackets", "Matches supported round, square, curly, angle, and CJK bracket characters."),
            option("ASCII Punctuation", "Matches the standard ASCII punctuation set."),
            option("CJK Punctuation", "Matches common Chinese, Japanese, and Korean punctuation such as ideographic commas and full stops."),
            option("Typographic Punctuation", "Matches typographic quotes, dashes, ellipses, and similar publishing punctuation."),
            option("Other Punctuation", "Matches remaining Unicode punctuation not covered by the explicit punctuation groups."),
            option("User Defined", "Matches each character entered in the custom filter field."),
          ],
        },
        {
          title: "Position",
          options: [
            option("Any Position", "Processes every selected character wherever it appears."),
            option(
              "Beginning",
              "Processes a continuous run at the beginning of the editable name. Normally this is a run of selected characters; in keep-only mode it is a run of unselected characters."
            ),
            option(
              "End",
              "Processes a continuous run at the end of the editable name. Normally this is a run of selected characters; in keep-only mode it is a run of unselected characters."
            ),
          ],
        },
        {
          title: "Options",
          options: [
            option(
              "Remove all characters except selected",
              "Inverts the removal target. Any Position removes every unselected character. Beginning or End removes only the continuous boundary run of unselected characters and stops at the first selected character."
            ),
            option(
              "Also Match Fullwidth Counterparts",
              "Extends supported ASCII categories and custom characters to their fullwidth or halfwidth equivalents."
            ),
            option(
              "Case Sensitive",
              "For the predefined English letters and ASCII or fullwidth English letters entered under User Defined, requires the same uppercase or lowercase form. It does not change punctuation or number matching."
            ),
            option(
              "Replace Matches",
              "Replaces every matched character with the Replacement text instead of removing it. The replacement is applied once per matched character."
            ),
            option("Skip Extension", "Protects the final extension segment from filtering."),
          ],
        },
      ],
      examples: [
        example(
          "Remove all digits",
          ["Numbers: On", "Position: Any Position", "Skip Extension: On"],
          [change("invoice-2026-0042.pdf", "invoice--.pdf")]
        ),
        example(
          "Remove punctuation only at the end",
          ["ASCII Punctuation: On", "Position: End", "Skip Extension: On"],
          [change("name?!-_.txt", "name.txt")],
          "Only the continuous punctuation run at the end of the base name is removed."
        ),
        example(
          "Remove leading nonletters until the first selected letter",
          [
            "Letters: On",
            "Case Sensitive: On",
            "Remove all characters except selected: On",
            "Position: Beginning",
            "Skip Extension: On",
          ],
          [change("123e456.txt", "e456.txt"), change("e-E - Copy.txt", "e-E - Copy.txt")],
          "Beginning stops as soon as the first selected letter is reached."
        ),
        example(
          "Keep only digits",
          ["Numbers: On", "Remove all characters except selected: On", "Skip Extension: On"],
          [change("Order AB-1207.txt", "1207.txt")]
        ),
        example(
          "Replace ASCII and fullwidth digits",
          [
            "Numbers: On",
            "Also Match Fullwidth Counterparts: On",
            "Replace Matches: On",
            "Replacement text: #",
          ],
          [change("１２3ABC.txt", "###ABC.txt")]
        ),
      ],
      tips: [
        "Beginning and End process one continuous boundary run. Normal mode stops at the first unselected character; keep-only mode stops at the first selected character.",
        "Keep-only mode can produce an empty name when no selected characters are present.",
        "For precise removal of a word or multi-character pattern, use Remove instead of User Defined Strip.",
      ],
    },
    {
      id: "case",
      name: "Case",
      summary:
        "Change capitalization across the file name while optionally preserving the extension or restoring exact case for selected terms.",
      whenToUse: [
        "Standardize mixed capitalization across a set of files.",
        "Preserve brand names, acronyms, or technical terms while applying a broader case style.",
      ],
      quickStart: [
        "Choose one option under Case Change.",
        "Leave Skip Extension on to preserve the extension exactly.",
        "Use exact case for matched segments only when particular words need a fixed spelling.",
      ],
      optionGroups: [
        {
          title: "Case Change",
          options: [
            option("Capitalize Words", "Uppercases the first letter of every word and, by default, lowercases the remaining letters in each word."),
            option("lowercase", "Converts all letters in the editable name to lowercase."),
            option("UPPERCASE", "Converts all letters in the editable name to uppercase."),
            option("iNVERT cASE", "Changes every uppercase letter to lowercase and every lowercase letter to uppercase."),
            option("First letter uppercase", "Uppercases the first character when it is a letter and, by default, lowercases the rest of the editable name."),
            option("Sentence case", "Lowercases the editable name, then capitalizes its first character and the first letter after a period, exclamation mark, or question mark."),
            option("No Change", "Leaves the main case unchanged. This is useful when only exact-case segments or extension casing should be applied."),
            option(
              "Preserve Case",
              "With Capitalize Words, First letter uppercase, or Sentence case, changes only the required leading letters and preserves the existing case of other letters."
            ),
          ],
        },
        {
          title: "Exact-case segments",
          options: [
            option(
              "Use exact case for matched segments",
              "After the main case change, finds each comma-separated segment case-insensitively and restores the exact spelling you entered. Letter-and-number segments match as complete terms rather than inside longer words."
            ),
          ],
        },
        {
          title: "Extension",
          options: [
            option("Skip Extension", "Preserves the final extension segment exactly and takes priority over the two extension case options."),
            option("Lowercase Extension", "Converts the final extension segment to lowercase when Skip Extension is off."),
            option("UPPERCASE Extension", "Converts the final extension segment to uppercase when Skip Extension is off."),
          ],
        },
      ],
      examples: [
        example(
          "Capitalize file-name words",
          ["Case Change: Capitalize Words", "Skip Extension: On"],
          [change("summer TRIP_report.JPG", "Summer Trip_Report.JPG")]
        ),
        example(
          "Lowercase the name but preserve an acronym",
          [
            "Case Change: lowercase",
            "Use exact case for matched segments: On",
            "Segments: API, HTTP",
            "Skip Extension: On",
          ],
          [change("MY API AND HTTP TOOLS.txt", "my API and HTTP tools.txt")]
        ),
        example(
          "Normalize the extension separately",
          ["Case Change: Capitalize Words", "Skip Extension: Off", "Lowercase Extension: On"],
          [change("holiday PHOTO.JPEG", "Holiday Photo.jpeg")]
        ),
      ],
      tips: [
        "Skip Extension overrides Lowercase Extension and UPPERCASE Extension.",
        "Sentence case reacts to . ! and ? inside the editable name; with Skip Extension off, the dot before the extension is also part of the text.",
        "Separate exact-case segments with commas and enter each one with the capitalization you want in the result.",
      ],
    },
    {
      id: "extension",
      name: "Extension",
      summary:
        "Add, replace, remove, detect, append, or de-duplicate the final file extension.",
      whenToUse: [
        "Correct missing or incorrect extensions after files have been exported or downloaded.",
        "Add a secondary suffix such as .bak or remove repeated extensions such as .jpg.jpg.",
      ],
      quickStart: [
        "Enable New extension and enter an extension without the dot.",
        "Leave Append to original extension off to replace the current extension.",
        "Check the preview, especially for names with more than one dot.",
      ],
      optionGroups: [
        {
          title: "Extension source",
          options: [
            option(
              "New extension (without the dot)",
              "Enables extension replacement. Entering md changes report.txt to report.md. Leaving the field empty removes the current extension. A leading dot is accepted but not required."
            ),
            option(
              "Append to original extension",
              "Adds the new extension after the complete current name instead of replacing the final extension, such as data.csv to data.csv.bak."
            ),
            option(
              "Use magic number detection",
              "Ignores the typed extension and detects a suggested extension from the file's content. If detection fails, the existing extension is preserved rather than removed."
            ),
          ],
        },
        {
          title: "Duplicate cleanup",
          options: [
            option(
              "Remove duplicate extensions",
              "Removes repeated copies of the final extension from the end, such as image.jpg.jpg to image.jpg. It compares only trailing extension segments."
            ),
            option(
              "Case sensitive",
              "When duplicate cleanup is on, requires repeated extensions to have the same letter case. With it off, JPG and jpg are treated as duplicates."
            ),
          ],
        },
      ],
      examples: [
        example(
          "Change an extension",
          ["New extension: md", "Append to original extension: Off"],
          [change("document.txt", "document.md"), change("archive.tar.gz", "archive.tar.md")]
        ),
        example(
          "Remove an extension",
          ["New extension: On", "New extension field: Empty"],
          [change("photo.jpeg", "photo"), change("archive.tar.gz", "archive.tar")]
        ),
        example(
          "Append a backup suffix",
          ["New extension: bak", "Append to original extension: On"],
          [change("data.csv", "data.csv.bak")]
        ),
        example(
          "Remove duplicate trailing extensions",
          ["Remove duplicate extensions: On", "Case sensitive: Off"],
          [
            change("movie.mp4.MP4.Mp4", "movie.mp4"),
            change("file.notjpg.jpg", "file.notjpg.jpg", "The adjacent extension segments are different"),
          ]
        ),
      ],
      tips: [
        "Only the final extension segment is replaced. archive.tar.gz becomes archive.tar.zip when the new extension is zip.",
        "Content detection is a best-effort suggestion. Some formats do not have a distinctive signature and may not be identified accurately.",
        "Disable New extension when you want duplicate cleanup without otherwise changing the extension.",
      ],
    },
    {
      id: "padding",
      name: "Padding",
      summary:
        "Expand numeric sequences with leading zeros or pad the whole base name to a fixed length with custom text.",
      whenToUse: [
        "Make embedded numbers sort naturally by giving them a consistent width.",
        "Align short names to a fixed character length with a repeated prefix or suffix pattern.",
      ],
      quickStart: [
        "Enable Number sequence and set Padding Length to the desired digit width.",
        "Leave Text Padding off unless the complete base name also needs padding.",
        "Keep Skip Extension on so numbers in the extension are not changed.",
      ],
      optionGroups: [
        {
          title: "Number sequence",
          options: [
            option(
              "Number sequence",
              "Finds every continuous digit sequence and adds leading zeros until it reaches Padding Length. Longer sequences are left unchanged."
            ),
            option("Padding Length", "The minimum number of digits for each numeric sequence."),
            option(
              "Remove Leading Zeros",
              "Converts every numeric sequence to its ordinary integer form, so 007 becomes 7 and 000 becomes 0. This mode is mutually exclusive with number padding."
            ),
          ],
        },
        {
          title: "Text Padding",
          options: [
            option(
              "Text Padding",
              "Pads the complete editable name only when it is shorter than the selected length."
            ),
            option("Padding Character", "The text pattern repeated to fill the missing length. Multi-character patterns are repeated and clipped exactly to fit."),
            option("Left", "Places text padding at the beginning of the editable name."),
            option("Right", "Places text padding at the end of the editable name."),
          ],
        },
        {
          title: "Options",
          options: [
            option("Skip Extension", "Protects the final extension from number matching and excludes it from whole-name length calculations."),
          ],
        },
      ],
      examples: [
        example(
          "Pad every number to three digits",
          ["Number sequence: On", "Padding Length: 3", "Skip Extension: On"],
          [change("file1.txt", "file001.txt"), change("image_25.jpg", "image_025.jpg")]
        ),
        example(
          "Pad multiple numbers",
          ["Number sequence: On", "Padding Length: 4"],
          [change("vid_1_part_2.mp4", "vid_0001_part_0002.mp4")]
        ),
        example(
          "Remove existing leading zeros",
          ["Number sequence: Off", "Remove Leading Zeros: On"],
          [change("IMG_001_photo_099.jpg", "IMG_1_photo_99.jpg")]
        ),
        example(
          "Pad the whole name on the right",
          ["Text Padding: On", "Padding Length: 10", "Padding Character: xo-", "Position: Right"],
          [change("file.txt", "filexo-xo-.txt")]
        ),
      ],
      tips: [
        "Number padding affects every digit run, not only the last number.",
        "Text Padding counts user-visible characters in the editable name and does nothing when the name is already long enough.",
        "Turn off Skip Extension only when digits in the extension should also be padded or removed.",
      ],
    },
    {
      id: "delete",
      name: "Delete",
      summary:
        "Delete a positional range, a delimiter-defined range, or the complete current name with precise control over both ends.",
      whenToUse: [
        "Remove a fixed number of leading or trailing characters.",
        "Delete everything between markers, from a marker to the end, or from a position to the next delimiter.",
      ],
      quickStart: [
        "Choose Position under Start Position and enter a one-based start value.",
        "Choose Count under End Position and enter how many characters to delete.",
        "Keep Skip extension on and verify the highlighted deletion in the preview.",
      ],
      optionGroups: [
        {
          title: "Start Position",
          options: [
            option(
              "Position",
              "Starts at a one-based character position. Position 1 is the first character. If the position is beyond the editable name, nothing is deleted."
            ),
            option(
              "Delimiters",
              "Starts at the first matching literal delimiter. In Right to left mode, it starts from the last matching delimiter."
            ),
          ],
        },
        {
          title: "End Position",
          options: [
            option("Count", "Deletes the selected number of characters from the start point."),
            option(
              "Delimiters",
              "Deletes through the next matching end delimiter. In Right to left mode, it searches backward for the corresponding delimiter."
            ),
            option("To the end", "Deletes from the selected start point to the relevant end of the editable name."),
          ],
        },
        {
          title: "Options",
          options: [
            option(
              "Preserve delimiters",
              "Keeps the delimiter characters and removes only the content selected around or between them."
            ),
            option(
              "Right to left",
              "Counts positions from the end and searches delimiters backward. Position 1 refers to the final character of the editable name."
            ),
            option(
              "Delete current name",
              "Deletes the entire editable name. With Skip extension on, only the extension remains; with it off, the complete name becomes empty."
            ),
            option("Skip extension", "Protects the final extension segment from positional and delimiter-based deletion."),
          ],
        },
      ],
      examples: [
        example(
          "Delete the first three characters",
          ["Start Position: Position 1", "End Position: Count 3", "Right to left: Off", "Skip extension: On"],
          [change("12345678.txt", "45678.txt")]
        ),
        example(
          "Delete the final three characters of the base name",
          ["Start Position: Position 1", "End Position: Count 3", "Right to left: On", "Skip extension: On"],
          [change("12345678.txt", "12345.txt")]
        ),
        example(
          "Delete between delimiters but keep them",
          [
            "Start Position: Delimiters (",
            "End Position: Delimiters )",
            "Preserve delimiters: On",
            "Skip extension: On",
          ],
          [change("file(to be deleted)end.txt", "file()end.txt")]
        ),
        example(
          "Delete between delimiters including the markers",
          [
            "Start Position: Delimiters (",
            "End Position: Delimiters )",
            "Preserve delimiters: Off",
            "Skip extension: On",
          ],
          [change("file(to be deleted)end.txt", "fileend.txt")]
        ),
      ],
      tips: [
        "Position values count user-visible characters, including emoji, from 1.",
        "Delimiter matching is literal and case-sensitive. If a required delimiter is not found, the name is left unchanged.",
        "Delete current name can intentionally produce only an extension such as .txt; check the preview before renaming.",
      ],
    }
  );

  rules.push(
    {
      id: "regular-expression",
      name: "Regular Expression",
      summary:
        "Use a regular expression to match structured text and replace every match with text, capture groups, or file-specific metadata.",
      whenToUse: [
        "Rename patterns that cannot be expressed clearly with ordinary text or simple wildcards.",
        "Reorder date parts, extract identifiers, or normalize several structural variants with capture groups.",
      ],
      quickStart: [
        "Enter a regular expression in Regular Expression Pattern.",
        "Enter the replacement template in Replacement Text, using $1, $2, and so on for capture groups.",
        "Keep Skip Extension on until the pattern is intentionally meant to inspect the extension.",
      ],
      optionGroups: [
        {
          title: "Expression",
          options: [
            option(
              "Regular Expression Pattern",
              "The Foundation regular expression applied to the editable name. Every match is replaced. An empty or invalid expression leaves the name unchanged."
            ),
            option(
              "Replacement Text",
              "The replacement template. Use $0 for the complete match and $1, $2, and so on for parenthesized capture groups. Leave it empty to delete matches."
            ),
            option(
              "Select Metadata Tag",
              "Inserts a metadata token into Replacement Text. The token is resolved for each file before the regular expression replacement runs."
            ),
          ],
        },
        {
          title: "Options",
          options: [
            option("Case Sensitive", "Makes uppercase and lowercase distinct while matching the expression."),
            option(
              "Skip Extension",
              "Protects the final extension segment. The regular expression still sees dots that remain inside a multi-extension base name."
            ),
          ],
        },
      ],
      examples: [
        example(
          "Replace every number run",
          ["Regular Expression Pattern: \\d+", "Replacement Text: #", "Skip Extension: On"],
          [change("file123-part45.txt", "file#-part#.txt")]
        ),
        example(
          "Reformat a date",
          [
            "Regular Expression Pattern: (\\d{4})-(\\d{2})-(\\d{2})",
            "Replacement Text: $1.$2.$3",
            "Skip Extension: On",
          ],
          [change("report-2026-07-17.pdf", "report-2026.07.17.pdf")]
        ),
        example(
          "Change text inside a multi-extension name",
          ["Regular Expression Pattern: \\.(\\w+)$", "Replacement Text: -$1", "Skip Extension: On"],
          [change("v2.0.0.tar.gz", "v2.0.0-tar.gz")],
          "Skip Extension protects only .gz, so .tar remains available to the expression."
        ),
      ],
      tips: [
        "Use Replace wildcard mode for simpler patterns; use Regular Expression when you need anchors, alternation, lookarounds, or grouped structure.",
        "Replacement Text uses Foundation replacement-template syntax, where capture groups are referenced with dollar signs.",
        "Open Capture Group Preview in the app when you need to verify which part of a sample name each group captures.",
      ],
    },
    {
      id: "user-input",
      name: "User Input",
      summary:
        "Apply a prepared list of names to files one line at a time in the current file-list order.",
      whenToUse: [
        "Rename files from an external list supplied by a client, spreadsheet, transcript, or catalog.",
        "Add a different prefix or suffix to every file without constructing a sequence rule.",
      ],
      quickStart: [
        "Enter one new value per line under One new file name per line.",
        "Choose Replace Current Name and keep Skip Extension on.",
        "Make sure the name list and file list are in the same intended order before adding the rule.",
      ],
      optionGroups: [
        {
          title: "Name list",
          options: [
            option(
              "One new file name per line",
              "The ordered values assigned to files. The first line applies to the first file, the second line to the second file, and so on. Empty lines are ignored."
            ),
            option(
              "Import from File",
              "Replaces the current list with the nonempty lines from a UTF-8 text file. Each physical line becomes one value."
            ),
            option(
              "Extract file names",
              "Selects files or folders and appends the collected file names to the current list. The extraction dialog can include or omit extensions."
            ),
            option(
              "Sort Ascending / Sort Descending",
              "Sorts the entered values using the same natural string comparison style as the file list. Repeated clicks switch direction."
            ),
            option("Clear List", "Removes all entered names."),
          ],
        },
        {
          title: "Placement",
          options: [
            option("Add to Beginning", "Adds each list value before the current editable name."),
            option("Add to End", "Adds each list value after the current editable name."),
            option("Replace Current Name", "Replaces the current editable name with the corresponding list value."),
            option(
              "Skip Extension",
              "Excludes the original final extension from placement and adds it back afterward. In Replace Current Name mode, this preserves each file's original extension."
            ),
          ],
        },
      ],
      examples: [
        example(
          "Assign a list of titles",
          [
            "Names: Introduction / Installation / First Steps",
            "Placement: Replace Current Name",
            "Skip Extension: On",
          ],
          [
            change("001.mp4", "Introduction.mp4"),
            change("002.mp4", "Installation.mp4"),
            change("003.mp4", "First Steps.mp4"),
          ]
        ),
        example(
          "Add a different label to each file",
          ["Names: Front- / Back- / Detail-", "Placement: Add to Beginning", "Skip Extension: On"],
          [
            change("shirt.jpg", "Front-shirt.jpg"),
            change("shirt.jpg", "Back-shirt.jpg"),
            change("shirt.jpg", "Detail-shirt.jpg"),
          ]
        ),
        example(
          "Use fewer names than files",
          ["Names: One / Two", "Placement: Replace Current Name"],
          [
            change("a.txt", "One.txt"),
            change("b.txt", "Two.txt"),
            change("c.txt", "c.txt", "No third list value is available, so this file is unchanged")
          ]
        ),
      ],
      tips: [
        "Assignment follows current file-list order, not alphabetical order unless the list is already sorted that way.",
        "Extra list values are unused. Extra files remain unchanged after the list is exhausted.",
        "When Skip Extension is off, a list value in Replace Current Name mode replaces the full name, so include an extension in the list if one is required.",
      ],
    },
    {
      id: "randomize",
      name: "Randomize",
      summary:
        "Generate a random character sequence or UUID for every file and insert it at a selected position.",
      whenToUse: [
        "Obscure meaningful names or add collision-resistant identifiers before exporting files.",
        "Create short random batch labels from a controlled character set.",
      ],
      quickStart: [
        "Set Length and leave Digits selected under Use Characters.",
        "Keep Unique if possible on for a batch of files.",
        "Choose Prefix, Suffix, Position, or Replace Current Name and keep Skip Extension on.",
      ],
      optionGroups: [
        {
          title: "Random value",
          options: [
            option("Length", "The number of generated characters when using character sources. UUID formats use their own fixed lengths."),
            option(
              "Unique if possible",
              "Tries to avoid repeating a generated character sequence within the current batch. It is best-effort: duplicates can occur when the character space is exhausted or repeated attempts do not find a new value."
            ),
            option("Digits (0-9)", "Adds decimal digits to the random character pool."),
            option("Letters (a-z, A-Z)", "Adds lowercase and uppercase Latin letters to the character pool."),
            option(
              "User Custom",
              "Adds the entered custom characters to the pool. Duplicate characters across selected sources are automatically de-duplicated."
            ),
            option("UUID", "Generates a lowercase UUID instead of using Length and character sources. Standard and Compact retain the full UUID; First 8 characters is only a shortened prefix."),
            option("Standard format (with hyphens)", "Uses a 36-character UUID such as 123e4567-e89b-12d3-a456-426614174000."),
            option("Compact format (no hyphens)", "Uses the same UUID without hyphens."),
            option("First 8 characters", "Uses only the first eight characters of a UUID."),
          ],
        },
        {
          title: "Insert Position",
          options: [
            option("Prefix", "Adds the random value at the beginning."),
            option("Suffix", "Adds the random value at the end of the editable name."),
            option("Position", "Inserts before a one-based character position, clamped to the name's bounds."),
            option("Replace Current Name", "Replaces the editable name with the generated value."),
            option("Skip Extension", "Protects the final extension segment and keeps it after the generated value."),
          ],
        },
      ],
      examples: [
        example(
          "Add a four-character batch prefix",
          ["Length: 4", "Digits: On", "Letters: On", "Unique if possible: On", "Position: Prefix"],
          [change("report.pdf", "A7k2report.pdf")],
          "A7k2 is one possible result; the actual value changes every time."
        ),
        example(
          "Replace names with short UUID values",
          ["UUID: On", "UUID format: First 8 characters", "Position: Replace Current Name", "Skip Extension: On"],
          [change("customer-list.csv", "7f3a91c2.csv")],
          "The shown UUID prefix is illustrative."
        ),
        example(
          "Use a controlled custom alphabet",
          ["Length: 3", "Digits: Off", "Letters: Off", "User Custom: ABC", "Position: Suffix"],
          [change("sample.txt", "sampleBAC.txt")],
          "BAC is one possible result."
        ),
      ],
      tips: [
        "Select at least one character source when UUID is off; otherwise the rule produces no value and leaves the name unchanged.",
        "Unique if possible resets for each batch preview or rename operation and is not a permanent uniqueness registry.",
        "Use the full Standard or Compact UUID format when collision resistance matters. First 8 characters is shorter but has a much smaller value space.",
      ],
    },
    {
      id: "script",
      name: "Script",
      summary:
        "Run JavaScript against each file name and its file properties to produce a completely custom new name.",
      whenToUse: [
        "Express conditional or multi-step logic that would require many ordinary rules.",
        "Build names from dates, sizes, folders, metadata tokens, or custom string transformations.",
      ],
      quickStart: [
        "Choose a built-in Preset or enter a script in the editor.",
        "Return the complete new file name as a string, including the extension when one is required.",
        "Use Check Syntax before adding the rule, then confirm real-file results in the preview.",
      ],
      optionGroups: [
        {
          title: "Editor",
          options: [
            option("Preset", "Loads a built-in or saved user script. Editing a preset marks it as modified without silently changing the saved preset."),
            option("Script", "The JavaScript body executed once for each file inside a strict-mode function."),
            option("Save As", "Saves the current script as a named user preset. Existing names can be overwritten after confirmation."),
            option("Check Syntax", "Checks parsing with sample runtime values. A string or number is accepted as a new name; null is also valid and means leave the name unchanged."),
            option("Help", "Opens the in-app JavaScript variable and return-value reference."),
            option(
              "Select Metadata Tag",
              "Inserts a metadata token into the script. Inserted tokens behave as read-only text values and are loaded separately for each file. Typing a metadata lookup manually does not create a metadata dependency."
            ),
          ],
        },
        {
          title: "Available variables",
          options: [
            option("fileName", "The current file name without its final extension."),
            option("extension", "The final extension without the dot, or an empty string when there is no extension."),
            option("fullName", "The complete current file name including its extension."),
            option("isDirectory", "A Boolean that is true for a directory."),
            option("fileSize", "The file size in bytes, or 0 when unavailable."),
            option("parentFolder", "The parent folder name when available."),
            option("creationDate", "A JavaScript Date object, or null when the creation date is unavailable."),
            option("modifiedDate", "A JavaScript Date object, or null when the modification date is unavailable."),
            option(
              "convertChinese(text, direction)",
              "Converts Chinese text. Use Hans-Hant for Simplified to Traditional or Hant-Hans for Traditional to Simplified."
            ),
          ],
        },
        {
          title: "Return value",
          options: [
            option(
              "Return the new name",
              "Return a string or number. A null, undefined, empty, errored, or unchanged result leaves the original name unchanged. The returned string is the complete name, so add the dot and extension yourself when needed."
            ),
          ],
        },
      ],
      examples: [
        example(
          "Replace spaces with underscores",
          ["Preset: None", "Script: Custom"],
          [change("Project Notes.txt", "Project_Notes.txt")],
          "",
          "return fileName.replace(/ /g, '_') + (extension ? '.' + extension : '');"
        ),
        example(
          "Add the creation date",
          ["Preset: None", "Script: Custom"],
          [change("scan.pdf", "2026-07-17_scan.pdf", "Example date")],
          "",
          "if (!creationDate) return fullName;\nvar y = creationDate.getFullYear();\nvar m = String(creationDate.getMonth() + 1).padStart(2, '0');\nvar d = String(creationDate.getDate()).padStart(2, '0');\nreturn y + '-' + m + '-' + d + '_' + fileName + (extension ? '.' + extension : '');"
        ),
        example(
          "Skip small files",
          ["Preset: None", "Script: Custom"],
          [change("large.mov", "large-reviewed.mov"), change("small.txt", "small.txt", "Unchanged when under 1 MB")],
          "",
          "if (fileSize < 1024 * 1024) return fullName;\nreturn fileName + '-reviewed' + (extension ? '.' + extension : '');"
        ),
      ],
      tips: [
        "The script runs in JavaScriptCore and cannot rename files directly; it only returns the proposed name.",
        "Always handle files without extensions when constructing a dot plus extension.",
        "A syntax check uses sample values. The file-list preview is the final check for real metadata and file properties.",
      ],
    },
    {
      id: "map",
      name: "Map",
      summary:
        "Match current names against an imported or pasted table and replace each match with its paired new name.",
      whenToUse: [
        "Apply an authoritative old-name to new-name list from another system.",
        "Rename media from torrent root names, catalog identifiers, or manually prepared CSV and tab-delimited data.",
      ],
      quickStart: [
        "Import a file or paste mapping rows from the clipboard.",
        "Confirm that Name (Match) contains current names and New Name (Replace) contains desired names.",
        "Keep Skip Extension on when the table contains base names rather than complete file names.",
      ],
      optionGroups: [
        {
          title: "Mapping data",
          options: [
            option(
              "Import File",
              "Appends mapping rows from CSV, semicolon-delimited, tab-delimited, plain text, or torrent files. Text rows use the first comma, semicolon, or tab as the split; quoted CSV fields and doubled quote escapes are supported."
            ),
            option("Paste from Clipboard", "Appends mapping rows parsed from clipboard text using the same text format."),
            option("Clear", "Removes all mapping rows."),
            option("Name (Match)", "The current name to find. This is the left column unless Reverse Mapping is on."),
            option("New Name (Replace)", "The complete replacement base name. This is the right column unless Reverse Mapping is on."),
          ],
        },
        {
          title: "Matching options",
          options: [
            option(
              "Partial Match",
              "Allows Name (Match) to be contained anywhere in the editable file name. A successful partial match still replaces the whole editable name; it is not a substring replacement."
            ),
            option("Reverse Mapping", "Swaps the match and replacement columns, allowing the same table to be applied in the opposite direction."),
            option(
              "Skip Extension",
              "Removes the file's final extension before matching and adds it to the mapped result. Mapping-table values themselves are not stripped automatically."
            ),
            option(
              "Allow Reuse",
              "Lets one mapping row rename every matching file. With it off, each row is consumed once, which allows duplicate match rows to assign different names to duplicate input names."
            ),
            option("Case Sensitive", "Requires exact letter case in the match column. With it off, matching ignores case."),
          ],
        },
      ],
      examples: [
        example(
          "Apply an exact mapping table",
          [
            "Rows: IMG_001 -> Beach / IMG_002 -> Forest",
            "Partial Match: Off",
            "Skip Extension: On",
          ],
          [change("IMG_001.jpg", "Beach.jpg"), change("IMG_002.png", "Forest.png")]
        ),
        example(
          "Use partial match for names with extra text",
          ["Row: S01E01 -> Pilot", "Partial Match: On", "Skip Extension: On"],
          [change("Show.Name.S01E01.1080p.mkv", "Pilot.mkv")],
          "The entire base name is replaced with Pilot."
        ),
        example(
          "Assign different names to duplicate inputs",
          [
            "Rows: scan -> Front / scan -> Back",
            "Allow Reuse: Off",
            "Skip Extension: On",
          ],
          [change("scan.jpg", "Front.jpg"), change("scan.jpg", "Back.jpg")]
        ),
        example(
          "Reuse one mapping row",
          ["Row: episode -> E01", "Allow Reuse: On", "Case Sensitive: Off"],
          [change("Episode.mkv", "E01.mkv"), change("episode.mp4", "E01.mp4")]
        ),
      ],
      tips: [
        "Mapping row order matters. With Partial Match and Allow Reuse on, the first matching row wins.",
        "A text row without a delimiter maps its match value to an empty replacement name.",
        "With Allow Reuse off, rows and files are paired one-to-one; unmatched files remain unchanged.",
      ],
    }
  );

  for (const rule of rules) {
    rule.notes = {
      name: "Notes",
      description:
        "Turn on Notes to store a reminder about this rule. Notes help you recognize the rule later and do not change the rename result.",
    };
  }

  globalThis.LIGHTNING_RENAMER_RULE_HELP = { rules };
})();
