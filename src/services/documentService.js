import { supabase } from "../lib/supabaseClient";
import { getEmbedding } from "../utils/openaiClient";

export async function uploadDocument({ file, leaseId }) {
  const fileExt = file.name.split('.').pop();
  const fileName = \`\${Date.now()}.\${fileExt}\`;

  // 1. Upload file to Supabase storage
  const { data: storageData, error: storageError } = await supabase
    .storage
    .from("documents")
    .upload(fileName, file);

  if (storageError) throw new Error(\`Storage error: \${storageError.message}\`);

  const fileUrl = storageData.path;

  // 2. Read and embed file content
  const text = await file.text(); // assuming small file or preprocessed
  const embedding = await getEmbedding(text);

  // 3. Insert metadata + embedding into \`document\` table
  const { error: insertError } = await supabase
    .from("document")
    .insert({
      lease_id: leaseId,
      filename: file.name,
      file_url: fileUrl,
      embedding_vector: embedding,
    });

  if (insertError) throw new Error(\`Insert error: \${insertError.message}\`);

  return { success: true };
}
