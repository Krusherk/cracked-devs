const names = [
  "Jack", "Annie", "Mona", "Liam", "Ella", "Noah", "Zara",
  "Omar", "Layla", "Eli", "Nina", "Kai", "Ruby", "Ayan"
]

export function randomName() {
  return names[Math.floor(Math.random() * names.length)];
}
