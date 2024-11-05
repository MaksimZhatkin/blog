export const truncate = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }
  const trimmedText = text.substr(0, maxLength);
  const lastSpaceIndex = trimmedText.lastIndexOf(' ');

  if (lastSpaceIndex === -1) {
    return `${trimmedText}...`;
  }

  return `${trimmedText.slice(0, lastSpaceIndex)}...`;
};
