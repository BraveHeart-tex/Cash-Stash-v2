export function formatNumber(event: any) {
  const input = event.target;
  const value = input.value.replace(/\D/g, ''); // Remove non-digit characters
  const formattedValue = Number(value).toLocaleString(); // Format the number with thousand separators

  input.value = formattedValue;
}
