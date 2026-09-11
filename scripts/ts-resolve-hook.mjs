// Payload CLI beží cez natívne odstránenie typov v Node 22. To ale nevie
// domyslieť príponu .ts pri relatívnych importoch bez prípony, ktoré TypeScript
// bežne povoľuje — tento hook ju doplní, keď rozlíšenie inak zlyhá.
export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    if (
      (specifier.startsWith(".") || specifier.startsWith("/")) &&
      !/\.[a-zA-Z0-9]+$/.test(specifier)
    ) {
      return nextResolve(specifier + ".ts", context);
    }
    throw err;
  }
}
