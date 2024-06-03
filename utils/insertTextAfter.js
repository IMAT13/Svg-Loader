export default function insertTextAfter(text, substring, newText) {
  const index = text.indexOf(substring);
  if (index !== -1) {
    const insertIndex = index + substring.length;
    const modifiedText = text.slice(0, insertIndex) + newText + text.slice(insertIndex);
    return modifiedText;
  } else {
    return text;
  }
}
