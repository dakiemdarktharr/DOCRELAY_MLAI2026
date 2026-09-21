import type { ConversationLabel } from "./conversation";
import type { KnowledgeArticle } from "./knowledge";
import { normalize } from "./text";
// Search aliases never alter intake/policy evidence or confer authority.
const aliases: Array<[RegExp, string]> = [
  [/\b(?:an gi|an mon|mon an|bua an|dinner|lunch|what.*eat)\b/g, "meal"],
  [/\b(?:khoi phuc|lay lai|recovery|recover)\b/g, "recover"],
  [/\b(?:tai khoan|account)\b/g, "account"],
  [/\b(?:gmail|google)\b/g, "google"],
  [
    /\b(?:ten dang nhap|username|dia chi email|dia chi gmail|tim email)\b/g,
    "username",
  ],
  [
    /\b(?:ma xac minh|email xac minh|verification code|verify code)\b/g,
    "verification",
  ],
  [/\b(?:khong nhan|missing|not received|khong thay)\b/g, "missing"],
  [/\b(?:thiet bi|device)\b/g, "device"],
  [/\b(?:he dieu hanh|operating system|os)\b/g, "platform"],
  [/\b(?:nha phat hanh|publisher)\b/g, "publisher"],
  [/\b(?:chi phi|cost|budget|du tru)\b/g, "cost"],
  [/\b(?:chuan bi|prepare|preparation)\b/g, "prepare"],
  [/\b(?:nghi phep|phep nam|annual leave|leave days)\b/g, "leave"],
  [/\b(?:lam viec tu xa|remote work|work from home|wfh)\b/g, "remote"],
  [/\b(?:phan mem|software|chuong trinh|ung dung|app)\b/g, "software"],
  [/\b(?:trinh duyet|browser)\b/g, "browser"],
  [/\b(?:trang web|website|web page)\b/g, "website"],
  [/\b(?:mo ta loi|describe (?:an )?error|bao loi)\b/g, "describeerror"],
  [/\b(?:bua sang|an sang|breakfast)\b/g, "breakfast"],
  [/\b(?:banh kem|cake)\b/g, "cake"],
  [/\b(?:quyen quan tri|administrator permission)\b/g, "adminpermission"],
];
const stop = new Set(
  "toi minh ban cua la va co the cho mot cac nhu nao gi o duoc de can khi hay voi nay toi muon lam sao cach huong dan the a an i my me you your how what which can do to for of is are in on at should use get it this does without thi xin vui long cong ty company tai bao nhieu nen kiem tra su dung bi".split(
    " ",
  ),
);
export function searchTokens(value: string): string[] {
  let text = normalize(value);
  for (const [pattern, replacement] of aliases)
    text = text.replace(pattern, replacement);
  return text
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 1 && !stop.has(word));
}
function oneEdit(a: string, b: string) {
  if (a.length < 5 || b.length < 5 || Math.abs(a.length - b.length) > 1)
    return false;
  let i = 0,
    j = 0,
    edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length <= b.length) j++;
    if (a.length >= b.length) i++;
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}
/** Small-corpus BM25: content relevance first, label only breaks near ties. */
export function searchKnowledge(
  rows: KnowledgeArticle[],
  question: string,
  label: ConversationLabel,
) {
  const documents = rows.map((row) => ({
    row,
    tokens: searchTokens(
      `${row.title} ${row.keywords.join(" ")} ${row.answer}`,
    ),
  }));
  const dictionary = [...new Set(documents.flatMap((item) => item.tokens))];
  const query = [...new Set(searchTokens(question))].map((word) =>
    dictionary.includes(word)
      ? word
      : (dictionary.find((candidate) => oneEdit(word, candidate)) ?? word),
  );
  const average =
    documents.reduce((n, item) => n + item.tokens.length, 0) /
    Math.max(1, documents.length);
  const ranked = documents
    .map(({ row, tokens }) => {
      let score = 0,
        matches = 0,
        focusMatches = 0;
      const focus = new Set(
        searchTokens(`${row.title} ${row.keywords.join(" ")}`),
      );
      for (const word of query) {
        const frequency = tokens.filter((token) => token === word).length;
        if (!frequency) continue;
        matches++;
        const count = documents.filter((item) =>
          item.tokens.includes(word),
        ).length;
        const idf = Math.log(
          1 + (documents.length - count + 0.5) / (count + 0.5),
        );
        score +=
          (idf * frequency * 2.2) /
          (frequency +
            1.2 * (0.25 + (0.75 * tokens.length) / Math.max(1, average)));
        if (focus.has(word)) {
          score += idf;
          focusMatches++;
        }
      }
      // Known social intents have little lexical content; never apply this shortcut to technical facts.
      const social =
        ["GREETING", "IDENTITY", "CAPABILITIES"].includes(label) &&
        row.label === label;
      return {
        row,
        score: score + (row.label === label ? 0.25 : 0) + (social ? 8 : 0),
        matches,
        focusMatches,
        social,
      };
    })
    .filter(
      (item) =>
        item.social ||
        (item.matches > 0 && item.focusMatches > 0 && item.score >= 2),
    );
  return ranked
    .sort((a, b) => b.score - a.score || a.row._id.localeCompare(b.row._id))
    .slice(0, 3)
    .map((item) => item.row);
}
