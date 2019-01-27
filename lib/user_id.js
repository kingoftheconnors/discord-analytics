const MENTION_SYNTAX = /<@(\d+)>/;

/**
 * Determines whether a portion of the command string is a mention
 *
 * @param mentionStr string
 * @return string|bool
 */
function parseMention(mentionStr) {
  var result = MENTION_SYNTAX.exec(mentionStr);
  if (result === null) {
    return false;
  }

  return result[1];
}

module.exports = parseMention;
