export function generateSlug(title: string): string {
  return title
    .normalize("NFD") // Normaliza a string removendo acentos
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "") // remove caracteres inválidos
    .replace(/\s+/g, "-") // substitui espaços por hífens
    .replace(/-+/g, "-"); // substitui múltiplos hífens por um único
}
