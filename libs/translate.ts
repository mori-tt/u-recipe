export async function translate(text: string) {
  let content = encodeURI(
    `auth_key=${process.env.NEXT_PUBLIC_DEEPL_API_KEY}&text=${text}&source_lang=JA&target_lang=EN`
  );
  let url = `${process.env.NEXT_PUBLIC_DEEPL_URL}?${content}`;

  const res = await fetch(url);
  const data = await res.json();

  console.log(data);
  return data;
}

export async function translateToJa(text: string) {
  let content = encodeURI(
    `auth_key=${process.env.NEXT_PUBLIC_DEEPL_API_KEY}&text=${text}&source_lang=EN&target_lang=JA`
  );
  let url = `${process.env.NEXT_PUBLIC_DEEPL_URL}?${content}`;

  const res = await fetch(url);
  const data = await res.json();

  console.log(data);
  return data;
}
